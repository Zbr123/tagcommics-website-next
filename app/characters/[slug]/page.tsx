import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCharacterBySlug } from "@/src/data/characters";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = getCharacterBySlug(slug);
  if (!c) return { title: "Character" };
  return { title: `${c.name} | Multiverse Hub`, description: c.tagline };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  if (!character) notFound();

  return (
    <div className="min-h-screen bg-black px-6 pb-20 pt-24 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/characters" className="mb-8 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300">
          ← Back to characters
        </Link>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
          <div className="relative aspect-[2/1] w-full">
            <Image src={character.image} alt="" fill className="object-cover" priority sizes="896px" />
          </div>
          <div className="p-8">
            <p className="text-sm text-cyan-400">{character.universe}</p>
            <h1 className="mt-2 text-3xl font-black">{character.name}</h1>
            <p className="mt-4 text-zinc-400">{character.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
