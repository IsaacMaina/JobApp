"use client";

import { useState } from "react";
import NavBar from "./navBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import UserAccountNav from "./UserAccountNav";
import { toast } from "sonner";

export default function NavBarWrapper() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

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
  
    if (isMobile) {
      return (
        <div className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/60 shadow-sm">
          <nav className="flex justify-between items-center px-6 py-3">
                    <Link href={!session && pathname === "/landing" ? "/landing" : "/"} className="text-red-900 font-bold text-lg">
                      My Job
                    </Link>          {session && <UserAccountNav user={session.user} />} {/* Moved here */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[250px] sm:w-[300px] backdrop-blur-md bg-white/60"
            >
              <div className="flex flex-col items-start gap-4 p-4">
                {dynamicLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-lg font-semibold transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-red-900 font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-900"
                        : "hover:text-red-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {session ? (
                  <>
                    <div className="w-full">
                      <Button className="w-full justify-start bg-amber-50 text-red-900 border-2 border-red-900 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer px-4 py-2">
                        <Link
                          href="/jobs/post"
                          onClick={() => setIsOpen(false)}
                        >
                          Post Job
                        </Link>
                      </Button>
                    </div>
                    <Button
                      className="w-full justify-start bg-red-900 text-amber-50 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer px-4 py-2"
                      variant="ghost"
                      onClick={() => {
                        signOut({
                          callbackUrl: `${window.location.origin}/auth/login`,
                        });
                        toast.success("Logged out successfully!");
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <Button className="w-full justify-start hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50">
                      <Link
                        href="/api/auth/signin"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full justify-start hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50">
                      <Link
                        href="/auth/register"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    );
  } else {
    return <NavBar pathname={pathname} />;
  }
}
