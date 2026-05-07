const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = BASE_URL.replace(/\/api\/v1\/?$/, "");

const DEBUG = true;

function log(...args: unknown[]) {
  if (DEBUG) console.log("[characters-api]", ...args);
}

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveUrl(path: string | undefined | null): string {
  if (!path) return "/comic_page_slider.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // If it's just a filename (no slashes), it's stored on the backend at /uploads/characters/
  // Full URL format: http://localhost:5000/api/v1/uploads/characters/{filename}
  if (!path.startsWith("/")) {
    return `${BASE_URL}/uploads/characters/${path}`;
  }

  // For other / paths, return as-is
  return path;
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

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("comics-auth");
  console.log("[characters-api] localStorage comics-auth:", stored);
  if (!stored) return null;
  try {
    const data = JSON.parse(stored);
    console.log("[characters-api] parsed data:", data);
    console.log("[characters-api] token:", data.token);
    return data.token || null;
  } catch (e) {
    console.log("[characters-api] parse error:", e);
    return null;
  }
}

// ============================================
// Types
// ============================================

export type CharacterAlignment = string;

export interface Character {
  character_id: string;
  character_name: string;
  description: string;
  tags: string[] | string;
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image_url: string;
  books?: CharacterBook[];
  [key: string]: unknown;
}

/** Return type of getCharacters() - tags is always normalized to string[] */
export interface NormalizedCharacter {
  id: string;
  character_name: string;
  description: string;
  tags: string[];
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image_url: string;
  // Additional fields
  universe?: string;
  role?: string;
  spotlight_body?: string;
  title_line1?: string;
  title_line2?: string;
  strength?: number;
  speed?: number;
  intelligence?: number;
  durability?: number;
  lore_items?: Array<{ id: string; title: string; body: string }>;
  featured_comics?: unknown[];
  related_entities?: unknown[];
  books?: CharacterBook[];
}

export interface CharacterListResponse {
  status: number;
  message?: string;
  data: Character[];
}

export interface CharacterDetailResponse {
  status: number;
  message?: string;
  data: Character;
}

function parseOptionalStat(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : undefined;
}

function parseJsonArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Shared normalization for admin + public character payloads */
export function normalizeBooksFromApi(raw: unknown): CharacterBook[] {
  if (!raw || !Array.isArray(raw)) return [];
  const normalizedBooks: CharacterBook[] = [];
  for (const book of raw as Array<{
    id: string;
    title: string;
    author?: string;
    category?: string;
    original_price?: number | string;
    discounted_price?: number | string;
    stock?: number;
    tags?: string | string[];
    book_type?: CharacterBook["book_type"];
    image_url?: string;
    image?: string;
    pdf_url?: string;
    pdf_file?: string;
    review?: number;
  }>) {
    const rawImage = book.image_url || book.image || null;
    const rawPdf = book.pdf_url || book.pdf_file || null;
    normalizedBooks.push({
      id: String(book.id),
      title: book.title,
      author: book.author || "",
      category: book.category || "",
      original_price: Number(book.original_price) || 0,
      discounted_price: Number(book.discounted_price) || 0,
      stock: book.stock || 0,
      tags: book.tags || "",
      book_type: (book.book_type as CharacterBook["book_type"]) || "Physical",
      image_url: resolveBookImageUrl(rawImage),
      pdf_url: resolveBookPdfUrl(rawPdf),
      review: book.review || 0,
      image: rawImage || undefined,
      pdf_file: rawPdf || undefined,
    });
  }
  return normalizedBooks;
}

export function normalizeCharacterFromApi(c: Character): NormalizedCharacter {
  let tagsArray: string[] = [];
  const rawTags = c.tags;
  if (rawTags) {
    if (typeof rawTags === "string") {
      tagsArray = rawTags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(rawTags)) {
      tagsArray = rawTags as string[];
    }
  }
  const resolvedImageUrl = resolveUrl(c.cover_image_url);
  log(`Character ${c.character_name}: original URL=${c.cover_image_url}, resolved URL=${resolvedImageUrl}`);

  const normalizedBooks = normalizeBooksFromApi(c.books);

  const extra = c as Character & {
    universe?: string;
    role?: string;
    spotlight_body?: string;
    title_line1?: string;
    title_line2?: string;
    strength?: unknown;
    speed?: unknown;
    intelligence?: unknown;
    durability?: unknown;
    lore_items?: unknown;
  };

  let lore_items: NormalizedCharacter["lore_items"];
  const rawLoreItems = parseJsonArray(extra.lore_items) ?? (Array.isArray(extra.lore_items) ? extra.lore_items : undefined);
  if (rawLoreItems) {
    lore_items = rawLoreItems.map(
      (item: { id?: string; title?: string; body?: string }, i: number) => ({
        id: String(item?.id ?? `lore-${i}`),
        title: String(item?.title ?? ""),
        body: String(item?.body ?? ""),
      }),
    );
  }

  return {
    id: c.character_id,
    character_name: c.character_name,
    description: c.description ?? "",
    tags: tagsArray,
    first_appearance: c.first_appearance || "",
    creator: c.creator || "",
    alignment: c.alignment,
    cover_image_url: resolvedImageUrl,
    books: normalizedBooks,
    universe: typeof extra.universe === "string" ? extra.universe : undefined,
    role: typeof extra.role === "string" ? extra.role : undefined,
    spotlight_body: typeof extra.spotlight_body === "string" ? extra.spotlight_body : undefined,
    title_line1: typeof extra.title_line1 === "string" ? extra.title_line1 : undefined,
    title_line2: typeof extra.title_line2 === "string" ? extra.title_line2 : undefined,
    strength: parseOptionalStat(extra.strength),
    speed: parseOptionalStat(extra.speed),
    intelligence: parseOptionalStat(extra.intelligence),
    durability: parseOptionalStat(extra.durability),
    lore_items,
    featured_comics: parseJsonArray((extra as { featured_comics?: unknown }).featured_comics),
    related_entities: parseJsonArray((extra as { related_entities?: unknown }).related_entities),
  };
}

