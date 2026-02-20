"use client";

import { Suspense } from "react";
import { SignupFormContainer } from "@/src/modules/auth/application/signup";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SignupFormContainer />
    </Suspense>
  );
}
