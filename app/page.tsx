import HeroSection from "@/src/components/sections/HeroSection";
import FlashSaleSection from "@/src/components/sections/FlashSaleSection";
import BestSellersSection from "@/src/components/sections/BestSellersSection";
import NewArrivalsSection from "@/src/components/sections/NewArrivalsSection";
import CategoriesSection from "@/src/components/sections/CategoriesSection";
import StatsSection from "@/src/components/sections/StatsSection";
import LogoSlider, { LogoImageItem } from "@/src/components/LogoSlider";

// Flash Sale Data
const flashSaleComics = [
  { id: 1, title: "Spider-Man #1", price: 4.99, originalPrice: 9.99, discount: 50, image: "/comic-slider1.png" },
  { id: 2, title: "Batman Annual", price: 6.99, originalPrice: 12.99, discount: 46, image: "/comic-slider5.png" },
  { id: 3, title: "Attack on Titan", price: 8.99, originalPrice: 14.99, discount: 40, image: "/comic-slider3.png" },
  { id: 4, title: "One Piece Vol.1", price: 7.99, originalPrice: 15.99, discount: 50, image: "/comic-slide4.png" },
  { id: 5, title: "Deadpool #1", price: 5.99, originalPrice: 11.99, discount: 50, image: "/comic-slider1.png" },
  { id: 6, title: "Wonder Woman", price: 6.49, originalPrice: 12.99, discount: 50, image: "/comic-slider5.png" },
  { id: 7, title: "X-Men #1", price: 5.99, originalPrice: 11.99, discount: 51, image: "/comic-slider3.png" },
  { id: 8, title: "Superman Returns", price: 7.49, originalPrice: 14.99, discount: 50, image: "/comic-slide4.png" },
];

// Best Sellers Data
const bestSellersComics = [
  { id: 1, title: "Marvel Masterworks", author: "Stan Lee", price: 19.99, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png" },
  { id: 2, title: "DC Black Label", author: "Various", price: 16.99, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png" },
  { id: 3, title: "Manga Classics Box Set", author: "Various", price: 44.99, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png" },
  { id: 4, title: "Graphic Novel Bundle", author: "Various", price: 29.99, rating: 4.6, sold: "1.5k", image: "/comic-slide4.png" },
  { id: 5, title: "Indie Collection", author: "Various Artists", price: 22.99, rating: 4.8, sold: "900", image: "/comic-slider1.png" },
  { id: 6, title: "Watchmen Absolute", author: "Alan Moore", price: 29.99, rating: 5.0, sold: "2.1k", image: "/comic-slider5.png" },
  { id: 7, title: "The Walking Dead", author: "Robert Kirkman", price: 24.99, rating: 4.9, sold: "1.9k", image: "/comic-slider3.png" },
  { id: 8, title: "Saga Deluxe", author: "Brian K. Vaughan", price: 34.99, rating: 4.9, sold: "1.7k", image: "/comic-slide4.png" },
];

/** Homepage Latest Releases — single row of four; cards link to `/reader/[id]` */
const latestReleases = [
  { id: 1, title: "Shadows of Aethelgard", image: "/shadows.png", issue: "#42", genre: "Fantasy", status: "Ongoing" },
  { id: 2, title: "The Vanguard", image: "/vanguard.png", issue: "#12", genre: "Action", status: "New Issue" },
  { id: 3, title: "Crimson Noir", image: "/crimsin.png", issue: "#08", genre: "Mystery", status: "Completed" },
  { id: 4, title: "Urban Echoes", image: "/urban.png", issue: "#03", genre: "Drama", status: "Ongoing" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <HeroSection />

      <NewArrivalsSection releases={latestReleases} />
      <FlashSaleSection comics={flashSaleComics} />
      <BestSellersSection comics={bestSellersComics} />

      {/* Publisher logos — after product rows: reads as “trusted by” before browse-by-category */}
      <section className="w-full border-t border-white/[0.06] bg-black py-10 md:py-14">
        <div className="mx-auto mb-8 max-w-[1440px] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white md:text-4xl lg:text-5xl">Comic Book Publishers</h2>
          <p className="mt-2 text-sm text-zinc-400 md:text-base">Imprints and partners behind the titles in our catalog.</p>
        </div>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <LogoSlider direction="left" speedSeconds={60}>
              <LogoImageItem src="/comics-logos/black-batman-logo3.png" alt="black-batman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/Marvel-logo.png" alt="Marvel" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/images-comics.png" alt="AC Comics" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/valiant-comics-logo.jpg" alt="Valiant Comics" className="h-10 md:h-14" />
              {/* <LogoImageItem src="/comics-logos/black-batman-logo2.jpg" alt="Superman" className="h-10 md:h-14" /> */}
            </LogoSlider>
          </div>
          <div>
            <LogoSlider direction="right" speedSeconds={48}>
              <LogoImageItem src="/comics-logos/black-batman-logo3.png" alt="Batman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/Marvel-logo.png" alt="DC Comics" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/images-comics.png" alt="AC Comics" className="h-10 md:h-14" />
              {/* <LogoImageItem src="/comics-logos/spider-man-logo.png" alt="Spider-Man" className="h-10 md:h-14" /> */}
              {/* <LogoImageItem src="/comics-logos/DC-Comics-Logo.png" alt="DC Comics" className="h-10 md:h-14" /> */}
              <LogoImageItem src="/comics-logos/valiant-comics-logo.jpg" alt="Superman" className="h-10 md:h-14" />
            </LogoSlider>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
}
