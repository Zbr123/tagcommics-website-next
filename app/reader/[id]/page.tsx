import type { Metadata } from "next";
import ReaderExperienceDynamic from "@/src/components/reader/ReaderExperienceDynamic";
import { READER_DEFAULT_PDF, READER_DEFAULT_TITLE } from "@/src/components/reader/readerConstants";
import { getReaderComic } from "@/src/data/readerComics";

type ReaderSearchParams = {
  cover?: string;
  title?: string;
  pdf?: string;
  price?: string;
  originalPrice?: string;
  author?: string;
  category?: string;
  tags?: string;
  bookType?: string;
};

function buildPreviewPages(coverImage: string) {
  return [coverImage];
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<ReaderSearchParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const { title } = await searchParams;
  if (title) {
    return { title: `Reader · ${title} (#${id}) | ComicVerse` };
  }
  const numericId = parseInt(id, 10);
  const comic = !isNaN(numericId) ? getReaderComic(numericId) : undefined;
  return { title: `Reader · ${comic?.title ?? READER_DEFAULT_TITLE} (#${id}) | ComicVerse` };
}

export default async function ReaderSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<ReaderSearchParams>;
}) {
  const { id } = await params;
  const { cover, title, pdf, price, originalPrice, author, category, tags, bookType } =
    await searchParams;
  const selectedCover = cover ? decodeURIComponent(cover) : undefined;
  const selectedTitle = title ? decodeURIComponent(title) : undefined;
  const selectedPdf = pdf ? decodeURIComponent(pdf) : undefined;
  const selectedPrice = price ? Number(decodeURIComponent(price)) : undefined;
  const selectedOriginalPrice = originalPrice ? Number(decodeURIComponent(originalPrice)) : undefined;
  const selectedAuthor = author ? decodeURIComponent(author) : undefined;
  const selectedCategory = category ? decodeURIComponent(category) : undefined;
  const selectedTags = tags ? decodeURIComponent(tags) : undefined;
  const selectedBookType = bookType ? decodeURIComponent(bookType) : undefined;
  if (selectedCover) {
    console.log("Reader received cover:", selectedCover);
  }
  const numericId = parseInt(id, 10);
  const comic = !isNaN(numericId) ? getReaderComic(numericId) : undefined;

  if (selectedCover) {
    return (
      <ReaderExperienceDynamic
        comicData={{
          slug: String(id),
          itemId: String(id),
          itemType: selectedBookType ? "character_book" : "comic",
          title: selectedTitle || comic?.title || READER_DEFAULT_TITLE,
          coverImage: selectedCover,
          previewPages: selectedPdf ? [] : buildPreviewPages(selectedCover),
          pdfUrl: selectedPdf || comic?.pdfUrl,
          isPurchased: false,
          price: Number.isFinite(selectedPrice) ? selectedPrice : undefined,
          originalPrice: Number.isFinite(selectedOriginalPrice)
            ? selectedOriginalPrice
            : undefined,
          author: selectedAuthor,
          category: selectedCategory,
          tags: selectedTags,
          bookType: selectedBookType,
        }}
      />
    );
  }

  if (comic) {
    const previewPages = buildPreviewPages(comic.coverImage);
    return (
      <ReaderExperienceDynamic
        comicData={{
          slug: String(comic.id),
          itemId: String(comic.id),
          itemType: "comic",
          title: comic.title,
          coverImage: comic.coverImage,
          previewPages,
          pdfUrl: comic.pdfUrl,
          isPurchased: false,
        }}
      />
    );
  }

  return <ReaderExperienceDynamic pdfPath={READER_DEFAULT_PDF} title={READER_DEFAULT_TITLE} subtitle={`Session · ${id}`} />;
}
