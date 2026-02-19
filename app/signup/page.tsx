"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { registerApi } from "@/src/lib/auth-api";

const inputBase =
  "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400";
const inputError = "border-red-500 focus:border-red-500";

// Zod schema for signup form validation
const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required.")
      .trim()
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address.")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/\d/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          // Skip validation on server side
          if (typeof window === "undefined") return true;
          if (!val || val.trim() === "") return true;
          const trimmed = val.trim();
          try {
            // If it starts with +, validate as international number
            if (trimmed.startsWith("+")) {
              return isValidPhoneNumber(trimmed);
            }
            // Otherwise, try with common default countries
            // This allows users to enter numbers without country code
            return (
              isValidPhoneNumber(trimmed, "US") ||
              isValidPhoneNumber(trimmed, "GB") ||
              isValidPhoneNumber(trimmed, "CA")
            );
          } catch {
            return false;
          }
        },
        {
          message: "Please enter a valid phone number (e.g., +1234567890 or 123-456-7890).",
        }
      ),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    // Validate form data using Zod
    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      phone,
      acceptTerms,
    });

    if (!result.success) {
      // Map Zod errors to form errors
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupFormData;
        if (field) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Call register API with validated data
      const data = await registerApi({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone?.trim() || "",
        password: result.data.password,
      });

      // Navigate to signin page after successful signup
      router.push("/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setSubmitError(errorMessage);
      setIsLoading(false);
    }
  };

  const clearError = (field: keyof SignupFormData) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="h-screen bg-black flex items-start justify-center overflow-y-auto scrollbar-hide bg-[url('/bg-auth.svg')] bg-cover bg-center bg-no-repeat relative pt-8 sm:pt-8">
      {/* Logo - Top Left */}
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 group">
        <img
          src="/logo-comics.png"
          alt="Comics Universe Logo"
          className="h-12 w-32 sm:h-16 sm:w-52 object-cover drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-2 pb-6 w-full">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-yellow-400 p-6 sm:px-8 shadow-2xl shadow-yellow-400/30">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Create account</h1>
          <p className="text-gray-400 text-sm mb-6">
            Enter your details to create your Comics Universe account.
          </p>

          {submitError && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1: Phone (optional) | Full Name */}
            <div>
              <label htmlFor="signup-phone" className="block text-sm font-bold text-white mb-1.5">
                Phone <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="signup-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError("phone");
                }}
                className={`${inputBase} ${errors.phone ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-name" className="block text-sm font-bold text-white mb-1.5">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
                className={`${inputBase} ${errors.name ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Row 2: Email (full width) */}
            <div className="md:col-span-2">
              <label htmlFor="signup-email" className="block text-sm font-bold text-white mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                className={`${inputBase} ${errors.email ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Row 3: Password | Confirm Password */}
            <div>
              <label htmlFor="signup-password" className="block text-sm font-bold text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters, one letter and one number"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                    if (errors.confirmPassword && e.target.value === confirmPassword)
                      clearError("confirmPassword");
                  }}
                  className={`${inputBase} pr-12 ${errors.password ? inputError : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                  disabled={isLoading}
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
                <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-bold text-white mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  className={`${inputBase} pr-12 ${errors.confirmPassword ? inputError : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Row 4: Terms (full width) */}
            <div className="md:col-span-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    clearError("acceptTerms");
                  }}
                  className="mt-1 rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-400"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-yellow-400 hover:text-yellow-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1.5 text-sm text-red-400">{errors.acceptTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:col-span-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href={redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
              className="text-yellow-400 hover:text-yellow-300 font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
