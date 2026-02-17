"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoaded, logout } = useAuth();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/login?redirect=" + encodeURIComponent("/account"));
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-6">Your Account</h1>
          <div className="space-y-3 mb-8">
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-white font-bold">{user.name}</p>
            <p className="text-gray-400 text-sm mt-4">Email</p>
            <p className="text-white font-bold">{user.email}</p>
            {user.phone && (
              <>
                <p className="text-gray-400 text-sm mt-4">Phone</p>
                <p className="text-white font-bold">{user.phone}</p>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg border border-gray-700 transition-all"
            >
              Your Orders
            </Link>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="bg-transparent hover:bg-gray-800 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
