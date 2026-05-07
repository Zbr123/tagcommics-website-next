const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = BASE_URL.replace(/\/api\/v1\/?$/, "");

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveBookImageUrl(path: string | undefined | null): string {
  if (!path) return "/comic-slider1.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return `${API_ORIGIN}${path}`;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${BASE_URL}/uploads/comics/images/${path}`;
}

function resolveBookPdfUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return `${API_ORIGIN}${path}`;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${BASE_URL}/uploads/comics/pdfs/${path}`;
}

export interface ApiCartItem {
  item_id: string;
  item_type: "comic" | "character_book";
  comic_id?: string;
  character_book_id?: string;
  title: string;
  author: string;
  image?: string;
  unit_price: number;
  original_price?: number;
  quantity: number;
  meta?: {
    book_type?: string;
    tags?: string[] | string;
    pdf_url?: string;
    category?: string;
  } & Record<string, unknown>;
}

interface ApiCartResponse {
  message: string;
  data: {
    cart_id: string;
    status: string;
    currency: string;
    items: ApiCartItem[];
    items_count: number;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    grand_total: number;
  };
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("comics-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: unknown };
    return typeof parsed?.token === "string" && parsed.token.trim() ? parsed.token : null;
  } catch {
    return null;
  }
}

function resolveToken(token: string): string {
  return readStoredToken() || token;
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function fetchServerCart(token: string): Promise<ApiCartItem[]> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl("/cart"), {
    method: "GET",
    headers: authHeaders(authToken),
  });
  if (!res.ok) throw new Error(`GET /cart failed: ${await readErrorMessage(res)}`);
  const body = (await res.json()) as ApiCartResponse;
  return Array.isArray(body?.data?.items) ? body.data.items : [];
}

export async function addServerCartItem(
  token: string,
  payload: { item_type: "comic" | "character_book"; item_id: string; quantity: number },
): Promise<void> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl("/cart/items"), {
    method: "POST",
    headers: authHeaders(authToken),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST /cart/items failed: ${await readErrorMessage(res)}`);
}

export async function updateServerCartItem(
  token: string,
  itemId: string,
  quantity: number,
): Promise<void> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl(`/cart/items/${encodeURIComponent(itemId)}`), {
    method: "PATCH",
    headers: authHeaders(authToken),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`PATCH /cart/items/:id failed: ${await readErrorMessage(res)}`);
}

export async function removeServerCartItem(token: string, itemId: string): Promise<void> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl(`/cart/items/${encodeURIComponent(itemId)}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error(`DELETE /cart/items/:id failed: ${await readErrorMessage(res)}`);
}

export async function clearServerCart(token: string): Promise<void> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl("/cart"), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error(`DELETE /cart failed: ${await readErrorMessage(res)}`);
}

export function mapApiCartItemToLocal(item: ApiCartItem) {
  const meta = item.meta ?? {};
  const checkoutIdCandidates: unknown[] = [
    item.character_book_id,
    item.comic_id,
    (meta as Record<string, unknown>).product_id,
    (meta as Record<string, unknown>).book_id,
    (meta as Record<string, unknown>).comic_id,
    (meta as Record<string, unknown>).character_book_id,
    (meta as Record<string, unknown>).catalog_item_id,
    (meta as Record<string, unknown>).source_item_id,
  ];
  const resolvedCheckoutId = checkoutIdCandidates.find(
    (value) => typeof value === "string" && value.trim(),
  );
  const mapped = {
    id: item.item_id,
    checkoutItemId: typeof resolvedCheckoutId === "string" ? resolvedCheckoutId : undefined,
    title: item.title,
    author: item.author || "Unknown",
    price: Number(item.unit_price) || 0,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    image: resolveBookImageUrl(item.image),
    pdfUrl: resolveBookPdfUrl(item.meta?.pdf_url),
    category: item.meta?.category,
    tags: item.meta?.tags,
    bookType: item.meta?.book_type,
    quantity: item.quantity || 1,
    itemType: item.item_type,
  };
  console.log("[cart-api] mapApiCartItemToLocal", {
    api_item_id: item.item_id,
    api_item_type: item.item_type,
    api_meta: item.meta,
    resolved_checkout_id: resolvedCheckoutId,
    mapped_id: mapped.id,
    mapped_checkoutItemId: mapped.checkoutItemId,
    mapped_itemType: mapped.itemType,
    title: mapped.title,
  });
  return mapped;
}

