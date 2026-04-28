import type { Metadata } from "next";
import ReaderExperienceDynamic from "@/src/components/reader/ReaderExperienceDynamic";
import { READER_DEFAULT_PDF, READER_DEFAULT_TITLE } from "@/src/components/reader/readerConstants";
import { getReaderComic } from "@/src/data/readerComics";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ cover?: string; title?: string }> };

function buildPreviewPages(coverImage: string, previewPages?: string[]) {
  return [coverImage];
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { title } = await searchParams;
  if (title) {
    return { title: `Reader · ${title} (#${id}) | ComicVerse` };
  }
  const numericId = parseInt(id, 10);
  const comic = !isNaN(numericId) ? getReaderComic(numericId) : undefined;
  return { title: `Reader · ${comic?.title ?? READER_DEFAULT_TITLE} (#${id}) | ComicVerse` };
}

export default async function ReaderSessionPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { cover, title } = await searchParams;
  const selectedCover = cover ? decodeURIComponent(cover) : undefined;
  const selectedTitle = title ? decodeURIComponent(title) : undefined;
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
          title: selectedTitle || comic?.title || READER_DEFAULT_TITLE,
          coverImage: selectedCover,
          previewPages: buildPreviewPages(selectedCover, comic?.previewPages),
          pdfUrl: comic?.pdfUrl,
          isPurchased: false,
        }}
      />
    );
  }

  if (comic) {
    const previewPages = buildPreviewPages(comic.coverImage, comic.previewPages);
    return (
      <ReaderExperienceDynamic
        comicData={{
          slug: String(comic.id),
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
