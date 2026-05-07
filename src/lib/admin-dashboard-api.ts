export interface AdminOverview {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStock: number;
}

export interface AdminSalesPoint {
  period: string;
  orders: number;
  revenue: number;
}

export type AdminOverviewResult =
  | { ok: true; data: AdminOverview }
  | { ok: false; error: string };

export type AdminSalesResult =
  | { ok: true; data: AdminSalesPoint[] }
  | { ok: false; error: string };

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v != null && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatError(body: Record<string, unknown>, status: number): string {
  if (typeof body.error === "string" && body.error) return body.error;
  if (typeof body.message === "string" && body.message) return body.message;
  return `Request failed (${status})`;
}

function extractSalesList(body: Record<string, unknown>): unknown[] {
  if (Array.isArray(body.data)) return body.data;
  const dataObj = asRecord(body.data);
  if (!dataObj) return [];
  if (Array.isArray(dataObj.sales)) return dataObj.sales;
  if (Array.isArray(dataObj.items)) return dataObj.items;
  if (Array.isArray(dataObj.results)) return dataObj.results;
  return [];
}

export async function fetchAdminOverview(token: string): Promise<AdminOverviewResult> {
  try {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const res = await fetch("/api/admin/dashboard/overview", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: bearer,
      },
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return { ok: false, error: formatError(body, res.status) };
    }

    const dataObj = asRecord(body.data);
    if (!dataObj) return { ok: false, error: "Invalid overview response shape" };

    return {
      ok: true,
      data: {
        totalProducts: num(dataObj.totalProducts),
        totalOrders: num(dataObj.totalOrders),
        totalRevenue: num(dataObj.totalRevenue),
        totalCustomers: num(dataObj.totalCustomers),
        pendingOrders: num(dataObj.pendingOrders),
        lowStock: num(dataObj.lowStock),
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}

export async function fetchAdminSales(
  token: string,
  period: "week" | "month" | "year" = "month"
): Promise<AdminSalesResult> {
  try {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const res = await fetch(`/api/admin/dashboard/sales?period=${period}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: bearer,
      },
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return { ok: false, error: formatError(body, res.status) };
    }

    const list = extractSalesList(body);
    const mapped: AdminSalesPoint[] = list
      .map((item) => asRecord(item))
      .filter((row): row is Record<string, unknown> => row !== null)
      .map((row) => ({
        period: String(row.period ?? ""),
        orders: num(row.order_count ?? row.orders ?? row.count),
        revenue: num(row.revenue ?? row.total_revenue ?? row.sales),
      }))
      .filter((r) => r.period);

    return { ok: true, data: mapped };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}
