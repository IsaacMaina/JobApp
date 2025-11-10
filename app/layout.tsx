import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClientWrapper from "./LayoutClientWrapper";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// We're using the Geist font from Vercel. It's a modern, clean font that looks great.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "jobApp - Find Your Next Opportunity",
    template: "%s | jobApp",
  },
  description: "jobApp helps you find and manage your next career opportunity. Post jobs, apply easily, and track your applications.",
  icons: {
    icon: "/favicon.ico", // Now using the generated .ico file
  },
};

// This is the root layout for the entire application.
// It wraps every page with the NavBar and Footer components.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <SessionProviderWrapper session={session}>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
