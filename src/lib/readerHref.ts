export interface ReaderLinkInput {
  id: string | number;
  coverImage?: string;
  title?: string;
  pdfUrl?: string;
  price?: number;
  originalPrice?: number;
  author?: string;
  category?: string;
  tags?: string[] | string;
  bookType?: string;
}

/**
 * Builds reader route with explicit cover/title so Reader page
 * can render the exact card image the user clicked.
 */
export function buildReaderHref({
  id,
  coverImage,
  title,
  pdfUrl,
  price,
  originalPrice,
  author,
  category,
  tags,
  bookType,
}: ReaderLinkInput): string {
  const params = new URLSearchParams();
  if (coverImage) params.set("cover", coverImage);
  if (title) params.set("title", title);
  if (pdfUrl) params.set("pdf", pdfUrl);
  if (typeof price === "number" && Number.isFinite(price)) params.set("price", String(price));
  if (typeof originalPrice === "number" && Number.isFinite(originalPrice)) {
    params.set("originalPrice", String(originalPrice));
  }
  if (author) params.set("author", author);
  if (category) params.set("category", category);
  if (bookType) params.set("bookType", bookType);
  if (tags) params.set("tags", Array.isArray(tags) ? tags.join(",") : tags);
  const query = params.toString();
  return query ? `/reader/${id}?${query}` : `/reader/${id}`;
}
