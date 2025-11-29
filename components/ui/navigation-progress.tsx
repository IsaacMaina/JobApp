"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { usePathname } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();

  return (
    <ProgressBar
      height="4px"
      color="#991b1b" // red-900 color to match your theme
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}