"use client";

import Link from "next/link";
import { useState } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LoginFormData } from "./login.schema";

const BOLT_PATH =
  "M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z";

const inputBase =
  "w-full rounded-xl border border-white/12 bg-[#0d131b] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/20";
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
    <div className="relative flex h-screen items-center justify-center overflow-y-auto scrollbar-hide bg-black bg-[url('/bg-auth.svg')] bg-cover bg-center bg-no-repeat">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(88,232,193,0.2),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-brand/10 mix-blend-color" />
      <div className="pointer-events-none absolute inset-0 bg-black/58" />
      <Link href="/" className="absolute left-4 top-4 z-10 inline-flex items-center gap-3 sm:left-6 sm:top-6 group">
        <span className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(88,232,193,0.28)] bg-black/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-[rgba(88,232,193,0.6)] group-hover:bg-[rgba(88,232,193,0.08)] group-hover:shadow-[0_0_24px_rgba(88,232,193,0.3)]">
          <svg viewBox="0 0 448 512" className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(88,232,193,0.7)]" fill="rgb(88,232,193)">
            <path d={BOLT_PATH} />
          </svg>
        </span>
        <span className="hidden text-lg font-black tracking-tight sm:inline">
          <span className="text-white">Tag</span>
          <span className="text-brand">Comics</span>
        </span>
      </Link>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-brand/35 bg-gradient-to-br from-[#0b1017] to-[#070b11] p-6 shadow-2xl shadow-brand/20 backdrop-blur-xl sm:p-8">
          {redirectTo && redirectTo.startsWith("/admin") ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Admin Login</h1>
              <p className="text-gray-400 text-sm mb-6">Enter your admin email and password to access the admin panel.</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Sign in</h1>
              <p className="text-gray-400 text-sm mb-6">Enter your email and password to access your account.</p>
            </>
          )}

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-[#58E8C1] focus:outline-none"
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
              className="w-full rounded-xl bg-gradient-to-r from-[#58E8C1] to-[#35c5de] px-6 py-3 font-bold text-[#04110d] transition-all hover:from-[#63f3cf] hover:to-[#48d6ef] disabled:cursor-allow  disabled:opacity-50 md:col-span-2"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href={redirectTo !== "/" ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
              className="font-bold text-[#58E8C1] transition-colors hover:text-cyan-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
