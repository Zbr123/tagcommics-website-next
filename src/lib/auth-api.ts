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

/** Login API request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login API response */
export interface LoginResponse {
  accessToken: string;
  user?: BackendAuthUser;
}

/** Register API request body */
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

/** Register API response */
export interface RegisterResponse {
  accessToken?: string;
  user?: BackendAuthUser;
}

/**
 * Call the login API
 */
export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(getAuthApiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(error.error || error.message || "Login failed");
  }

  return res.json();
}

/**
 * Call the register API
 */
export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(getAuthApiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(error.error || error.message || "Registration failed");
  }

  return res.json();
}

/**
 * Get current user info using the token
 */
export async function getCurrentUser(token: string): Promise<BackendAuthUser> {
  const res = await fetch(getAuthApiUrl("/auth/me"), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user info");
  }

  return res.json();
}
