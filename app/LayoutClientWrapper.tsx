"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/pageComponents/footer";
import NavBarWrapper from "@/components/pageComponents/NavBarWrapper";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hideAuthPagesElements = pathname === "/auth/login" || pathname === "/auth/register"; // Combined condition

  useEffect(() => {
    if (searchParams.get("loginSuccess") === "true") {
      toast.success("Login successful!");
      // Remove the query parameter to prevent the toast from reappearing on refresh
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("loginSuccess");
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col justify-between items-center text-xs md:text-sm px-4 sm:px-8 md:px-12 bg-amber-50">
      {!hideAuthPagesElements && <NavBarWrapper />} {/* Use combined condition */}
      {children}
      {!hideAuthPagesElements && <Footer />} {/* Use combined condition */}
      <Toaster position="bottom-right" />
    </div>
  );
}
