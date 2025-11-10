"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button"; // Import Button component
import { toast } from "sonner";

interface UserAccountNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserAccountNav({ user }: UserAccountNavProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col items-center space-y-1 focus:outline-none cursor-pointer">
        <Avatar className="bg-red-900">
          <AvatarFallback className="bg-red-900 text-amber-50">
            {user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .trim() || "U"
              : "U"}
          </AvatarFallback>
        </Avatar>
        {user.name && <span className="text-xs font-medium">{user.name}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="backdrop-blur-md bg-white/60 p-2" align="end">
        <DropdownMenuSeparator />
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && (
              <p className="w-[200px] truncate text-sm font-semibold text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:bg-amber-50 hover:text-red-900 focus:bg-amber-50 focus:text-red-900 cursor-pointer">
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-amber-50 hover:text-red-900 focus:bg-amber-50 focus:text-red-900 cursor-pointer">
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="mt-auto flex justify-end">
          <Button
            className="hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 cursor-pointer px-4 py-2 bg-red-900 text-amber-50"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              signOut({ callbackUrl: `${window.location.origin}/auth/login` });
              toast.success("Logged out successfully!");
            }}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
