"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import UserAccountNav from "./UserAccountNav";
import { useSession } from "next-auth/react";

// The main navigation bar for the site. It's sticky, so it stays at the top of the page as you scroll.
export default function NavBar({ pathname }: { pathname: string }) {
  const { data: session } = useSession();

  const dynamicLinks = session
    ? [
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Jobs", href: "/jobs" },
      ]
    : pathname === "/landing"
      ? []
      : [
          { label: "Home", href: "/landing" },
          { label: "Jobs", href: "/landing" },
        ];

  return (
    // The backdrop-blur and bg-white/60 classes give the navbar a cool, semi-transparent look.
    <div className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/60 shadow-sm">
      <nav className="flex justify-between items-center px-6 py-3">
        {/* The main logo, which links back to the homepage. */}
        <Link href={!session && pathname === "/landing" ? "/landing" : "/"} className="text-red-900 font-bold text-lg">
          My Job
        </Link>

        {/* The main navigation links, mapped from our links array. */}
        <ul className="flex justify-center items-center gap-4 font-semibold text-gray-800">
          {dynamicLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`hover:text-red-900 transition-colors duration-200 ${pathname === link.href ? "text-red-900 font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-900" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {session?.user?.role === "ADMIN" && (
            <li>
              <Link
                href="/admin/datahouse"
                className={`hover:text-red-900 transition-colors duration-200 ${pathname === "/admin/datahouse" ? "text-red-900 font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-900" : ""}`}
              >
                Datahouse
              </Link>
            </li>
          )}
          {session ? (
            <>
              <li>
                <Button className="hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50">
                  <Link href="/jobs/post">post Job</Link>
                </Button>
              </li>
              <li>
                <UserAccountNav user={session.user} />
              </li>
            </>
          ) : (
            <>
              <li>
                <Button className="hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50">
                  <Link href="/api/auth/signin">Login</Link>
                </Button>
              </li>
              <li>
                <Button className="hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50">
                  {" "}
                  <Link href="/auth/register">Register</Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
