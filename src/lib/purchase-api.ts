import { API_URL as BASE_URL, API_BASE } from "@/src/lib/api-public-config";

const API_ORIGIN = API_BASE || BASE_URL.replace(/\/api\/v1\/?$/, "");

export type PurchasableItemType = "comic" | "character_book";

interface ApiEnvelope<T> {
  message?: string;
  data?: T;
  hasAccess?: boolean;
}

export interface CheckoutSessionData {
  session_id: string;
  url?: string;
}

export interface LibraryItem {
  id: string;
  library_item_id: string;
  title: string;
  item_type: PurchasableItemType;
  author?: string;
  category?: string;
  tags?: string[] | string;
  book_type?: string;
  image_url?: string;
  pdf_url?: string;
}

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveLibraryImageUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return `${API_ORIGIN}${path}`;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${BASE_URL}/uploads/comics/images/${path}`;
}

function resolveLibraryPdfUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return `${API_ORIGIN}${path}`;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${BASE_URL}/uploads/comics/pdfs/${path}`;
}

export function readStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("comics-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: unknown };
    if (typeof parsed?.token === "string" && parsed.token.trim()) return parsed.token;
    return null;
  } catch {
    return null;
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { message?: string };
    return json?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

function resolveToken(token?: string | null): string {
  const resolved = token || readStoredAuthToken();
  if (!resolved) throw new Error("Please log in to continue.");
  return resolved;
}

function normalizeItemType(value: unknown): PurchasableItemType {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (raw === "character_book" || raw === "characterbook") return "character_book";
  return "comic";
}

function shouldRetryAsComic(errorMessage: string): boolean {
  return /Product not found:\s*character_book/i.test(errorMessage);
}

function shouldRetryAsCharacterBook(errorMessage: string): boolean {
  return /Product not found:\s*comic/i.test(errorMessage);
}

async function postCheckoutSession(
  token: string,
  items: Array<{ item_type: PurchasableItemType; item_id: string; quantity: number }>,
): Promise<{ ok: true; data: CheckoutSessionData } | { ok: false; error: string }> {
  const res = await fetch(getApiUrl("/stripe/create-checkout-session"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    return { ok: false, error: await readErrorMessage(res) };
  }
  const body = (await res.json()) as ApiEnvelope<CheckoutSessionData>;
  const data = body?.data;
  if (!data?.session_id) return { ok: false, error: "Missing Stripe session id." };
  return { ok: true, data };
}

export async function createStripeCheckoutSession(params: {
  itemType: PurchasableItemType;
  itemId: string;
  quantity?: number;
  token?: string | null;
}): Promise<CheckoutSessionData> {
  const token = resolveToken(params.token);
  const normalizedType = normalizeItemType(params.itemType);
  const primaryItems = [
    {
      item_type: normalizedType,
      item_id: params.itemId,
      quantity: params.quantity ?? 1,
    },
  ] as const;
  const primary = await postCheckoutSession(token, [...primaryItems]);
  if (primary.ok) return primary.data;

  if (normalizedType === "character_book" && shouldRetryAsComic(primary.error)) {
    const fallback = await postCheckoutSession(token, [
      {
        item_type: "comic",
        item_id: params.itemId,
        quantity: params.quantity ?? 1,
      },
    ]);
    if (fallback.ok) return fallback.data;
    throw new Error(fallback.error);
  }
  if (normalizedType === "comic" && shouldRetryAsCharacterBook(primary.error)) {
    const fallback = await postCheckoutSession(token, [
      {
        item_type: "character_book",
        item_id: params.itemId,
        quantity: params.quantity ?? 1,
      },
    ]);
    if (fallback.ok) return fallback.data;
    throw new Error(fallback.error);
  }

  throw new Error(primary.error);
}

export async function createStripeCheckoutSessionForItems(params: {
  items: Array<{ item_type: PurchasableItemType; item_id: string; quantity: number }>;
  token?: string | null;
}): Promise<CheckoutSessionData> {
  const token = resolveToken(params.token);
  if (!params.items.length) throw new Error("Your cart is empty.");
  const primaryItems = params.items.map((item) => ({
    item_type: normalizeItemType(item.item_type),
    item_id: item.item_id,
    quantity: item.quantity,
  }));
  console.log("[purchase-api] normalized checkout items", primaryItems);
  const primary = await postCheckoutSession(token, primaryItems);
  if (primary.ok) return primary.data;

  if (shouldRetryAsComic(primary.error)) {
    const fallbackItems = primaryItems.map((item) =>
      item.item_type === "character_book" ? { ...item, item_type: "comic" as const } : item,
    );
    const fallback = await postCheckoutSession(token, fallbackItems);
    if (fallback.ok) return fallback.data;
    if (!shouldRetryAsCharacterBook(fallback.error)) throw new Error(fallback.error);
  }

  if (shouldRetryAsCharacterBook(primary.error)) {
    const fallbackItems = primaryItems.map((item) =>
      item.item_type === "comic" ? { ...item, item_type: "character_book" as const } : item,
    );
    const fallback = await postCheckoutSession(token, fallbackItems);
    if (fallback.ok) return fallback.data;
    throw new Error(fallback.error);
  }

  throw new Error(primary.error);
}

function mapLibraryItem(raw: unknown): LibraryItem | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const itemType = row.item_type === "character_book" ? "character_book" : "comic";
  const productIdCandidate =
    itemType === "character_book"
      ? (row.character_book_id ?? row.item_id ?? row.id)
      : (row.comic_id ?? row.item_id ?? row.id);
  if (typeof productIdCandidate !== "string" && typeof productIdCandidate !== "number") return null;
  const libraryItemId = row.id;
  const normalizedLibraryItemId =
    typeof libraryItemId === "string" || typeof libraryItemId === "number"
      ? String(libraryItemId)
      : String(productIdCandidate);
  const title =
    typeof row.title === "string"
      ? row.title
      : typeof row.item_title === "string"
        ? row.item_title
        : "Untitled";
  const rawImage =
    typeof row.image_url === "string" ? row.image_url : typeof row.image === "string" ? row.image : undefined;
  const rawPdf = typeof row.pdf_url === "string" ? row.pdf_url : undefined;
  return {
    id: String(productIdCandidate),
    library_item_id: normalizedLibraryItemId,
    title,
    item_type: itemType,
    author: typeof row.author === "string" ? row.author : undefined,
    category: typeof row.category === "string" ? row.category : undefined,
    tags: Array.isArray(row.tags) || typeof row.tags === "string" ? (row.tags as string[] | string) : undefined,
    book_type: typeof row.book_type === "string" ? row.book_type : undefined,
    image_url: resolveLibraryImageUrl(rawImage),
    pdf_url: resolveLibraryPdfUrl(rawPdf),
  };
}

export async function fetchLibrary(token?: string | null): Promise<LibraryItem[]> {
  const authToken = resolveToken(token);
  const res = await fetch(getApiUrl("/library"), {
    method: "GET",
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));

  const body = (await res.json()) as ApiEnvelope<unknown[]>;
  const rows = Array.isArray(body?.data) ? body.data : [];
  return rows.map(mapLibraryItem).filter((x): x is LibraryItem => Boolean(x));
}

export async function checkLibraryAccess(params: {
  itemType: PurchasableItemType;
  itemId: string;
  token?: string | null;
}): Promise<boolean> {
  const authToken = resolveToken(params.token);
  const query = new URLSearchParams({
    item_type: params.itemType,
    item_id: params.itemId,
  }).toString();
  const res = await fetch(getApiUrl(`/library/check-access?${query}`), {
    method: "GET",
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));

  const body = (await res.json()) as ApiEnvelope<{ access?: boolean }>;
  if (typeof body?.hasAccess === "boolean") return body.hasAccess;
  return Boolean(body?.data?.access);
}

export async function checkLibraryAccessByPdfUrl(params: {
  pdfUrl: string;
  customerId: string;
  token?: string | null;
}): Promise<boolean> {
  const authToken = resolveToken(params.token);
  const rawPdfUrl = String(params.pdfUrl || "").trim();
  const normalizedPdfUrl = (() => {
    if (!rawPdfUrl) return rawPdfUrl;
    try {
      const parsed = new URL(rawPdfUrl);
      const pathname = parsed.pathname;
      const segments = pathname.split("/").filter(Boolean);
      return segments.length ? segments[segments.length - 1]! : rawPdfUrl;
    } catch {
      const segments = rawPdfUrl.split("/").filter(Boolean);
      return segments.length ? segments[segments.length - 1]! : rawPdfUrl;
    }
  })();
  const query = new URLSearchParams({
    pdf_url: normalizedPdfUrl,
    customer_id: params.customerId,
  }).toString();
  const res = await fetch(getApiUrl(`/library/check-access?${query}`), {
    method: "GET",
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));

  const body = (await res.json()) as ApiEnvelope<{ access?: boolean }>;
  if (typeof body?.hasAccess === "boolean") return body.hasAccess;
  return Boolean(body?.data?.access);
}
