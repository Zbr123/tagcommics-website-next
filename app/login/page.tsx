"use client";

import { Suspense } from "react";
import { LoginFormContainer } from "@/src/modules/auth/application/login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginFormContainer />
    </Suspense>
  );
}
