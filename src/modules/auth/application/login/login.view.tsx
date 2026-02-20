"use client";

import Link from "next/link";
import { useState } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LoginFormData } from "./login.schema";

const inputBase =
  "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400";
const inputError = "border-red-500 focus:border-red-500";

export interface LoginFormViewProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  submitError: string | null;
  redirectTo: string;
}

export default function LoginFormView({
  register,
  errors,
  onSubmit,
  isPending,
  submitError,
  redirectTo,
}: LoginFormViewProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-y-auto scrollbar-hide bg-[url('/bg-auth.svg')] bg-cover bg-center bg-no-repeat relative">
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

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label htmlFor="login-email-or-phone" className="block text-sm font-bold text-white mb-1.5">
                Email
              </label>
              <input
                id="login-email-or-phone"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                {...register("email")}
                className={`${inputBase} ${errors.email ? inputError : ""}`}
                disabled={isPending}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  {...register("password")}
                  className={`${inputBase} pr-12 ${errors.password ? inputError : ""}`}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full md:col-span-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all"
            >
              {isPending ? "Signing in..." : "Sign in"}
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
