"use client";

import { Suspense } from "react";
import { LoginForm } from "@/src/modules/auth/application/login/login.container";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
