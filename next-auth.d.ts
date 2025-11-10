import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Added role
      isNewUser?: boolean; // Added isNewUser
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string; // Added role
    isNewUser?: boolean; // Added isNewUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Added role
    isNewUser?: boolean; // Added isNewUser
  }
}
