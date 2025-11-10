import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, type, error, ...props }: InputProps) {
  // ✅ Remove the `value` prop if it's a file input
  const inputProps =
    type === "file"
      ? Object.fromEntries(
          Object.entries(props).filter(([key]) => key !== "value")
        )
      : { ...props };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-orange-500" : "",
        className
      )}
      {...inputProps}
    />
  );
}

export { Input };
