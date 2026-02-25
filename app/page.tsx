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

// New Arrivals Data
const newArrivals = [
  { id: 1, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, rating: 4.8, image: "/comic-slider1.png", tag: "NEW" },
  { id: 2, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, rating: 4.9, image: "/comic-slider5.png", tag: "HOT" },
  { id: 3, title: "Invincible Compendium", author: "Robert Kirkman", price: 39.99, rating: 4.7, image: "/comic-slider3.png", tag: "NEW" },
  { id: 4, title: "Watchmen Absolute", author: "Alan Moore", price: 29.99, rating: 5.0, image: "/comic-slide4.png", tag: "CLASSIC" },
  { id: 5, title: "Sin City Library", author: "Frank Miller", price: 34.99, rating: 4.8, image: "/comic-slider1.png", tag: "SALE" },
  { id: 6, title: "Preacher Omnibus", author: "Garth Ennis", price: 49.99, rating: 4.9, image: "/comic-slider5.png", tag: "BESTSELLER" },
  { id: 7, title: "Y: The Last Man", author: "Brian K. Vaughan", price: 19.99, rating: 4.8, image: "/comic-slider3.png", tag: "NEW" },
  { id: 8, title: "Sandman Omnibus", author: "Neil Gaiman", price: 44.99, rating: 5.0, image: "/comic-slide4.png", tag: "CLASSIC" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <HeroSection />

      {/* Flash Sale Section */}
      

      {/* Publisher Logos Dual Slider — top row scrolls left, bottom row scrolls right */}
      <div className="text-center mb-12 mt-10">
        <h2 className="text-center text-white text-2xl md:text-5xl font-black">Comic Book Publishers</h2>
      </div>
      <section className="py-8 w-full">
        <div className="w-full px-4 md:px-6 lg:px-12 mx-auto">
          {/* Top row — scrolls left (faster) */}
          <div className="mb-6">
            <LogoSlider direction="left" speedSeconds={30}>
              <LogoImageItem src="/comics-logos/DC_Comics_logo.png" alt="DC" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/AC-Comics-logo.png" alt="AC Comics" className="h-10 md:h-14" />
               <LogoImageItem src="/comics-logos/Marvel-logo.png" alt="Wonder Woman" className="h-10 md:h-14" />
                <LogoImageItem src="/comics-logos/valiant-comics-logo.jpg" alt="Wonder Woman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/batman-logo1.png" alt="Batman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/superman-logo.png" alt="Superman" className="h-10 md:h-14" />
              {/* <LogoImageItem src="/comics-logos/Ww-logos.jpg" alt="Wonder Woman" className="h-10 md:h-14" /> */}
            </LogoSlider>
          </div>

          {/* Bottom row — scrolls right (slightly different speed) */}
          <div>
            <LogoSlider direction="right" speedSeconds={28}>
              <LogoImageItem src="/comics-logos/DC_Comics_logo.png" alt="DC" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/AC_comics1-logo.png" alt="AC Comics" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/batman-logo2.png" alt="Batman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/spider-man-logo.png" alt="Batman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/Dc2-logo.jpg" alt="DC" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/Superman1_logo.png" alt="Superman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/marvel2-logo.png" alt="Superman" className="h-10 md:h-14" />
              <LogoImageItem src="/comics-logos/Ww-logos.jpg" alt="Wonder Woman" className="h-10 md:h-14" />
            </LogoSlider>
          </div>
        </div>
      </section>

<FlashSaleSection comics={flashSaleComics} />
      {/* Best Sellers Section */}
      <BestSellersSection comics={bestSellersComics} />

      {/* New Arrivals Section */}
      <NewArrivalsSection comics={newArrivals} />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
}
