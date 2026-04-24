import type { Metadata } from "next";
import ReaderExperienceDynamic from "@/src/components/reader/ReaderExperienceDynamic";
import { READER_DEFAULT_PDF, READER_DEFAULT_TITLE } from "@/src/components/reader/readerConstants";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Reader · ${READER_DEFAULT_TITLE} (#${id}) | ComicVerse` };
}

export default async function ReaderSessionPage({ params }: Props) {
  const { id } = await params;
  return <ReaderExperienceDynamic pdfPath={READER_DEFAULT_PDF} title={READER_DEFAULT_TITLE} subtitle={`Session · ${id}`} />;
}
