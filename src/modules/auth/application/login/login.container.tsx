"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/use-auth";
import { loginApi, decodeToken } from "@/src/lib/auth-api";
import { loginSchema, type LoginFormData } from "./login.schema";
import LoginFormView from "./login.view";
import { useState } from "react";
import type { AuthUser } from "@/src/types/auth";

export function LoginFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const redirectTo = searchParams.get("redirect") ?? "/";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await loginApi({
        email: credentials.email,
        password: credentials.password,
      });

      if (!response.data?.access_token) {
        throw new Error(response.message || "Login failed");
      }

      const token = response.data.access_token;
      const payload = decodeToken(token);

      const authUser: AuthUser = {
        id: payload.user_id,
        name: payload.name,
        email: payload.email,
      };

      return { token, authUser };
    },
    onSuccess: ({ token, authUser }) => {
      setError(null);
      login(token, authUser);
      router.push(redirectTo);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Login failed");
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <LoginFormView
      register={form.register}
      errors={form.formState.errors}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      submitError={error}
      redirectTo={redirectTo}
    />
  );
}
