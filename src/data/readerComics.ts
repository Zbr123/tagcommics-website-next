export interface ReaderComic {
  id: number;
  title: string;
  coverImage: string;
  previewPages: string[];
  pdfUrl?: string;
}

// SINGLE SOURCE OF TRUTH - Images MUST match exactly what cards show
// From allComics (ids 1-18)
const fromAllComics: ReaderComic[] = [
  { id: 1, title: "Spider-Man #1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 2, title: "Batman Annual", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 3, title: "Attack on Titan", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 4, title: "One Piece Vol.1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 5, title: "Deadpool #1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 6, title: "Wonder Woman", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 7, title: "X-Men #1", coverImage: "/comic_slider7.png", previewPages: ["/comic_slider7.png"] },
  { id: 8, title: "Superman Returns", coverImage: "/comic_slider8.png", previewPages: ["/comic_slider8.png"] },
  { id: 9, title: "Marvel Masterworks", coverImage: "/comic_slider9.png", previewPages: ["/comic_slider9.png"] },
  { id: 10, title: "DC Black Label", coverImage: "/comic_slider10.png", previewPages: ["/comic_slider10.png"] },
  { id: 11, title: "Manga Classics Box Set", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 12, title: "The Walking Dead Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 13, title: "Saga Deluxe Edition", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 14, title: "Invincible Compendium", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 15, title: "Watchmen Absolute", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 16, title: "Naruto Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 17, title: "Dragon Ball Z", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 18, title: "The Avengers", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
];

// From categoryComics superhero (ids 101-116)
const fromCategoryComicsSuperhero: ReaderComic[] = [
  { id: 101, title: "Spider-Man #1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 102, title: "Batman Annual", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 103, title: "X-Men #1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 104, title: "The Avengers", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 105, title: "Superman Returns", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 106, title: "Wonder Woman", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 107, title: "Iron Man #1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 108, title: "Captain America", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 109, title: "The Flash", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 110, title: "Thor #1", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 111, title: "Black Panther", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 112, title: "Green Lantern", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 113, title: "Wolverine #1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 114, title: "Deadpool #1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 115, title: "Hulk #1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 116, title: "Doctor Strange", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
];

// From categoryComics manga (ids 201-216)
const fromCategoryComicsManga: ReaderComic[] = [
  { id: 201, title: "One Piece Vol.1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 202, title: "Naruto Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 203, title: "Attack on Titan", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 204, title: "My Hero Academia Vol.1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 205, title: "Dragon Ball Z", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 206, title: "Demon Slayer Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 207, title: "Jujutsu Kaisen Vol.1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 208, title: "Chainsaw Man Vol.1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 209, title: "Spy x Family Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 210, title: "Bleach Vol.1", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 211, title: "Death Note Vol.1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 212, title: "Fullmetal Alchemist Vol.1", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 213, title: "One Punch Man Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 214, title: "Hunter x Hunter Vol.1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 215, title: "Tokyo Revengers Vol.1", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 216, title: "Blue Lock Vol.1", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
];

// From categoryComics horror (ids 301-316)
const fromCategoryComicsHorror: ReaderComic[] = [
  { id: 301, title: "The Walking Dead Vol.1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 302, title: "30 Days of Night", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 303, title: "Hellblazer", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 304, title: "Locke & Key", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 305, title: "Swamp Thing", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 306, title: "From Hell", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 307, title: "Uzumaki", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 308, title: "Gyo", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 309, title: "Tomie", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 310, title: "The Sandman: Preludes", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 311, title: "Wytches", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 312, title: "Harrow County", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 313, title: "Something is Killing the Children", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 314, title: "The Nice House on the Lake", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 315, title: "Gideon Falls", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 316, title: "Revival", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
];

// From categoryComics fantasy (ids 401-416)
const fromCategoryComicsFantasy: ReaderComic[] = [
  { id: 401, title: "Saga Deluxe Edition", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 402, title: "Fables Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 403, title: "The Sandman Omnibus", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 404, title: "Monstress Vol.1", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 405, title: "Bone", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 406, title: "Rat Queens Vol.1", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 407, title: "The Wicked + The Divine", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 408, title: "The Unwritten", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 409, title: "Lucifer", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 410, title: "The Books of Magic", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 411, title: "Mage: The Hero Discovered", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 412, title: "Coda", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
  { id: 413, title: "The Realm", coverImage: "/comic-slider5.png", previewPages: ["/comic-slider5.png"] },
  { id: 414, title: "Birthright", coverImage: "/comic-slider1.png", previewPages: ["/comic-slider1.png"] },
  { id: 415, title: "Die", coverImage: "/comic-slide4.png", previewPages: ["/comic-slide4.png"] },
  { id: 416, title: "The Last God", coverImage: "/comic-slider3.png", previewPages: ["/comic-slider3.png"] },
];

export const READER_COMICS: ReaderComic[] = [
  ...fromAllComics,
  ...fromCategoryComicsSuperhero,
  ...fromCategoryComicsManga,
  ...fromCategoryComicsHorror,
  ...fromCategoryComicsFantasy,
];

export function getReaderComic(id: number): ReaderComic | undefined {
  return READER_COMICS.find((c) => c.id === id);
}
