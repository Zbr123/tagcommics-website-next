/**
 * Customers API for admin. Fetches registered customers from the backend.
 * Expects backend to expose GET /customers or GET /users returning an array of user objects.
 */

function getApiBaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url?.trim()) return undefined;
  return url.replace(/\/$/, "");
}

export interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  isAdmin?: boolean;
}

/** Backend may return first_name/last_name or name */
interface BackendCustomerRow {
  id: number | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  created_at?: string;
  createdAt?: string;
  is_admin?: boolean;
  isAdmin?: boolean;
}

function normalizeCustomer(row: BackendCustomerRow): Customer {
  const name =
    row.name ??
    ([row.first_name, row.last_name].filter(Boolean).join(" ") || row.email || "—");
  return {
    id: row.id,
    name,
    email: row.email ?? "",
    phone: row.phone,
    createdAt: row.created_at ?? row.createdAt,
    isAdmin: row.is_admin ?? row.isAdmin,
  };
}

export type CustomersApiResult =
  | { ok: true; data: Customer[] }
  | { ok: false; error: string };

/**
 * Fetch registered customers from the backend.
 * Backend should expose GET /customers or GET /users with optional Authorization header.
 */
export async function fetchCustomers(token?: string): Promise<CustomersApiResult> {
  const base = getApiBaseUrl();
  if (!base) {
    return { ok: false, error: "API URL not configured (NEXT_PUBLIC_API_URL)" };
  }

  const url = `${base}${base.endsWith("/") ? "" : "/"}customers`;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { method: "GET", headers });

    if (!res.ok) {
      const text = await res.text();
      let message = `Request failed (${res.status})`;
      try {
        const json = JSON.parse(text);
        message = json.error || json.message || message;
      } catch {
        if (text) message = text.slice(0, 200);
      }
      return { ok: false, error: message };
    }

    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : raw?.customers ?? raw?.users ?? [];
    const data = list.map((row: BackendCustomerRow) => normalizeCustomer(row));
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch customers";
    return { ok: false, error: message };
  }
}
