"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "@/src/lib/auth-api";
import { signupSchema, type SignupFormData } from "./signup.schema";
import SignupFormView from "./signup.view";

export function SignupFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    mutationFn: (data: SignupFormData) =>
      registerApi({
        name: data.name,
        email: data.email,
        phone: data.phone?.trim() ?? "",
        password: data.password,
      }),
    onSuccess: () => {
      router.push("/login");
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
