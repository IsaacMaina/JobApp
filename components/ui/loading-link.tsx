// components/ui/loading-link.tsx
"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { useState } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

type LoadingLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function LoadingLink({
  href,
  children,
  className,
  onClick,
  ...props
}: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    setIsLoading(true);
    // Let the navigation happen naturally, reset loading after slight delay
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Link>
  );
}

type LoadingButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function LoadingButtonLink({
  href,
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  ...props
}: LoadingButtonLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    setIsLoading(true);
    // Let the navigation happen naturally, reset loading after slight delay
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-block" // Ensure link behaves correctly with button
      {...props}
    >
      <Button
        variant={variant}
        size={size}
        disabled={isLoading}
        className={cn(className, "flex items-center justify-center gap-2")}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </Button>
    </Link>
  );
}