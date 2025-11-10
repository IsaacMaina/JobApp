"use client";

import { signIn, signOut } from "next-auth/react";

export const login = async (provider = "github") => {
  await signIn(provider, { callbackUrl: "/" });
};

export const logout = async () => {
  await signOut({ callbackUrl: "/auth/login" });
};