const PUBLIC_FETCH_OPTIONS: RequestInit & { next?: { revalidate: number } } = {
  next: { revalidate: 60 },
};

/** Server-safe list for public pages (no auth). */
export async function getPublicCharacters(): Promise<NormalizedCharacter[]> {
  try {
    const url = getApiUrl("/characters");
    log(`Fetching public characters from: ${url}`);
    const res = await fetch(url, PUBLIC_FETCH_OPTIONS);
    if (!res.ok) {
      log(`getPublicCharacters HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((row: Character) => normalizeCharacterFromApi(row));
    }
    return [];
  } catch (err) {
    log("getPublicCharacters failed:", err);
    return [];
  }
}

/** Server-safe detail for public pages (no auth). */
export async function getPublicCharacterById(id: string): Promise<NormalizedCharacter | null> {
  try {
    const url = getApiUrl(`/characters/${encodeURIComponent(id)}`);
    log(`Fetching public character: ${url}`);
    const res = await fetch(url, PUBLIC_FETCH_OPTIONS);
    if (!res.ok) {
      log(`getPublicCharacterById HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data?.data) {
      return normalizeCharacterFromApi(data.data as Character);
    }
    return null;
  } catch (err) {
    log("getPublicCharacterById failed:", err);
    return null;
  }
}

// ============================================
// API Functions
// ============================================

export async function getCharacters(): Promise<NormalizedCharacter[]> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    log(`Fetching characters from: ${getApiUrl("/characters")}`);
    const res = await fetch(getApiUrl("/characters"), { headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    log("Characters response:", data);

    if (data.data && Array.isArray(data.data)) {
      return data.data.map((c: Character) => normalizeCharacterFromApi(c));
    }
    return [];
  } catch (err) {
    log("getCharacters failed:", err);
    return [];
  }
}

export interface CreateCharacterPayload {
  character_name: string;
  description: string;
  tags: string;
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image?: File;
  // Additional fields
  universe?: string;
  role?: string;
  spotlight_body?: string;
  title_line1?: string;
  title_line2?: string;
  strength?: number;
  speed?: number;
  intelligence?: number;
  durability?: number;
  lore_items?: string; // JSON.stringify array
}

export async function createCharacter(
  payload: CreateCharacterPayload
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }
  if (!payload.cover_image) {
    return { success: false, error: "Cover image is required." };
  }
  if (!payload.lore_items) {
    return { success: false, error: "At least one lore item is required." };
  }

  try {
    log("Creating character:", payload.character_name);

    const formData = new FormData();
    formData.append("character_name", payload.character_name);
    formData.append("description", payload.description);
    formData.append("tags", payload.tags);
    formData.append("first_appearance", payload.first_appearance);
    formData.append("creator", payload.creator);
    formData.append("alignment", payload.alignment);

    // Optional fields
    if (payload.universe) formData.append("universe", payload.universe);
    if (payload.role) formData.append("role", payload.role);
    if (payload.spotlight_body) formData.append("spotlight_body", payload.spotlight_body);
    if (payload.title_line1) formData.append("title_line1", payload.title_line1);
    if (payload.title_line2) formData.append("title_line2", payload.title_line2);
    if (payload.strength !== undefined) formData.append("strength", String(payload.strength));
    if (payload.speed !== undefined) formData.append("speed", String(payload.speed));
    if (payload.intelligence !== undefined) formData.append("intelligence", String(payload.intelligence));
    if (payload.durability !== undefined) formData.append("durability", String(payload.durability));
    if (payload.lore_items) formData.append("lore_items", payload.lore_items);

    if (payload.cover_image) {
      formData.append("cover_image", payload.cover_image);
    }

    const res = await fetch(getApiUrl("/characters"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    log("Character created:", data);
    return { success: true };
  } catch (err) {
    log("createCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export interface UpdateCharacterPayload extends CreateCharacterPayload {}

export async function updateCharacter(
  id: string,
  payload: UpdateCharacterPayload
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Updating character:", id);

    const formData = new FormData();
    formData.append("character_name", payload.character_name);
    formData.append("description", payload.description);
    formData.append("tags", payload.tags);
    formData.append("first_appearance", payload.first_appearance);
    formData.append("creator", payload.creator);
    formData.append("alignment", payload.alignment);

    // Optional fields
    if (payload.universe) formData.append("universe", payload.universe);
    if (payload.role) formData.append("role", payload.role);
    if (payload.spotlight_body) formData.append("spotlight_body", payload.spotlight_body);
    if (payload.title_line1) formData.append("title_line1", payload.title_line1);
    if (payload.title_line2) formData.append("title_line2", payload.title_line2);
    if (payload.strength !== undefined) formData.append("strength", String(payload.strength));
    if (payload.speed !== undefined) formData.append("speed", String(payload.speed));
    if (payload.intelligence !== undefined) formData.append("intelligence", String(payload.intelligence));
    if (payload.durability !== undefined) formData.append("durability", String(payload.durability));
    if (payload.lore_items) formData.append("lore_items", payload.lore_items);

    if (payload.cover_image) {
      formData.append("cover_image", payload.cover_image);
    }

    const res = await fetch(getApiUrl(`/characters/${id}`), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    log("updateCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function deleteCharacter(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log(`Deleting character: ${id}`);
    const res = await fetch(getApiUrl(`/characters/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    log("deleteCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ============================================
// Book Management
// ============================================

export interface BookPayload {
  title: string;
  author?: string;
  category?: string;
  original_price?: number;
  discounted_price?: number;
  stock?: number;
  tags?: string;
  book_type?: "E-book" | "Physical" | "Sale" | "Flash Sale" | "New Item";
  review?: number;
}

export interface AddBookPayload extends BookPayload {
  image?: File;
  pdf_file?: File;
}

/**
 * Add a book/comic to a character
 * characterId: The character's ID
 * payload: Book data including optional image and pdf_file
 */
export async function addBookToCharacter(
  characterId: string,
  payload: AddBookPayload
): Promise<{ success: boolean; book_id?: string; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Adding book to character:", characterId, payload.title);

    const formData = new FormData();

    // Book data as JSON string
    const bookData: BookPayload = {
      title: payload.title,
      author: payload.author,
      category: payload.category,
      original_price: payload.original_price,
      discounted_price: payload.discounted_price,
      stock: payload.stock,
      tags: payload.tags,
      book_type: payload.book_type,
      review: payload.review,
    };
    formData.append("book", JSON.stringify(bookData));

    if (payload.image) formData.append("image", payload.image);
    if (payload.pdf_file) formData.append("pdf_file", payload.pdf_file);

    const res = await fetch(getApiUrl(`/characters/${characterId}/books`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    log("Book added:", data);
    return { success: true, book_id: data.data?.id };
  } catch (err) {
    log("addBookToCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update a book linked to a character
 */
export async function updateBook(
  characterId: string,
  bookId: string,
  payload: Partial<BookPayload & { image?: File }>
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Updating book:", bookId);

    const formData = new FormData();

    const bookData: Partial<BookPayload> = {
      title: payload.title,
      author: payload.author,
      category: payload.category,
      original_price: payload.original_price,
      discounted_price: payload.discounted_price,
      stock: payload.stock,
      tags: payload.tags,
      book_type: payload.book_type,
      review: payload.review,
    };
    formData.append("book", JSON.stringify(bookData));

    if (payload.image) formData.append("image", payload.image);

    const res = await fetch(getApiUrl(`/characters/${characterId}/books/${bookId}`), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    log("updateBook failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Delete a book from a character
 */
export async function deleteBook(
  characterId: string,
  bookId: string
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Deleting book:", bookId);
    const res = await fetch(getApiUrl(`/characters/${characterId}/books`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    log("deleteBook failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get all books for a character
 */
export async function getCharacterBooks(
  characterId: string
): Promise<{ success: boolean; books?: CharacterBook[]; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Getting books for character:", characterId);
    const res = await fetch(getApiUrl(`/characters/${characterId}/books`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { success: true, books: data.data };
  } catch (err) {
    log("getCharacterBooks failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// CharacterBook type used in NormalizedCharacter
export interface CharacterBook {
  id: string;
  title: string;
  author: string;
  category: string;
  original_price: number;
  discounted_price: number;
  stock: number;
  tags: string[] | string;
  book_type: "E-book" | "Physical" | "Sale" | "Flash Sale" | "New Item";
  image_url: string;
  pdf_url?: string;
  review?: number;
  image?: string;
  pdf_file?: string;
}