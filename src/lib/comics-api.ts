const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const BASE_BACKEND = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const DEBUG = true;

function log(...args: unknown[]) {
  if (DEBUG) console.log("[comics-api]", ...args);
}

/** Build full API URL */
function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Convert relative path to absolute URL */
function resolveUrl(path: string | undefined | null): string {
  if (!path) return "/comic_page_slider.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${BASE_BACKEND}${path}`;
  return path;
}

/** Fetch wrapper */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  log(`Fetching: ${getApiUrl(endpoint)}`);

  const res = await fetch(getApiUrl(endpoint), { headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    log(`API Error ${res.status}:`, error);
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  log(`Response from ${endpoint}:`, data);
  return data;
}

// ============================================
// Types
// ============================================

export interface BackendComic {
  comic_id: number | string;
  title: string;
  author: string;
  price: number;
  discounted_price?: number;
  cover_image_url?: string;
  digital_file_url?: string;
  category: string;
  tag?: string;
  description?: string;
  stock_quantity?: number;
  rating: number;
  sold_count?: string;
  categories?: string[];
  tags?: string[];
  slug?: string;
  series_name?: string;
  issue_number?: number;
  published_date?: string;
  is_featured?: boolean;
}

export interface Comic {
  id: string | number;
  title: string;
  author: string;
  price: number;  
  originalPrice?: number;
  discount?: number;
  image: string;
  pdfUrl?: string;
  category: string;
  tag?: string;
  description?: string;
  stock: number;
  rating: number;
  sold?: string;
}

export interface ComicListResponse {
  status: number;
  message?: string;
  data: BackendComic[];
}

export interface ComicDetailResponse {
  status: number;
  message?: string;
  data: BackendComic;
}

// ============================================
// Simple mapper
// ============================================

function mapComic(c: BackendComic): Comic {
  return {
    id: c.comic_id,
    title: c.title,
    author: c.author,
    price: c.price,
    originalPrice: c.discounted_price,
    image: resolveUrl(c.cover_image_url),
    pdfUrl: resolveUrl(c.digital_file_url),
    category: c.category || (Array.isArray(c.categories) && c.categories.length > 0 ? c.categories[0] : "Comics"),
    tag: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags[0] : c.tag,
    description: c.description,
    stock: c.stock_quantity ?? 50,
    rating: c.rating,
    sold: c.sold_count,
  };
}

// ============================================
// API Functions
// ============================================

export async function getFeaturedComics(): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>("/comics/featured");
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("getFeaturedComics failed:", err);
    return [];
  }
}

export async function getNewReleases(): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>("/comics/new-releases");
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("getNewReleases failed:", err);
    return [];
  }
}

export async function getBestSellers(): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>("/comics/best-sellers");
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("getBestSellers failed:", err);
    return [];
  }
}

export async function getComicById(id: string | number): Promise<Comic | null> {
  try {
    const response = await apiFetch<ComicDetailResponse>(`/comics/${id}`);
    if (!response.data) return null;
    return mapComic(response.data);
  } catch (err) {
    log("getComicById failed:", err);
    return null;
  }
}

export async function getCategoryComics(category: string): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>(
      `/comics/category/${encodeURIComponent(category)}`
    );
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("getCategoryComics failed:", err);
    return [];
  }
}

export async function searchComics(query: string): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>(
      `/comics/search?q=${encodeURIComponent(query)}`
    );
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("searchComics failed:", err);
    return [];
  }
}

export async function getAllComics(): Promise<Comic[]> {
  try {
    const response = await apiFetch<ComicListResponse>("/comics");
    if (!response.data || !Array.isArray(response.data)) return [];
    return response.data.map(mapComic);
  } catch (err) {
    log("getAllComics failed:", err);
    return [];
  }
}
