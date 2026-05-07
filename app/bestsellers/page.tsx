import BestSellersClient from "./BestSellersClient";
import { bookFeedItemToProductCardComic, getAllPopularBooks } from "@/src/lib/books-api";

export const revalidate = 60;

export default async function BestSellersPage() {
  const items = await getAllPopularBooks();
  const comics = items.map(bookFeedItemToProductCardComic);
  const carouselSlides = comics.slice(0, 5).map((c) => ({
    image: c.image,
    href: c.readerHref,
  }));

  return <BestSellersClient comics={comics} carouselSlides={carouselSlides} />;
}
