export interface ComicReaderData {
  slug: string;
  title: string;
  coverImage: string;
  previewPages: string[];
  pdfUrl?: string;
  isPurchased?: boolean;
}

export const COMIC_READER_DATA: Record<string, ComicReaderData> = {
  "1": {
    slug: "1",
    title: "Spider-Man #1",
    coverImage: "/comic-slider1.png",
    previewPages: [
      "/comic-slider1.png",
      "/comic-slider3.png",
      "/comic-slide4.png",
    ],
    pdfUrl: "/sample-comic.pdf",
    isPurchased: false,
  },
  "2": {
    slug: "2",
    title: "Batman Annual",
    coverImage: "/comic-slider5.png",
    previewPages: [
      "/comic-slider5.png",
      "/comic-slider1.png",
      "/comic-slide4.png",
    ],
    pdfUrl: undefined,
    isPurchased: false,
  },
  "8000": {
    slug: "8000",
    title: "Shadows of Aethelgard: Origins",
    coverImage: "/shadows.png",
    previewPages: [
      "/shadows.png",
      "/vanguard.png",
      "/crimsin.png",
    ],
    pdfUrl: undefined,
    isPurchased: false,
  },
};

export function getComicReaderData(slug: string): ComicReaderData | undefined {
  return COMIC_READER_DATA[slug];
}

export function getAllComicSlugs(): string[] {
  return Object.keys(COMIC_READER_DATA);
}