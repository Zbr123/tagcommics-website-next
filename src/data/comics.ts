export interface Comic {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  sold: string;
  image: string;
  category: string;
  tag?: string;
  description: string;
  stock: number;
  inCart?: number;
}

export const COMICS: Comic[] = [
  { id: 1, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER", description: "The amazing adventures of your friendly neighborhood Spider-Man! This classic issue features the web-slinger facing off against some of his most iconic villains. A must-have for any Marvel fan.", stock: 50, inCart: 1082 },
  { id: 2, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW", description: "The Dark Knight returns in this special annual edition. Follow Batman as he protects Gotham City from its most dangerous criminals.", stock: 30, inCart: 856 },
  { id: 3, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "HOT", description: "Humanity fights for survival against the Titans in this gripping manga series. Volume 1 introduces you to Eren, Mikasa, and Armin.", stock: 75, inCart: 1245 },
  { id: 4, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER", description: "Join Monkey D. Luffy on his quest to become the Pirate King! The first volume of this epic adventure series.", stock: 100, inCart: 2100 },
  { id: 5, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "900", image: "/comic-slider1.png", category: "Comics", tag: "NEW", description: "The Merc with a Mouth returns! Deadpool's hilarious and action-packed adventures continue in this first issue.", stock: 40, inCart: 623 },
  { id: 6, title: "Wonder Woman", author: "William Moulton Marston", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.2k", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC", description: "The Amazonian warrior princess fights for justice and peace. A classic DC Comics character in her original adventures.", stock: 25, inCart: 445 },
  { id: 7, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic_slider7.png", category: "Comics", tag: "BESTSELLER", description: "The original X-Men team assembles! Follow Professor X's students as they learn to control their mutant powers.", stock: 60, inCart: 987 },
  { id: 8, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic_slider8.png", category: "Comics", tag: "CLASSIC", description: "The Man of Steel's epic return to Metropolis. A modern take on the classic superhero story.", stock: 35, inCart: 712 },
  { id: 9, title: "Marvel Masterworks", author: "Stan Lee", price: 19.99, rating: 4.9, sold: "2.5k", image: "/comic_slider9.png", category: "Graphic Novels", tag: "BESTSELLER", description: "A collection of classic Marvel stories in a premium hardcover edition. Perfect for collectors and fans.", stock: 20, inCart: 543 },
  { id: 10, title: "DC Black Label", author: "Various", price: 16.99, rating: 4.7, sold: "1.8k", image: "/comic_slider10.png", category: "Graphic Novels", tag: "NEW", description: "Mature-themed DC stories in this premium collection. Features some of the best writers and artists in comics.", stock: 15, inCart: 389 },
  { id: 11, title: "Manga Classics Box Set", author: "Various", price: 44.99, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "BESTSELLER", description: "A beautiful box set containing multiple classic manga series. Great value for manga enthusiasts.", stock: 10, inCart: 234 },
  { id: 12, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, rating: 4.8, sold: "1.5k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "NEW", description: "The beginning of the zombie apocalypse. Follow Rick Grimes as he navigates a world overrun by the undead.", stock: 45, inCart: 678 },
  { id: 13, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, rating: 4.9, sold: "2.0k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "HOT", description: "An epic space opera about a family trying to survive a galactic war. Beautifully illustrated and masterfully written.", stock: 18, inCart: 456 },
  { id: 14, title: "Invincible Compendium", author: "Robert Kirkman", price: 39.99, rating: 4.7, sold: "1.8k", image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW", description: "The complete Invincible story in one massive volume. Over 1000 pages of superhero action and drama.", stock: 12, inCart: 321 },
  { id: 15, title: "Watchmen Absolute", author: "Alan Moore", price: 29.99, rating: 5.0, sold: "2.2k", image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC", description: "The definitive edition of the greatest graphic novel of all time. A must-read for any comics fan.", stock: 8, inCart: 189 },
  { id: 16, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER", description: "The story of a young ninja who seeks recognition from his peers and dreams of becoming the Hokage.", stock: 80, inCart: 1567 },
  { id: 17, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC", description: "Goku and friends continue their adventures in this legendary manga series. Action-packed and full of humor.", stock: 65, inCart: 1345 },
  { id: 18, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER", description: "Earth's mightiest heroes assemble! The original Avengers team-up in this classic Marvel comic.", stock: 50, inCart: 892 },
];

export function getComicById(id: number): Comic | undefined {
  return COMICS.find((c) => c.id === id);
}