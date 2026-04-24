import { notFound } from "next/navigation";
import { CHARACTERS, getCharacterBySlug } from "@/src/data/characters";
import { buildCharacterDetailProfile } from "@/src/data/characterDetailProfile";
import CharacterHeroSpotlight from "@/src/components/characters/detail/CharacterHeroSpotlight";
import CharacterKeyAttributes from "@/src/components/characters/detail/CharacterKeyAttributes";
import CharacterLoreAccordion from "@/src/components/characters/detail/CharacterLoreAccordion";
import CharacterComicsSection from "@/src/components/characters/detail/CharacterComicsSection";
import CharacterRelatedEntities from "@/src/components/characters/detail/CharacterRelatedEntities";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = getCharacterBySlug(slug);
  if (!c) return { title: "Character | ComicVerse" };
  return {
    title: `${c.name} | ComicVerse`,
    description: c.tagline,
  };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  if (!character) notFound();

  const profile = buildCharacterDetailProfile(character);

  return (
    <main className="bg-black text-white">
      <CharacterHeroSpotlight profile={profile} />
      <CharacterComicsSection comics={profile.comics} />
      <CharacterKeyAttributes attributes={profile.attributes} />
      <CharacterLoreAccordion items={profile.lore} />
      <CharacterRelatedEntities entities={profile.related} />
    </main>
  );
}
