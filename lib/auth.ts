// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

// This is where we configure NextAuth.js. It's the heart of our authentication system.
export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug mode for NextAuth
  // We're using the Prisma adapter to connect NextAuth.js to our database.
  // This allows us to store user and session information in our database.
  adapter: PrismaAdapter(prisma),
  // We're using JSON Web Tokens (JWT) for our session strategy.
  // This is a common and secure way to handle sessions.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login", // Redirect unauthenticated users to this page
    // error: "/auth/register", // Temporarily removed to diagnose CLIENT_FETCH_ERROR
  },
  // Here we define the authentication providers we want to use.
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email. Please register.");
        }

        console.log("Credentials password:", credentials.password);
        console.log("User password:", user.password);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        // Return user object without the password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  // Callbacks are functions that are called at specific times during the authentication process.
  // We can use them to customize the behavior of NextAuth.js.
  callbacks: {
    // The jwt callback is called whenever a JWT is created or updated.
    // We're adding the user's ID and name to the token so we can access it in the session callback.
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });
        token.id = user.id;
        token.name = user.name;
        token.role = dbUser?.role || "USER";
        // Transfer isNewUser flag from user to token
        if ((user as any).isNewUser !== undefined) {
          token.isNewUser = (user as any).isNewUser;
        }
      }
      return token;
    },

    // The session callback is called whenever a session is accessed.
    // We're adding the user's ID and name to the session object so we can access it in our components.
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string; name?: string; role?: string; isNewUser?: boolean }).id =
          token.id as string;
        session.user.name = token.name as string;
        (session.user as { role?: string }).role = token.role as string;
        // Transfer isNewUser flag from token to session
        if (token.isNewUser !== undefined) {
          (session.user as any).isNewUser = token.isNewUser;
        }
      }
      return session;
    },

    // The signIn callback is called when a user is attempting to sign in.
    // We use it to prevent sign-in if the user's email is not already in our database.
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        let isNewUser = false;
        if (!existingUser) {
          // If user does not exist, create them
          existingUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name || "User", // Use user.name from social profile, or a default
            },
          });
          console.log(`Created new user: ${existingUser.email}`);
          isNewUser = true;
        }

        // Now that we have an existingUser (either found or created), link the account
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
              refresh_token: account.refresh_token,
              scope: account.scope,
              session_state: account.session_state,
              token_type: account.token_type,
            },
          });
          console.log(
            `Linked ${account.provider} account to user: ${existingUser.email}`,
          );
        }
        // Attach isNewUser flag to the user object that gets passed to jwt callback
        (user as any).isNewUser = isNewUser;
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url === baseUrl) {
        return `${baseUrl}?loginSuccess=true`;
      }
      return url;
    },
  },
};
