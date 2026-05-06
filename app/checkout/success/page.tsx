"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const qs = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
    router.replace(`/payment-success${qs}`);
  }, [router]);
  return null;
}

