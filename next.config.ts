import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Allow `next/image` for backend upload URLs derived from NEXT_PUBLIC_* at build time. */
function apiBackendUploadPattern():
  | { protocol: "http" | "https"; hostname: string; port: string; pathname: string }
  | null {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim() || "";
  if (!raw) return null;
  try {
    const normalized = raw.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
    const u = new URL(normalized);
    const protocol = u.protocol === "https:" ? "https" : "http";
    return {
      protocol,
      hostname: u.hostname,
      port: u.port || "",
      pathname: "/api/v1/uploads/**",
    };
  } catch {
    return null;
  }
}

const backendUploadImages = apiBackendUploadPattern();

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        port: "",
        pathname: "/**",
      },
      ...(backendUploadImages ? [backendUploadImages] : []),
    ],
  },
};

export default nextConfig;
