"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/use-auth";
import { mapBackendUserToAuthUser, registerApi } from "@/src/lib/auth-api";
import { signupSchema, type SignupFormData } from "./signup.schema";
import SignupFormView from "./signup.view";

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
      try {
        const response = await registerApi({
          name: data.name,
          email: data.email,
          phone: data.phone?.trim() ?? "",
          password: data.password,
        });
        return {
          token: response.accessToken ?? `signup-token-${Date.now()}`,
          user: {
            ...(response.user
              ? mapBackendUserToAuthUser(response.user)
              : {
                  id: data.email,
                  name: data.name || data.email.split("@")[0],
                  email: data.email,
                }),
          },
        };
      } catch {
        // Backend unavailable/demo mode: create a local account session.
        return {
          token: `demo-signup-token-${Date.now()}`,
          user: {
            id: data.email,
            name: data.name || data.email.split("@")[0] || "Demo Reader",
            email: data.email,
            phone: data.phone?.trim() ?? "",
          },
        };
      }
    },
    onSuccess: ({ token, user }) => {
      login(token, user);
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
