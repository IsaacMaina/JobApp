"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileInputProps extends React.ComponentPropsWithoutRef<"input"> {
  buttonText?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, type, buttonText = "Choose File", ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Pass the event up to react-hook-form's onChange
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Filter out the `value` prop for file inputs
    const inputProps =
      type === "file"
        ? Object.fromEntries(
            Object.entries(props).filter(([key]) => key !== "value")
          )
        : props;

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <input
          type="file"
          ref={(el) => {
            if (el) {
              inputRef.current = el;
            }
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          onChange={handleChange}
          className="hidden"
          {...inputProps}
        />
        <Button type="button" onClick={handleClick} variant="outline">
          {buttonText}
        </Button>
        {inputRef.current?.files?.[0] && (
          <span className="text-sm text-gray-500">
            {inputRef.current.files[0].name}
          </span>
        )}
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
