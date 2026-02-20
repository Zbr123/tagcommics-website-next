import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/src/components/LayoutWrapper";
import { QueryProvider } from "@/src/components/QueryProvider";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comics Website",
  description: "Your ultimate destination for digital comics",
  icons: {
    icon: [
      { url: "/comic-icon.png", sizes: "any", type: "image/png" },
      { url: "/comic-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/comic-icon.png", sizes: "96x96", type: "image/png" },
      { url: "/comic-icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/comic-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/comic-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
