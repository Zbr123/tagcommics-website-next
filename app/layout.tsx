import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/src/components/LayoutWrapper";
import { QueryProvider } from "@/src/components/QueryProvider";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";

export const metadata: Metadata = {
  title: "TagComic",
  description: "Premium digital comics — discover series, characters, and new releases.",
  /** Favicons: `app/icon.svg` + `app/apple-icon.svg` (bolt mark, matches nav). */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="antialiased"
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
