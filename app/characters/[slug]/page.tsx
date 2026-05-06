import { notFound } from "next/navigation";
import { buildCharacterDetailProfileFromApi } from "@/src/data/characterDetailProfile";
import CharacterHeroSpotlight from "@/src/components/characters/detail/CharacterHeroSpotlight";
import CharacterKeyAttributes from "@/src/components/characters/detail/CharacterKeyAttributes";
import CharacterLoreAccordion from "@/src/components/characters/detail/CharacterLoreAccordion";
import CharacterComicsSection from "@/src/components/characters/detail/CharacterComicsSection";
import CharacterRelatedEntities from "@/src/components/characters/detail/CharacterRelatedEntities";
import { getNormalizedCharacterBySlug } from "@/src/lib/characters-public-data";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const row = await getNormalizedCharacterBySlug(slug);
  if (!row) return { title: "Character | TagComics" };
  const desc = row.description.trim().slice(0, 160);
  return {
    title: `${row.character_name} | TagComics`,
    description: desc || row.character_name,
  };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await getNormalizedCharacterBySlug(slug);
  if (!row) notFound();

  const profile = buildCharacterDetailProfileFromApi(row);

  return (
    <main className="bg-black text-white">
      <CharacterHeroSpotlight profile={profile} />
      <CharacterComicsSection comics={profile.comics} />
      <CharacterKeyAttributes attributes={profile.attributes} />
      <CharacterLoreAccordion items={profile.lore} />
      {profile.related.length > 0 ? (
        <CharacterRelatedEntities entities={profile.related} />
      ) : null}
    </main>
  );
}
