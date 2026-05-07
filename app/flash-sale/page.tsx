import FlashSaleClient from "./FlashSaleClient";
import { bookFeedItemToProductCardComic, getAllFlashSaleBooks } from "@/src/lib/books-api";

export const revalidate = 60;

export default async function FlashSalePage() {
  const items = await getAllFlashSaleBooks();
  const comics = items.map(bookFeedItemToProductCardComic);

  return <FlashSaleClient comics={comics} />;
}
