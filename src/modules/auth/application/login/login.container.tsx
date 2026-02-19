"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/use-auth";
import { loginApi, getCurrentUser, mapBackendUserToAuthUser } from "@/src/lib/auth-api";
import type { LoginFormData } from "./login.schema";
import LoginFormView from "./login.view";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/";

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
  });

  const handleSubmit = async (data: LoginFormData) => {
    await mutation.mutateAsync(data);
  };

  const submitError =
    mutation.error instanceof Error ? mutation.error.message : mutation.error ? "Login failed. Please try again." : "";

  return (
    <LoginFormView
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
      submitError={submitError}
    />
  );
}
