import { cache } from "react";
import { getPublicCharacters, type CharacterBook } from "@/src/lib/characters-api";
import { buildReaderHref } from "@/src/lib/readerHref";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = BASE_URL.replace(/\/api\/v1\/?$/, "");

interface ApiEnvelope<T> {
  message?: string;
  data?: T;
}

export interface BookFeedItem {
  id: string;
  character_id?: string;
  title: string;
  author?: string;
  category?: string;
  original_price?: number;
  discounted_price?: number;
  stock?: number;
  tags?: string;
  book_type?: string;
  review?: number;
  image_url?: string;
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveAssetUrl(path: string | undefined): string {
  if (!path) return "/comic-slider1.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return `${API_ORIGIN}${path}`;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${BASE_URL}/uploads/comics/images/${path}`;
}

/** Aligns with character detail books (`CharacterComicsSection` → reader query). */
function resolvePdfUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  const s = String(path).trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/api/")) return `${API_ORIGIN}${s}`;
  if (s.startsWith("/")) return `${API_ORIGIN}${s}`;
  return `${BASE_URL}/uploads/comics/pdfs/${s}`;
}

function feedItemToReaderHref(item: BookFeedItem): string {
  const coverImage = resolveAssetUrl(item.image_url);
  const pdfUrl = resolvePdfUrl(item.pdf_url);
  const price = Number(item.discounted_price) || Number(item.original_price) || 0;
  const originalRaw = Number(item.original_price);
  const originalPrice =
    Number.isFinite(originalRaw) && originalRaw > price ? originalRaw : undefined;
  const bookTypeStr = item.book_type?.trim();

  return buildReaderHref({
    id: item.id,
    coverImage,
    title: item.title,
    pdfUrl,
    price: Number.isFinite(price) ? price : undefined,
    originalPrice,
    author: item.author,
    category: item.category,
    tags: item.tags,
    bookType: bookTypeStr,
  });
}

async function fetchFeed(path: string): Promise<BookFeedItem[]> {
  try {
    const res = await fetch(getApiUrl(path), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = (await res.json()) as ApiEnvelope<BookFeedItem[]>;
    return Array.isArray(body?.data) ? body.data : [];
  } catch {
    return [];
  }
}

function parseFeedTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function tagsInclude(tags: string | undefined, needle: string): boolean {
  const n = needle.toLowerCase();
  return parseFeedTags(tags).some((t) => t.toLowerCase() === n);
}

function bookTypeMatches(item: BookFeedItem, needle: string): boolean {
  const bt = item.book_type;
  if (bt == null || bt === "") return false;
  return String(bt).toLowerCase() === needle.toLowerCase();
}

/** Admin “New Item” promo checkbox/tag, or legacy book_type, or Tag dropdown value NEW */
function isLatestReleaseEligible(item: BookFeedItem): boolean {
  return (
    tagsInclude(item.tags, "New Item") ||
    bookTypeMatches(item, "New Item") ||
    tagsInclude(item.tags, "NEW")
  );
}

/** True only for promo “New Item”, not catalog NEW tag */
function isNewItemPromoTag(item: BookFeedItem): boolean {
  return tagsInclude(item.tags, "New Item") || bookTypeMatches(item, "New Item");
}

function isNewCatalogTagOnly(item: BookFeedItem): boolean {
  return tagsInclude(item.tags, "NEW");
}

function isFlashSaleEligible(item: BookFeedItem): boolean {
  return tagsInclude(item.tags, "Flash Sale") || bookTypeMatches(item, "Flash Sale");
}

function isPopularEligible(item: BookFeedItem): boolean {
  return Number(item.review) >= 4;
}

function tagsToCsv(tags: string | string[] | undefined): string {
  if (tags == null) return "";
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean).join(",");
  return String(tags);
}

function characterBookToFeedItem(book: CharacterBook, characterId: string): BookFeedItem {
  const rawImage = book.image || book.image_url;
  return {
    id: book.id,
    character_id: characterId,
    title: book.title,
    author: book.author,
    category: book.category,
    original_price: book.original_price,
    discounted_price: book.discounted_price,
    stock: book.stock,
    tags: tagsToCsv(book.tags),
    book_type: book.book_type,
    review: book.review,
    image_url: typeof rawImage === "string" ? rawImage : undefined,
    pdf_url: book.pdf_url,
  };
}

