import type { AuthUser } from "@/src/types/auth";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return url.replace(/\/$/, "");
};

export function getAuthApiUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Backend user shape from /api/auth/login and /api/auth/register */
export interface BackendAuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  is_admin?: boolean;
}

export function mapBackendUserToAuthUser(user: BackendAuthUser): AuthUser {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;
  return {
    id: String(user.id),
    name,
    email: user.email,
  };
}
