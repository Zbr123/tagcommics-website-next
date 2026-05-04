import type { AuthUser } from "@/src/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function getAuthApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** JWT payload structure from the backend token */
export interface JWTPayload {
  user_id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

/**
 * Decode JWT token without verification (for client-side use)
 * The backend sends a signed token; we decode it to read the payload.
 */
export function decodeToken(token: string): JWTPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

/** Backend user shape from /api/auth/register response */
export interface BackendRegisterUser {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  user_role: string;
  created_at: string;
}

export function mapBackendUserToAuthUser(user: BackendRegisterUser): AuthUser {
  return {
    id: user.user_id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
  };
}

/** Login API request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login API response */
export interface LoginResponse {
  status: number;
  message: string;
  data?: {
    access_token: string;
  };
}

/** Register API request body */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Register API response */
export interface RegisterResponse {
  status: number;
  message: string;
  data?: BackendRegisterUser;
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
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

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "Registration failed");
  }

  return response;
}