async function allBooksFromPublicCatalog(): Promise<BookFeedItem[]> {
  const chars = await getPublicCharacters();
  const out: BookFeedItem[] = [];
  for (const c of chars) {
    for (const b of c.books || []) {
      out.push(characterBookToFeedItem(b, c.id));
    }
  }
  return out;
}

/** Single fetch of `/characters` books per homepage request (RSS merge + fallbacks). */
const getCachedPublicCatalogBooks = cache(allBooksFromPublicCatalog);

function mergeUniqueById(preferred: BookFeedItem[], fill: BookFeedItem[], limit: number): BookFeedItem[] {
  const seen = new Set<string>();
  const merged: BookFeedItem[] = [];
  for (const row of preferred) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
    if (merged.length >= limit) return merged;
  }
  for (const row of fill) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
    if (merged.length >= limit) break;
  }
  return merged;
}

export async function getLatestReleaseBooks(limit = 8): Promise<BookFeedItem[]> {
  const oversample = Math.max(limit * 4, 48);
  const apiRows = await fetchFeed(
    `/books/latest-releases?limit=${encodeURIComponent(String(oversample))}`
  );
  const fromApi = apiRows.filter(isLatestReleaseEligible);
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalog = catalog.filter(isLatestReleaseEligible);
  return mergeUniqueById(fromApi, fromCatalog, limit);
}

/** Same rules as homepage Latest Releases — full merged list for `/new-releases` (cap guards runaway payloads). */
const LATEST_RELEASES_LISTING_CAP = 500;

export async function getAllLatestReleaseBooks(): Promise<BookFeedItem[]> {
  const apiRows = await fetchFeed(
    `/books/latest-releases?limit=${encodeURIComponent(String(LATEST_RELEASES_LISTING_CAP))}`
  );
  const fromApi = apiRows.filter(isLatestReleaseEligible);
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalog = catalog.filter(isLatestReleaseEligible);
  return mergeUniqueById(fromApi, fromCatalog, LATEST_RELEASES_LISTING_CAP);
}

const PRODUCT_CARD_TAGS = new Set(["NEW", "HOT", "CLASSIC", "SALE", "BESTSELLER"]);

function primaryTagForProductCard(tags: string | undefined): string {
  for (const t of parseFeedTags(tags)) {
    const u = t.toUpperCase();
    if (PRODUCT_CARD_TAGS.has(u)) return u;
  }
  if (tagsInclude(tags, "New Item")) return "NEW";
  if (tagsInclude(tags, "Flash Sale")) return "SALE";
  return "NEW";
}

export interface ProductCardComic {
  id: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  author?: string;
  rating?: number;
  tag?: string;
  image: string;
  readerHref: string;
  category?: string;
  /** Shown when ProductCard uses showSold (e.g. bestsellers). */
  sold?: string;
}

export function bookFeedItemToProductCardComic(item: BookFeedItem): ProductCardComic {
  const price = Number(item.discounted_price) || Number(item.original_price) || 0;
  const original = Number(item.original_price);
  const hasStrike = Number.isFinite(original) && original > price;
  const discount =
    hasStrike && original > 0 ? Math.max(0, Math.round(((original - price) / original) * 100)) : undefined;
  const review = Number(item.review);
  const stockKnown = item.stock != null;
  const stock = Number(item.stock);
  const sold = stockKnown ? (stock > 0 ? `${stock} in stock` : "Out of stock") : undefined;
  return {
    id: item.id,
    title: item.title,
    price,
    originalPrice: hasStrike ? original : undefined,
    discount,
    author: item.author || undefined,
    rating: Number.isFinite(review) && review > 0 ? review : undefined,
    tag: primaryTagForProductCard(item.tags),
    image: resolveAssetUrl(item.image_url),
    readerHref: feedItemToReaderHref(item),
    category: item.category?.trim() || undefined,
    sold,
  };
}

