import { cache } from "react";
import { getPublicCharacterById, getPublicCharacters } from "@/src/lib/characters-api";
import { characterNameToSlug } from "@/src/lib/character-slug";

/** Dedupes fetches between generateMetadata and the page for the same slug. */
export const getNormalizedCharacterBySlug = cache(async (slug: string) => {
  const list = await getPublicCharacters();
  const match = list.find((c) => characterNameToSlug(c.character_name) === slug);
  if (!match) return null;
  const detail = await getPublicCharacterById(match.id);
  return detail ?? match;
});
