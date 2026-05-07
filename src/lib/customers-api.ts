/**
 * Customers API for admin list. Uses Next.js proxy route to avoid CORS from browser.
 */

export interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  joinedDate?: string;
  isAdmin?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
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
  joinedDate?: string;
  joined_date?: string;
  is_admin?: boolean;
  isAdmin?: boolean;
  totalOrders?: number;
  total_orders?: number;
  totalSpent?: number;
  total_spent?: number;
  lastOrderDate?: string;
  last_order_date?: string;
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
    createdAt: row.created_at ?? row.createdAt ?? row.joined_date ?? row.joinedDate,
    joinedDate: row.joined_date ?? row.joinedDate ?? row.created_at ?? row.createdAt,
    isAdmin: row.is_admin ?? row.isAdmin,
    totalOrders: row.total_orders ?? row.totalOrders,
    totalSpent: row.total_spent ?? row.totalSpent,
    lastOrderDate: row.last_order_date ?? row.lastOrderDate,
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
  if (!token) {
    return { ok: false, error: "Missing auth token" };
  }

  const url = "/api/admin/customers";
  const headers: HeadersInit = { "Content-Type": "application/json" };
  headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

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

    const raw = (await res.json()) as Record<string, unknown>;
    const dataObj = raw?.data as Record<string, unknown> | undefined;
    const list: BackendCustomerRow[] = Array.isArray(dataObj?.customers)
      ? (dataObj.customers as BackendCustomerRow[])
      : Array.isArray(raw?.data)
        ? (raw.data as BackendCustomerRow[])
        : [];
    const data = list.map((row) => normalizeCustomer(row));
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch customers";
    return { ok: false, error: message };
  }
}
