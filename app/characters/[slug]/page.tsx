import { notFound } from "next/navigation";
import { buildCharacterDetailProfileFromApi } from "@/src/data/characterDetailProfile";
import CharacterHeroSpotlight from "@/src/components/characters/detail/CharacterHeroSpotlight";
import CharacterKeyAttributes from "@/src/components/characters/detail/CharacterKeyAttributes";
import CharacterLoreAccordion from "@/src/components/characters/detail/CharacterLoreAccordion";
import CharacterComicsSection from "@/src/components/characters/detail/CharacterComicsSection";
import CharacterRelatedEntities from "@/src/components/characters/detail/CharacterRelatedEntities";
import { getNormalizedCharacterBySlug } from "@/src/lib/characters-public-data";
import { characterNameToSlug } from "@/src/lib/character-slug";
import { getPublicCharacters } from "@/src/lib/characters-api";

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
  const relatedFromApi = profile.related;
  const relatedFallback =
    relatedFromApi.length > 0
      ? relatedFromApi
      : (await getPublicCharacters())
          .filter((c) => characterNameToSlug(c.character_name) !== slug)
          .slice(0, 5)
          .map((c, i) => ({
            slug: characterNameToSlug(c.character_name),
            name: c.character_name,
            image: c.cover_image_url,
            relation: c.role || c.alignment || c.universe || "Related",
          }));

  return (
    <main className="bg-black text-white">
      <CharacterHeroSpotlight profile={profile} />
      <CharacterComicsSection comics={profile.comics} />
      <CharacterKeyAttributes attributes={profile.attributes} />
      <CharacterLoreAccordion items={profile.lore} />
      {relatedFallback.length > 0 ? (
        <CharacterRelatedEntities entities={relatedFallback} />
      ) : null}
    </main>
  );
}
