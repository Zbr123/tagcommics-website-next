"use client";

import Link from "next/link";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormData } from "./checkout.schema";

const inputBase =
  "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400";
const inputError = "border-red-500 focus:border-red-500";

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface CheckoutFormViewProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  onPlaceOrder: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isProcessing: boolean;
  summary: CheckoutSummary;
}

export default function CheckoutFormView({
  register,
  errors,
  onPlaceOrder,
  isProcessing,
  summary,
}: CheckoutFormViewProps) {
  const { subtotal, shipping, tax, total, itemCount } = summary;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-black text-white mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName")}
                  className={`${inputBase} ${errors.fullName ? inputError : ""}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`${inputBase} ${errors.email ? inputError : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
                <input
                  type="text"
                  placeholder="Address"
                  {...register("address")}
                  className={`${inputBase} ${errors.address ? inputError : ""}`}
                />
                {errors.address && (
                  <p className="text-sm text-red-400">
                    {errors.address.message}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      {...register("city")}
                      className={`${inputBase} ${errors.city ? inputError : ""}`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      {...register("zipCode")}
                      className={`${inputBase} ${errors.zipCode ? inputError : ""}`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-black text-white mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                  <input
                    type="radio"
                    value="cod"
                    {...register("payment")}
                    className="text-yellow-400"
                  />
                  <span className="text-white">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-black text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-white">Total</span>
                  <span className="text-2xl font-black text-yellow-400">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onPlaceOrder}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all mb-3 cursor-pointer"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg border border-gray-700 transition-all"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
