"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { GithubIcon, UserPlusIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      // Map NextAuth error codes to user-friendly messages
      switch (errorParam) {
        case "OAuthAccountNotLinked":
          setError(
            "To confirm your identity, sign in with the same account you used originally."
          );
          break;
        case "OAuthCallback":
          setError("Authentication failed. Please try again with another account.");
          break;
        case "EmailSignIn":
          setError("Check your email for a sign-in link.");
          break;
        case "CredentialsSignin":
          setError("Sign in failed. Check the details you provided are correct.");
          break;
        case "SessionRequired":
          setError("Please sign in to access this page.");
          break;
        case "SocialNotRegistered": // Custom error from lib/auth.ts (if it were still there)
          setError("This social account is not registered. Please register first.");
          break;
        default:
          setError("An unknown error occurred during authentication.");
          break;
      }
    }
  }, [searchParams]); // Depend on searchParams

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json(); // Always try to parse error data
        if (response.status === 409) {
          setError("You are already registered. Please go to the login page.");
        } else {
          setError(errorData.message || "Registration failed");
        }
        return;
      }

      // const user = await response.json(); // No need to get user object if not using its name
      toast.success("New user added successfully!"); // Changed toast message
      // router.push("/auth/login"); // Removed redirection
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleSocialRegister = async (provider: "github" | "google") => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" });
    // setLoading(false) is not strictly necessary here because the page will redirect.
  };

  return (
    <div className="p-4 h-screen w-full flex items-center justify-center">
      {/* Card */}
      <div className="h-80% overflow-hidden shadow-2xl rounded-lg flex flex-col md:flex-row md:h-[85%] md:w-full lg:w-[80%] 2xl:w-1/2">
        {/* Image container */}
        <div className="relative hidden md:block h-1/2 w-full md:h-full md:w-1/2">
          <Image src="/login.jpeg" alt="" fill className="object-cover" />
        </div>

        {/* Forms container */}
        <div className="p-6 flex flex-col gap-3 md:p-4 md:gap-2 md:w-1/2">
          <h1 className="font-bold text-lg xl:text-xl text-center">Sign Up</h1>
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 ring-1 ring-gray-200 rounded-md md:p-2"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              required
              disabled={loading || !!error}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 ring-1 ring-gray-200 rounded-md md:p-2"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              disabled={loading || !!error}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 ring-1 ring-gray-200 rounded-md md:p-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              disabled={loading || !!error}
            />
            <button
              type="submit"
              className="cursor-pointer p-3 bg-red-900 text-white rounded-md md:p-2 flex items-center justify-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={loading || !!error}
            >
              <UserPlusIcon className="w-5 h-5" />
              {loading ? "Registering..." : "Register with Email"}
            </button>
          </form>

          <div className="my-4 text-center text-gray-500">OR</div>

          <p className="text-xs">Sign up with your Google or Github Account</p>

          <div className="flex flex-row gap-2">
            <button
              onClick={() => handleSocialRegister("github")}
              className="h-14 cursor-pointer flex-1 flex gap-2 p-3 ring-1 ring-blue-100 rounded-md justify-center items-center md:p-1 group relative overflow-hidden disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={loading || !!error}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <FaGithub className="w-10 h-10" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <GithubIcon className="w-10 h-10" />
              </span>
            </button>
            <button
              onClick={() => handleSocialRegister("google")}
              className="h-14 cursor-pointer flex-1 flex gap-2 p-3 ring-1 ring-orange-100 rounded-md justify-center items-center md:p-1 group relative overflow-hidden disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={loading || !!error}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <FcGoogle className="w-10 h-10" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <FaGoogle className="w-10 h-10" />
              </span>
            </button>
          </div>

          <p className="text-xs mt-auto text-right">
            Already have an account?{" "}
            <Link className="underline" href={"/auth/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
