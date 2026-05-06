"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/src/hooks/use-cart";
import { useAuth } from "@/src/hooks/use-auth";
import { buildReaderHref } from "@/src/lib/readerHref";
import { createStripeCheckoutSessionForItems } from "@/src/lib/purchase-api";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, token, isLoaded } = useAuth();
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleProceedToCheckout = async () => {
    try {
      setCheckoutError(null);
      if (!user || !token) {
        router.push("/login?redirect=" + encodeURIComponent("/cart"));
        return;
      }
      const items = cartItems.map((item) => ({
        item_type:
          item.itemType ?? (typeof item.bookType === "string" && item.bookType.trim() ? "character_book" : "comic"),
        item_id: String(item.id),
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));

      setIsCheckingOut(true);
      const session = await createStripeCheckoutSessionForItems({ items, token });
      if (!session.url) {
        setCheckoutError("Unable to continue checkout. Stripe URL is missing.");
        return;
      }
      window.location.href = session.url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Wait for auth to resolve before deciding which view to show
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-brand text-xl">Loading...</div>
      </div>
    );
  }

  // Not signed in: show Amazon-style prompt to sign in or sign up
  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-8 sm:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Illustration / icon block */}
              <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center rounded-2xl bg-gray-800/80 border border-gray-700">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {/* Message and actions */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">Your Comics Cart is empty</h1>
                <p className="text-gray-400 text-sm sm:text-base mb-4">
                  Sign in to view your cart and checkout, or create an account to get started.
                </p>
                <Link
                  href="/flash-sale"
                  className="inline-block text-brand hover:text-brand/80 text-sm font-bold underline mb-6"
                >
                  Shop today&apos;s deals
                </Link>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/login?redirect=/cart"
                    className="inline-flex justify-center bg-brand hover:bg-brand/90 text-brand-foreground font-bold py-3 px-8 rounded-lg transition-all"
                  >
                    Sign in to your account
                  </Link>
                  <Link
                    href="/signup?redirect=/cart"
                    className="inline-flex justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-gray-600 hover:border-brand/50 transition-all"
                  >
                    Sign up now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any comics to your cart yet.</p>
            <Link
              href="/"
              className="inline-block bg-brand hover:bg-brand/90 text-brand-foreground font-bold py-3 px-8 rounded-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <Link href={buildReaderHref({ id: item.id, coverImage: item.image, title: item.title, pdfUrl: item.pdfUrl, author: item.author, category: item.category, tags: item.tags, bookType: item.bookType })} className="relative w-full sm:w-32 h-48 sm:h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link href={buildReaderHref({ id: item.id, coverImage: item.image, title: item.title, pdfUrl: item.pdfUrl, author: item.author, category: item.category, tags: item.tags, bookType: item.bookType })}>
                          <h3 className="text-white font-bold text-lg mb-1 hover:text-brand transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm mb-2">{item.author}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-4 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-brand">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-gray-400 text-sm">Qty:</label>
                        <div className="flex items-center gap-1 border border-gray-700 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-white min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-right">
                      <p className="text-gray-400 text-sm">
                        Subtotal: <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
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
                {subtotal < 50 && (
                  <div className="text-brand text-sm">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-white">Total</span>
                  <span className="text-2xl font-black text-brand">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={isCheckingOut}
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold py-3 px-6 rounded-lg transition-all mb-3 cursor-pointer disabled:opacity-70"
              >
                {isCheckingOut ? "Redirecting to Stripe..." : "Proceed to Checkout"}
              </button>
              {checkoutError ? <p className="mb-3 text-sm text-red-300">{checkoutError}</p> : null}

              <Link
                href="/"
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg border border-gray-700 transition-all"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

