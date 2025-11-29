"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { MouseEventHandler, ReactNode } from "react";

interface LoadingButtonProps extends Omit<ButtonProps, "onClick"> {
  children: ReactNode;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loadingText?: string;
}

export default function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  onClick,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}