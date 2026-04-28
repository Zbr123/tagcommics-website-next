export interface ReaderLinkInput {
  id: string | number;
  coverImage?: string;
  title?: string;
}

/**
 * Builds reader route with explicit cover/title so Reader page
 * can render the exact card image the user clicked.
 */
export function buildReaderHref({ id, coverImage, title }: ReaderLinkInput): string {
  const params = new URLSearchParams();
  if (coverImage) params.set("cover", coverImage);
  if (title) params.set("title", title);
  const query = params.toString();
  return query ? `/reader/${id}?${query}` : `/reader/${id}`;
}
