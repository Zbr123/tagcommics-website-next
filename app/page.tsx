import HeroSection from "@/src/components/sections/HeroSection";
import FlashSaleSection from "@/src/components/sections/FlashSaleSection";
import BestSellersSection from "@/src/components/sections/BestSellersSection";
import NewArrivalsSection from "@/src/components/sections/NewArrivalsSection";
import CategoriesSection from "@/src/components/sections/CategoriesSection";
import StatsSection from "@/src/components/sections/StatsSection";
import LogoSlider, { LogoImageItem } from "@/src/components/LogoSlider";
import {
  getFlashSaleBooks,
  getLatestReleaseBooks,
  getPopularBooks,
  toFlashSaleCard,
  toLatestReleaseCard,
  toPopularCard,
} from "@/src/lib/books-api";

export default async function Home() {
  const [latestRows, flashRows, popularRows] = await Promise.all([
    getLatestReleaseBooks(8),
    getFlashSaleBooks(12),
    getPopularBooks(12),
  ]);
  const latestReleases = latestRows.map(toLatestReleaseCard);
  const flashSaleComics = flashRows.map(toFlashSaleCard);
  const bestSellersComics = popularRows.map(toPopularCard);
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
