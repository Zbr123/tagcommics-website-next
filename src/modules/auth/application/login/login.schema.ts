import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .refine(
      (val) => val.trim().includes("@"),
      "Please enter your email address to sign in."
    )
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      "Please enter a valid email address."
    )
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
