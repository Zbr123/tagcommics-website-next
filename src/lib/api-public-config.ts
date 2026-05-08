function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

const rawUrl = stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL?.trim() ?? "");
const rawBase = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE?.trim() ?? "");

/**
 * Backend REST prefix (e.g. https://api.example.com/api/v1).
 * Set NEXT_PUBLIC_API_URL in every environment — there is no code fallback URL.
 */
export const API_URL = rawUrl;

/**
 * Backend origin without /api/v1 (uploads, static paths).
 * Set NEXT_PUBLIC_API_BASE, or it is derived from API_URL when that ends with /api/v1.
 */
export const API_BASE = rawBase || (rawUrl ? stripTrailingSlash(rawUrl.replace(/\/api\/v1\/?$/i, "")) : "");
