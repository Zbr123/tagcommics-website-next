const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type PurchasableItemType = "comic" | "character_book";

interface ApiEnvelope<T> {
  message?: string;
  data?: T;
}

export interface CheckoutSessionData {
  session_id: string;
  url?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  item_type: PurchasableItemType;
  image_url?: string;
  pdf_url?: string;
}

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
  const idCandidate = row.item_id ?? row.id;
  if (typeof idCandidate !== "string" && typeof idCandidate !== "number") return null;
  const title =
    typeof row.title === "string"
      ? row.title
      : typeof row.item_title === "string"
        ? row.item_title
        : "Untitled";
  return {
    id: String(idCandidate),
    title,
    item_type: itemType,
    image_url: typeof row.image_url === "string" ? row.image_url : undefined,
    pdf_url: typeof row.pdf_url === "string" ? row.pdf_url : undefined,
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
  return Boolean(body?.data?.access);
}
