"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Your cart is empty</h1>
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

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      router.push("/checkout/success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-black text-white mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-black text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                  <input type="radio" name="payment" value="card" defaultChecked className="text-yellow-400" />
                  <span className="text-white">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                  <input type="radio" name="payment" value="paypal" className="text-yellow-400" />
                  <span className="text-white">PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                  <input type="radio" name="payment" value="cod" className="text-yellow-400" />
                  <span className="text-white">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-black text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? <span className="text-green-400">FREE</span> : `$${shipping.toFixed(2)}`}
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
                  <span className="text-2xl font-black text-yellow-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all mb-3"
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

