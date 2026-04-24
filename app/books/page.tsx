import { permanentRedirect } from "next/navigation";

/** `/books` resolves to the same storefront as bestsellers. */
export default function BooksPage() {
  permanentRedirect("/bestsellers");
}
