"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/use-auth";
import { registerApi, mapBackendUserToAuthUser, loginApi, decodeToken } from "@/src/lib/auth-api";
import { signupSchema, type SignupFormData } from "./signup.schema";
import SignupFormView from "./signup.view";
import type { AuthUser } from "@/src/types/auth";

export function SignupFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      // Register the user
      await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // After successful registration, log in to get the token
      const loginResponse = await loginApi({
        email: data.email,
        password: data.password,
      });

      if (!loginResponse.data?.access_token) {
        throw new Error(loginResponse.message || "Registration successful but login failed");
      }

      const token = loginResponse.data.access_token;
      const payload = decodeToken(token);

      const authUser: AuthUser = {
        id: payload.user_id,
        name: payload.name,
        email: payload.email,
      };

      return { token, authUser };
    },
    onSuccess: ({ token, authUser }) => {
      login(token, authUser);
      router.push(redirectTo);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const submitError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.error
        ? "Sign up failed. Please try again."
        : "";

  return (
    <SignupFormView
      register={form.register}
      errors={form.formState.errors}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      submitError={submitError}
      redirectTo={redirectTo}
    />
  );
}
