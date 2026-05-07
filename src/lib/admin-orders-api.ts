export interface AdminOrderItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderDate: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  items: AdminOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  notes?: string;
  updatedAt: string;
  createdAt: string;
}

interface ListOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v != null && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return null;
}

function toOrderStatus(v: unknown): AdminOrder["status"] {
  const s = String(v ?? "").toLowerCase();
  if (s === "pending" || s === "placed") return "Pending";
  if (s === "processing") return "Processing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  return "Pending";
}

function toPaymentStatus(v: unknown): AdminOrder["paymentStatus"] {
  const s = String(v ?? "").toLowerCase();
  if (s === "paid") return "Paid";
  if (s === "failed") return "Failed";
  return "Pending";
}

function mapOrder(v: unknown): AdminOrder | null {
  const row = asRecord(v);
  if (!row) return null;
  const id = String(row.id ?? "");
  if (!id) return null;
  const items = Array.isArray(row.items)
    ? row.items
        .map((item) => asRecord(item))
        .filter((i): i is Record<string, unknown> => !!i)
        .map((i) => ({
          id: Number(i.id ?? 0),
          title: String(i.title ?? ""),
          author: String(i.author ?? ""),
          price: Number(i.price ?? 0),
          quantity: Number(i.quantity ?? 0),
          image: String(i.image ?? ""),
        }))
    : [];

  const shippingAddress = asRecord(row.shippingAddress) ?? asRecord(row.shipping_address) ?? {};

  return {
    id,
    orderNumber: String(row.orderNumber ?? row.order_number ?? id),
    customerName: String(row.customerName ?? row.customer_name ?? "—"),
    customerEmail: String(row.customerEmail ?? row.customer_email ?? ""),
    customerPhone: row.customerPhone ? String(row.customerPhone) : row.customer_phone ? String(row.customer_phone) : undefined,
    orderDate: String(row.orderDate ?? row.order_date ?? row.createdAt ?? row.created_at ?? new Date().toISOString()),
    status: toOrderStatus(row.status ?? row.order_status),
    paymentMethod: String(row.paymentMethod ?? row.payment_method ?? "—"),
    paymentStatus: toPaymentStatus(row.paymentStatus ?? row.payment_status),
    items,
    subtotal: Number(row.subtotal ?? 0),
    shipping: Number(row.shipping ?? 0),
    tax: Number(row.tax ?? 0),
    total: Number(row.total ?? 0),
    shippingAddress: {
      fullName: String(shippingAddress.fullName ?? shippingAddress.full_name ?? "—"),
      address: String(shippingAddress.address ?? "—"),
      city: String(shippingAddress.city ?? "—"),
      zipCode: String(shippingAddress.zipCode ?? shippingAddress.zip_code ?? "—"),
      country: String(shippingAddress.country ?? "—"),
    },
    trackingNumber: row.trackingNumber ? String(row.trackingNumber) : row.tracking_number ? String(row.tracking_number) : undefined,
    estimatedDelivery: row.estimatedDelivery ? String(row.estimatedDelivery) : row.estimated_delivery ? String(row.estimated_delivery) : undefined,
    deliveredDate: row.deliveredDate ? String(row.deliveredDate) : row.delivered_date ? String(row.delivered_date) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    updatedAt: String(row.updatedAt ?? row.updated_at ?? row.createdAt ?? row.created_at ?? new Date().toISOString()),
    createdAt: String(row.createdAt ?? row.created_at ?? new Date().toISOString()),
  };
}

function errorFromBody(body: Record<string, unknown>, fallback: string): string {
  if (typeof body.error === "string" && body.error) return body.error;
  if (typeof body.message === "string" && body.message) return body.message;
  return fallback;
}

export async function listAdminOrders(token: string, params?: ListOrdersParams): Promise<ApiResult<AdminOrder[]>> {
  try {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.search) sp.set("search", params.search);
    if (params?.status && params.status !== "All") sp.set("status", params.status);
    if (params?.paymentStatus && params.paymentStatus !== "All") sp.set("paymentStatus", params.paymentStatus);
    if (params?.startDate) sp.set("startDate", params.startDate);
    if (params?.endDate) sp.set("endDate", params.endDate);
    const query = sp.toString();
    const url = `/api/admin/orders${query ? `?${query}` : ""}`;

    const res = await fetch(url, { headers: { Accept: "application/json", Authorization: bearer } });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: errorFromBody(body, `Request failed (${res.status})`) };

    const dataObj = asRecord(body.data);
    const list = Array.isArray(dataObj?.orders) ? dataObj?.orders : Array.isArray(body.data) ? (body.data as unknown[]) : [];
    const mapped = list.map(mapOrder).filter((o): o is AdminOrder => !!o);
    return { ok: true, data: mapped };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}

async function patchOrder(
  token: string,
  path: string,
  payload: Record<string, unknown>
): Promise<ApiResult<AdminOrder>> {
  try {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const res = await fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bearer,
      },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: errorFromBody(body, `Request failed (${res.status})`) };
    const row = mapOrder(asRecord(body.data) ?? body);
    if (!row) return { ok: false, error: "Invalid order response shape" };
    return { ok: true, data: row };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}

export function updateAdminOrderStatus(token: string, id: string, status: string) {
  return patchOrder(token, `/api/admin/orders/${id}/status`, { status });
}

export function updateAdminPaymentStatus(token: string, id: string, paymentStatus: string) {
  return patchOrder(token, `/api/admin/orders/${id}/payment-status`, { paymentStatus });
}

export function updateAdminTrackingNumber(token: string, id: string, trackingNumber: string) {
  return patchOrder(token, `/api/admin/orders/${id}/tracking`, { trackingNumber });
}
