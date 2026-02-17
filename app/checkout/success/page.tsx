"use client";

import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. Your order has been confirmed and you will receive an email with order details shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg border border-gray-700 transition-all"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