export async function getFlashSaleBooks(limit = 12): Promise<BookFeedItem[]> {
  const oversample = Math.max(limit * 4, 48);
  const apiRows = await fetchFeed(`/books/flash-sale?limit=${encodeURIComponent(String(oversample))}`);
  const fromApi = apiRows.filter(isFlashSaleEligible);
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalog = catalog.filter(isFlashSaleEligible);
  return mergeUniqueById(fromApi, fromCatalog, limit);
}

/** Same rules as homepage Flash Sale — full merged list for `/flash-sale`. */
const FLASH_SALE_LISTING_CAP = 500;

export async function getAllFlashSaleBooks(): Promise<BookFeedItem[]> {
  const apiRows = await fetchFeed(
    `/books/flash-sale?limit=${encodeURIComponent(String(FLASH_SALE_LISTING_CAP))}`
  );
  const fromApi = apiRows.filter(isFlashSaleEligible);
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalog = catalog.filter(isFlashSaleEligible);
  return mergeUniqueById(fromApi, fromCatalog, FLASH_SALE_LISTING_CAP);
}

export async function getPopularBooks(limit = 12): Promise<BookFeedItem[]> {
  const oversample = Math.max(limit * 4, 48);
  const apiRows = await fetchFeed(`/books/popular?limit=${encodeURIComponent(String(oversample))}`);
  const fromApiFiltered = apiRows.filter(isPopularEligible);
  const fromApiSorted = [...fromApiFiltered].sort((a, b) => Number(b.review) - Number(a.review));
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalogFiltered = catalog.filter(isPopularEligible).sort((a, b) => Number(b.review) - Number(a.review));
  return mergeUniqueById(fromApiSorted, fromCatalogFiltered, limit);
}

/** Same rules as homepage Popular Books (review ≥ 4) — full list for `/bestsellers`. */
const POPULAR_LISTING_CAP = 500;

export async function getAllPopularBooks(): Promise<BookFeedItem[]> {
  const apiRows = await fetchFeed(
    `/books/popular?limit=${encodeURIComponent(String(POPULAR_LISTING_CAP))}`
  );
  const fromApiFiltered = apiRows.filter(isPopularEligible);
  const fromApiSorted = [...fromApiFiltered].sort((a, b) => Number(b.review) - Number(a.review));
  const catalog = await getCachedPublicCatalogBooks();
  const fromCatalogFiltered = catalog.filter(isPopularEligible).sort((a, b) => Number(b.review) - Number(a.review));
  const merged = mergeUniqueById(fromApiSorted, fromCatalogFiltered, POPULAR_LISTING_CAP);
  return merged.sort((a, b) => Number(b.review) - Number(a.review));
}

export function toLatestReleaseCard(item: BookFeedItem) {
  let issue = item.book_type || "Issue";
  if (isNewItemPromoTag(item)) issue = "New Item";
  else if (isLatestReleaseEligible(item) && isNewCatalogTagOnly(item)) issue = "NEW";

  const stock = item.stock ?? 0;
  const status = stock > 0 ? `${stock} in stock` : "Out of stock";

  return {
    id: item.id,
    title: item.title,
    image: resolveAssetUrl(item.image_url),
    readerHref: feedItemToReaderHref(item),
    issue,
    genre: item.category || "Comics",
    status,
  };
}

export function toFlashSaleCard(item: BookFeedItem) {
  const original = Number(item.original_price) || Number(item.discounted_price) || 0;
  const price = Number(item.discounted_price) || original;
  const discount = original > 0 ? Math.max(0, Math.round(((original - price) / original) * 100)) : 0;
  const stock = item.stock ?? 0;
  const stockNote = stock > 0 ? `${stock} in stock` : "Out of stock";
  return {
    id: item.id,
    title: item.title,
    price,
    originalPrice: original,
    discount,
    image: resolveAssetUrl(item.image_url),
    readerHref: feedItemToReaderHref(item),
    stockNote,
  };
}

export function toPopularCard(item: BookFeedItem) {
  const rating = Number(item.review) || 0;
  const stock = item.stock ?? 0;
  return {
    id: item.id,
    title: item.title,
    author: item.author || "Unknown",
    price: Number(item.discounted_price) || Number(item.original_price) || 0,
    rating,
    stock,
    image: resolveAssetUrl(item.image_url),
    readerHref: feedItemToReaderHref(item),
  };
}
