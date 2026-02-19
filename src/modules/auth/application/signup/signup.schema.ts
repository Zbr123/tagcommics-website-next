import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required.")
      .trim()
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address.")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/\d/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (typeof window === "undefined") return true;
          if (!val || val.trim() === "") return true;
          const trimmed = val.trim();
          try {
            if (trimmed.startsWith("+")) {
              return isValidPhoneNumber(trimmed);
            }
            return (
              isValidPhoneNumber(trimmed, "US") ||
              isValidPhoneNumber(trimmed, "GB") ||
              isValidPhoneNumber(trimmed, "CA")
            );
          } catch {
            return false;
          }
        },
        {
          message: "Please enter a valid phone number (e.g., +1234567890 or 123-456-7890).",
        }
      ),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
