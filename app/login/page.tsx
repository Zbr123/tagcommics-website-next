"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";
import { loginApi, getCurrentUser, mapBackendUserToAuthUser } from "@/src/lib/auth-api";

const inputBase =
  "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400";
const inputError = "border-red-500 focus:border-red-500";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const nextErrors: { emailOrPhone?: string; password?: string } = {};

    const trimmed = emailOrPhone.trim();
    if (!trimmed) {
      nextErrors.emailOrPhone = "Email is required.";
    } else if (!trimmed.includes("@")) {
      nextErrors.emailOrPhone = "Please enter your email address to sign in.";
    } else if (!isValidEmail(trimmed)) {
      nextErrors.emailOrPhone = "Please enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Call login API
      const data = await loginApi({ email: trimmed, password });

      // Get token from response
      const token = data.accessToken;

      // Get user info - either from response or fetch separately
      let authUser;
      if (data.user) {
        authUser = mapBackendUserToAuthUser(data.user);
      } else {
        // Fetch user info separately if not provided in login response
        try {
          const userData = await getCurrentUser(token);
          authUser = mapBackendUserToAuthUser(userData);
        } catch {
          // Create basic user from email if fetch fails
          authUser = {
            id: trimmed,
            name: trimmed.split("@")[0],
            email: trimmed,
          };
        }
      }

      login(token, authUser);
      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setSubmitError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-y-auto scrollbar-hide bg-[url('/bg-auth.svg')] bg-cover bg-center bg-no-repeat relative">
      {/* Logo - Top Left */}
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 group">
        <img
          src="/logo-comics.png"
          alt="Comics Universe Logo"
          className="h-12 w-32 sm:h-16 sm:w-52 object-cover drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-yellow-400 p-6 sm:p-8 shadow-2xl shadow-yellow-400/30">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Sign in</h1>
          <p className="text-gray-400 text-sm mb-6">
            Enter your email and password to access your account.
          </p>

          {submitError && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="login-email-or-phone" className="block text-sm font-bold text-white mb-1.5">
                Email
              </label>
              <input
                id="login-email-or-phone"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (errors.emailOrPhone) setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
                }}
                className={`${inputBase} ${errors.emailOrPhone ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.emailOrPhone && (
                <p className="mt-1.5 text-sm text-red-400">{errors.emailOrPhone}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-white mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`${inputBase} ${errors.password ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:col-span-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href={redirectTo !== "/" ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
              className="text-yellow-400 hover:text-yellow-300 font-bold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
