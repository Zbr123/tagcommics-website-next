import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required.").trim(),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email.").trim(),
  address: z.string().min(1, "Address is required.").trim(),
  city: z.string().min(1, "City is required.").trim(),
  zipCode: z.string().min(1, "ZIP code is required.").trim(),
  payment: z.enum(["cod"]).default("cod"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
