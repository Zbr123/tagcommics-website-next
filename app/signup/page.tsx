"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";
import { registerApi, getCurrentUser, mapBackendUserToAuthUser } from "@/src/lib/auth-api";

const inputBase =
  "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400";
const inputError = "border-red-500 focus:border-red-500";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
function getPasswordStrengthError(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  return null;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    terms?: string;
  }>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const nextErrors: typeof errors = {};

    if (!name.trim()) nextErrors.name = "Full name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";
    const pwdErr = getPasswordStrengthError(password);
    if (pwdErr) nextErrors.password = pwdErr;
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!acceptTerms) nextErrors.terms = "You must accept the Terms and Privacy Policy.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Call register API with correct format: name, email, phone, password
      const data = await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      // Get token from response (if provided)
      const token = data.accessToken;

      // Get user info - either from response or create from form data
      let authUser;
      if (data.user) {
        authUser = mapBackendUserToAuthUser(data.user);
      } else {
        // Create user from form data if not provided in response
        authUser = {
          id: email.trim(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
        };
      }

      // Login if token was provided, otherwise just redirect
      if (token) {
        login(token, authUser);
      }

      router.push(redirectTo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setSubmitError(errorMessage);
      setIsLoading(false);
    }
  };

  const clearError = (field: keyof typeof errors) => {
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
                onChange={(e) => setPhone(e.target.value)}
                className={inputBase}
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
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters, one letter and one number"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                  if (errors.confirmPassword && e.target.value === confirmPassword)
                    clearError("confirmPassword");
                }}
                className={`${inputBase} ${errors.password ? inputError : ""}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-bold text-white mb-1.5">
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                className={`${inputBase} ${errors.confirmPassword ? inputError : ""}`}
                disabled={isLoading}
              />
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
                    clearError("terms");
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
              {errors.terms && (
                <p className="mt-1.5 text-sm text-red-400">{errors.terms}</p>
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
