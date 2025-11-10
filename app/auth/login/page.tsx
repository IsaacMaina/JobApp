"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { MailIcon, GithubIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

const errorMessages: { [key: string]: string } = {
  OAuthCallback:
    "There was an error with the social login provider. Please try again.",
  SocialNotRegistered: "is not registered, please start with registering.",
  // Add other NextAuth.js error codes here as needed
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "SocialNotRegistered") {
        const provider = searchParams.get("provider");
        setError(
          `From ${
            provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : ""
          } ${errorMessages[errorParam]}`
        );
      } else {
        const message =
          errorMessages[errorParam] ||
          "An unexpected error occurred. Please try again.";
        setError(message);
      }
    }
  }, [searchParams]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      toast.success("Login successful!");
      router.push("/");
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" }); // setLoading(false) is not strictly necessary here because the page will redirect.
  };

  return (
    <div className="flex-col relative p-4 h-screen w-full flex items-center justify-center">
      <p className="absolute top-4 ">
        for admin login email is{" "}
        <span className="text-base font-bold">admin@example.com</span> and{" "}
        password is <span className="text-base font-bold">1234</span>
      </p>
      {/* card */}
      <div className="h-80% overflow-hidden shadow-2xl rounded-lg flex flex-col md:flex-row md:h-[80%] md:w-full lg:w-[80%] 2xl:w-1/2">
        {/* image container */}
        <div className="relative hidden md:block h-1/2 w-full md:h-full md:w-1/2">
          <Image src="/login.jpeg" alt="" fill className="object-cover" />
        </div>
        {/* forms container */}
        <div className="p-6 flex flex-col gap-3 md:p-4 md:gap-2 md:w-1/2 ">
          {" "}
          <h1 className="font-bold text-lg xl:text-xl text-center">Login</h1>
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}
          <form
            onSubmit={handleCredentialsLogin}
            className="flex flex-col gap-4"
          >
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
              disabled={loading}
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
              disabled={loading}
            />
            <button
              type="submit"
              className="cursor-pointer p-3 bg-red-900 text-white rounded-md md:p-2 flex items-center justify-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <MailIcon className="w-5 h-5" />
              {loading ? "Signing in..." : "Sign in with Email"}
            </button>
          </form>
          <div className="my-4 text-center text-gray-500">OR</div>
          <p className="text-xs">
            Sign in with your Google or Facebook Account
          </p>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => handleSocialLogin("github")}
              className="h-14 cursor-pointer flex-1 flex gap-2 p-2 ring-1 ring-blue-100 rounded-md justify-center items-center md:p-1 group relative overflow-hidden disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <FaGithub className="w-10 h-14" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <GithubIcon className="w-10 h-14" />
              </span>
            </button>
            <button
              onClick={() => handleSocialLogin("google")}
              className="h-14  cursor-pointer flex-1 flex gap-2 p-2 ring-1 ring-orange-100 rounded-md justify-center items-center md:p-1 group relative overflow-hidden disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <FcGoogle className="w-10 h-14" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <FaGoogle className="w-10 h-14" />
              </span>
            </button>
          </div>
          <p className="text-xs mt-auto text-right">
            Dont have an account?{" "}
            <Link className="underline" href={"/auth/register"}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
