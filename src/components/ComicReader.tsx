"use client";

export interface ComicReaderProps {
  /** PDF URL (e.g. "/comics/preview-badman.pdf") — first 10 pages only for preview */
  pdfUrl: string;
  /** Optional title shown in HUD */
  title?: string;
  /** Callback for metrics: (pageNumber, totalPages) */
  onPageView?: (page: number, total: number) => void;
  /** Optional class for the reader container */
  className?: string;
}

export default function ComicReader(_props: ComicReaderProps) {
  return null;
}
