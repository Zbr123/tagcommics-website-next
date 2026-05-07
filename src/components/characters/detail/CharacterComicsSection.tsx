 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks/use-cart";
import type { CharacterComic } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";
import { buildReaderHref } from "@/src/lib/readerHref";
import { createStripeCheckoutSession, readStoredAuthToken, type PurchasableItemType } from "@/src/lib/purchase-api";

function ComicCard({ comic }: { comic: CharacterComic }) {
  const router = useRouter();
  const { addToCart, getTotalItems } = useCart();
  const [added, setAdded] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const readHref = buildReaderHref({
    id: comic.catalogComicId ?? comic.id,
    coverImage: comic.image,
    title: comic.title,
    pdfUrl: comic.pdfUrl,
    price: comic.price,
    originalPrice: comic.originalPrice,
    author: comic.author,
    category: comic.category,
    tags: comic.tags,
    bookType: comic.bookType,
  });
  const price = typeof comic.price === "number" ? comic.price : 0;
  const originalPrice =
    typeof comic.originalPrice === "number" && comic.originalPrice > price
      ? comic.originalPrice
      : undefined;

  const handleAddToCart = () => {
    const productId = comic.catalogComicId ?? comic.id;
    const itemType: PurchasableItemType =
      typeof comic.bookType === "string" && comic.bookType.trim() ? "character_book" : "comic";
    addToCart({
      id: productId,
      title: comic.title,
      author: comic.author || "Unknown",
      price,
      originalPrice,
      image: comic.image,
      pdfUrl: comic.pdfUrl,
      category: comic.category,
      tags: comic.tags,
      bookType: comic.bookType,
      itemType,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };
  const handlePurchaseNow = async () => {
    try {
      setPurchaseError(null);
      const token = readStoredAuthToken();
      if (!token) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }
      const itemType: PurchasableItemType =
        typeof comic.bookType === "string" && comic.bookType.trim() ? "character_book" : "comic";
      const productId = comic.catalogComicId ?? comic.id;
      setIsPurchasing(true);
      const session = await createStripeCheckoutSession({
        itemType,
        itemId: String(productId),
        quantity: 1,
        token,
      });
      if (!session.url) {
        setPurchaseError("Unable to start checkout. Stripe URL is missing.");
        return;
      }
      window.location.href = session.url;
    } catch (error) {
      setPurchaseError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const cover = (
    <>
      <img
        src={comic.image}
        alt={comic.title}
        className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 ease-out group-hover/card:scale-[1.06] group-hover/card:opacity-100"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover/card:opacity-100"
        aria-hidden
      />
      <span className="absolute right-3 top-3 z-10 rounded-lg border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] font-bold tabular-nums tracking-wide text-white backdrop-blur-sm">
        {comic.issue}
      </span>
    </>
  );

  const coverBlock = (
    <Link
      href={readHref}
      className="relative block aspect-[2/3] overflow-hidden rounded-2xl glass-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <span className="sr-only">{comic.title} — open reader</span>
      {cover}
    </Link>
  );

  return (
    <article className="group/card flex flex-col">
      <div className="relative transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transition-property:transform,box-shadow] group-hover/card:-translate-y-1 group-hover/card:shadow-[0_24px_56px_rgba(0,0,0,0.55),0_0_40px_rgba(88,232,193,0.12)]">
        {coverBlock}
      </div>

      <div className="mt-4 translate-y-1 px-0.5 transition-transform duration-500 group-hover/card:translate-y-0">
        <Link
          href={readHref}
          className="block text-base font-bold leading-snug text-white transition-colors hover:text-brand md:text-lg"
        >
          {comic.title}
        </Link>
        <p className="mt-1.5 text-sm text-zinc-400 transition-colors duration-500 group-hover/card:text-zinc-300">
          {comic.genre}
          <span className="text-zinc-600"> • </span>
          {comic.status}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-brand">${price.toFixed(2)}</span>
          {originalPrice ? (
            <span className="text-xs text-zinc-500 line-through">${originalPrice.toFixed(2)}</span>
          ) : null}
        </div>
        {added ? (
          <Link href="/cart" className="mt-3 block text-[11px] font-bold uppercase tracking-[0.14em] text-brand hover:text-brand/80">
            Added to cart · View Cart ({getTotalItems()})
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/18 bg-zinc-900/85 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-200 transition hover:border-brand/50 hover:bg-zinc-800 hover:text-brand active:scale-[0.99]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handlePurchaseNow}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-brand/45 bg-brand/10 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-brand transition hover:border-brand hover:bg-brand hover:text-brand-foreground hover:shadow-[0_0_28px_rgba(88,232,193,0.35)] active:scale-[0.99]"
          disabled={isPurchasing}
        >
          {isPurchasing ? "Processing..." : "Purchase Now"}
        </button>
        <Link
          href={readHref}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-zinc-900/70 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/30 hover:bg-zinc-800"
        >
          Read Preview
        </Link>
        {purchaseError ? <p className="mt-2 text-xs text-red-300">{purchaseError}</p> : null}
      </div>
    </article>
  );
}

export default function CharacterComicsSection({ comics }: { comics: CharacterComic[] }) {
  return (
    <DetailSectionShell>
      <div className="mb-10 md:mb-14 lg:mb-16">
        <DetailSectionHeading white="FEATURED " brand="BOOKS" align="left" className="!tracking-tight" />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base">
          Books featuring this character from the catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-black via-zinc-950 to-black p-6 md:p-8 lg:p-10">
        {comics.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500 md:text-base">
            No books are linked to this character yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {comics.map((comic) => (
              <ComicCard key={String(comic.id)} comic={comic} />
            ))}
          </div>
        )}
      </div>
    </DetailSectionShell>
  );
}
