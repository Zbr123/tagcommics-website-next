"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCart } from "@/src/hooks/use-cart";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/src/modules/checkout/checkout.schema";
import CheckoutFormView from "./checkout.view";

export function CheckoutFormContainer() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      payment: "cod",
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onSuccess: () => {
      clearCart();
      router.replace("/checkout/success");
    },
  });

  const onPlaceOrder = form.handleSubmit(() => {
    placeOrderMutation.mutate();
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">
            Your cart is empty
          </h1>
          <Link href="/" className="text-yellow-400 hover:text-yellow-300">
            Return to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const summary = {
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
  };

  return (
    <CheckoutFormView
      register={form.register}
      errors={form.formState.errors}
      onPlaceOrder={onPlaceOrder}
      isProcessing={placeOrderMutation.isPending}
      summary={summary}
    />
  );
}
