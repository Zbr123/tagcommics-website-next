import NewReleasesClient from "./NewReleasesClient";
import { bookFeedItemToProductCardComic, getAllLatestReleaseBooks } from "@/src/lib/books-api";

export const revalidate = 60;

export default async function NewReleasesPage() {
  const items = await getAllLatestReleaseBooks();
  const comics = items.map(bookFeedItemToProductCardComic);
  const heroComics = comics.slice(0, 5).map((c) => ({
    id: c.id,
    image: c.image,
    title: c.title,
    readerHref: c.readerHref,
  }));

  return <NewReleasesClient comics={comics} heroComics={heroComics} />;
}
