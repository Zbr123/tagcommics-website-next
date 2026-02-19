/**
 * Flattened list of comics from category pages (Shop by Category).
 * Used by the comic detail page so /comic/[id] works for category card links (e.g. /comic/409).
 */

export interface CategoryComic {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  tag: string;
  description: string;
  stock: number;
  inCart: number;
  sold?: string;
  originalPrice?: number;
  discount?: number;
  rating: number;
}

const withDefaults = (c: {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  tag: string;
  sold?: string;
  originalPrice?: number;
  discount?: number;
  rating: number;
}): CategoryComic => ({
  ...c,
  description: `${c.title} by ${c.author}. A great read.`,
  stock: 50,
  inCart: 0,
});

const superhero = [
  { id: 101, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 102, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 103, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 104, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 105, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC" },
  { id: 106, title: "Wonder Woman", author: "William Moulton Marston", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.2k", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC" },
  { id: 107, title: "Iron Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 108, title: "Captain America", author: "Jack Kirby", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.6k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 109, title: "The Flash", author: "Gardner Fox", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.3k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 110, title: "Thor #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.8, sold: "1.7k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 111, title: "Black Panther", author: "Stan Lee", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.9, sold: "1.9k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 112, title: "Green Lantern", author: "John Broome", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.6, sold: "1.4k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 113, title: "Wolverine #1", author: "Chris Claremont", price: 7.99, originalPrice: 14.99, discount: 47, rating: 4.8, sold: "1.9k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 114, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.4k", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 115, title: "Hulk #1", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.6k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 116, title: "Doctor Strange", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.5k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
];

const manga = [
  { id: 201, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 202, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 203, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 204, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.4k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 205, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
  { id: 206, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "2.8k", image: "/comic-slider1.png", category: "Manga", tag: "HOT" },
  { id: 207, title: "Jujutsu Kaisen Vol.1", author: "Gege Akutami", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.1k", image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 208, title: "Chainsaw Man Vol.1", author: "Tatsuki Fujimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "2.9k", image: "/comic-slide4.png", category: "Manga", tag: "HOT" },
  { id: 209, title: "Spy x Family Vol.1", author: "Tatsuya Endo", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.6k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 210, title: "Bleach Vol.1", author: "Tite Kubo", price: 8.49, originalPrice: 14.99, discount: 43, rating: 4.7, sold: "2.7k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
  { id: 211, title: "Death Note Vol.1", author: "Tsugumi Ohba", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.2k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC" },
  { id: 212, title: "Fullmetal Alchemist Vol.1", author: "Hiromu Arakawa", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.8k", image: "/comic-slide4.png", category: "Manga", tag: "CLASSIC" },
  { id: 213, title: "One Punch Man Vol.1", author: "ONE", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "3.3k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 214, title: "Hunter x Hunter Vol.1", author: "Yoshihiro Togashi", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.9, sold: "3.0k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC" },
  { id: 215, title: "Tokyo Revengers Vol.1", author: "Ken Wakui", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.7, sold: "2.5k", image: "/comic-slider5.png", category: "Manga", tag: "NEW" },
  { id: 216, title: "Blue Lock Vol.1", author: "Muneyuki Kaneshiro", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.7, sold: "2.4k", image: "/comic-slider5.png", category: "Manga", tag: "HOT" },
];

const horror = [
  { id: 301, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, originalPrice: 19.99, discount: 35, rating: 4.8, sold: "1.4k", image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 302, title: "30 Days of Night", author: "Steve Niles", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "856", image: "/comic-slider1.png", category: "Graphic Novels", tag: "HOT" },
  { id: 303, title: "Hellblazer", author: "Jamie Delano", price: 11.99, originalPrice: 16.99, discount: 29, rating: 4.8, sold: "623", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC" },
  { id: 304, title: "Locke & Key", author: "Joe Hill", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.9, sold: "987", image: "/comic-slider3.png", category: "Graphic Novels", tag: "BESTSELLER" },
  { id: 305, title: "Swamp Thing", author: "Alan Moore", price: 15.99, originalPrice: 21.99, discount: 27, rating: 4.9, sold: "1.2k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC" },
  { id: 306, title: "From Hell", author: "Alan Moore", price: 19.99, originalPrice: 24.99, discount: 20, rating: 4.8, sold: "756", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 307, title: "Uzumaki", author: "Junji Ito", price: 16.99, originalPrice: 22.99, discount: 26, rating: 4.9, sold: "1.1k", image: "/comic-slider5.png", category: "Manga", tag: "HOT" },
  { id: 308, title: "Gyo", author: "Junji Ito", price: 15.99, originalPrice: 21.99, discount: 27, rating: 4.7, sold: "892", image: "/comic-slider3.png", category: "Manga", tag: "NEW" },
  { id: 309, title: "Tomie", author: "Junji Ito", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.8, sold: "1.0k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 310, title: "The Sandman: Preludes", author: "Neil Gaiman", price: 18.99, originalPrice: 24.99, discount: 24, rating: 4.9, sold: "1.3k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 311, title: "Wytches", author: "Scott Snyder", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.7, sold: "678", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 312, title: "Harrow County", author: "Cullen Bunn", price: 12.99, originalPrice: 17.99, discount: 28, rating: 4.6, sold: "543", image: "/comic-slider3.png", category: "Comics", tag: "HOT" },
  { id: 313, title: "Something is Killing the Children", author: "James Tynion IV", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.8, sold: "789", image: "/comic-slide4.png", category: "Comics", tag: "HOT" },
  { id: 314, title: "The Nice House on the Lake", author: "James Tynion IV", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.9, sold: "654", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 315, title: "Gideon Falls", author: "Jeff Lemire", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.7, sold: "567", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 316, title: "Revival", author: "Tim Seeley", price: 12.99, originalPrice: 17.99, discount: 28, rating: 4.6, sold: "432", image: "/comic-slider3.png", category: "Comics", tag: "HOT" },
];

const fantasy = [
  { id: 401, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.9, sold: "1.7k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "HOT" },
  { id: 402, title: "Fables Vol.1", author: "Bill Willingham", price: 16.99, originalPrice: 22.99, discount: 26, rating: 4.8, sold: "1.2k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "BESTSELLER" },
  { id: 403, title: "The Sandman Omnibus", author: "Neil Gaiman", price: 44.99, rating: 5.0, sold: "623", image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 404, title: "Monstress Vol.1", author: "Marjorie Liu", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.9, sold: "987", image: "/comic-slider3.png", category: "Graphic Novels", tag: "BESTSELLER" },
  { id: 405, title: "Bone", author: "Jeff Smith", price: 19.99, originalPrice: 25.99, discount: 23, rating: 4.9, sold: "1.4k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 406, title: "Rat Queens Vol.1", author: "Kurtis J. Wiebe", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "756", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 407, title: "The Wicked + The Divine", author: "Kieron Gillen", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.8, sold: "892", image: "/comic-slide4.png", category: "Comics", tag: "HOT" },
  { id: 408, title: "The Unwritten", author: "Mike Carey", price: 16.99, originalPrice: 21.99, discount: 23, rating: 4.7, sold: "678", image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 409, title: "Lucifer", author: "Mike Carey", price: 18.99, originalPrice: 24.99, discount: 24, rating: 4.9, sold: "1.1k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 410, title: "The Books of Magic", author: "Neil Gaiman", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.8, sold: "856", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 411, title: "Mage: The Hero Discovered", author: "Matt Wagner", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.6, sold: "543", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 412, title: "Coda", author: "Simon Spurrier", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "654", image: "/comic-slider3.png", category: "Comics", tag: "HOT" },
  { id: 413, title: "The Realm", author: "Seth Peck", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.5, sold: "432", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 414, title: "Birthright", author: "Joshua Williamson", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.8, sold: "789", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 415, title: "Die", author: "Kieron Gillen", price: 16.99, originalPrice: 21.99, discount: 23, rating: 4.9, sold: "567", image: "/comic-slide4.png", category: "Comics", tag: "HOT" },
  { id: 416, title: "The Last God", author: "Philip Kennedy Johnson", price: 17.99, originalPrice: 22.99, discount: 22, rating: 4.7, sold: "456", image: "/comic-slider3.png", category: "Comics", tag: "NEW" },
];

const flat = [...superhero, ...manga, ...horror, ...fantasy];

export const categoryComics: CategoryComic[] = flat.map(withDefaults);
