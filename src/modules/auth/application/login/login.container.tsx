"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/use-auth";
import { loginApi, getCurrentUser, mapBackendUserToAuthUser } from "@/src/lib/auth-api";
import { loginSchema, type LoginFormData } from "./login.schema";
import LoginFormView from "./login.view";
import { useState } from "react";

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
      const data = await loginApi({
        email: credentials.email,
        password: credentials.password,
      });
      const token = data.accessToken;
      let authUser;
      if (data.user) {
        authUser = mapBackendUserToAuthUser(data.user);
      } else {
        try {
          const userData = await getCurrentUser(token);
          authUser = mapBackendUserToAuthUser(userData);
        } catch {
          authUser = {
            id: credentials.email,
            name: credentials.email.split("@")[0],
            email: credentials.email,
          };
        }
      }
      return { token, authUser };
    },
    onSuccess: ({ token, authUser }) => {
      login(token, authUser);
      router.push(redirectTo);
    },
    onError: (error) => {
      setError(error.message);
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
