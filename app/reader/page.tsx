import type { Metadata } from "next";
import ReaderExperienceDynamic from "@/src/components/reader/ReaderExperienceDynamic";
import { READER_DEFAULT_PDF, READER_DEFAULT_TITLE } from "@/src/components/reader/readerConstants";

export const metadata: Metadata = {
  title: `Reader · ${READER_DEFAULT_TITLE} | ComicVerse`,
};

export default function ReaderIndexPage() {
  return <ReaderExperienceDynamic pdfPath={READER_DEFAULT_PDF} title={READER_DEFAULT_TITLE} />;
}
