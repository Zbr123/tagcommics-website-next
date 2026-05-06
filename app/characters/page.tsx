import CharactersHub from "@/src/components/characters/CharactersHub";
import { normalizedToGridCharacter } from "@/src/data/characterDetailProfile";
import { getPublicCharacters } from "@/src/lib/characters-api";

export const metadata = {
  title: "Characters | Multiverse Hub",
  description: "Discover legendary heroes, villains, and cosmic entities.",
};

export const revalidate = 60;

export default async function CharactersPage() {
  const rows = await getPublicCharacters();
  const characters = rows.map(normalizedToGridCharacter);
  return <CharactersHub characters={characters} />;
}
