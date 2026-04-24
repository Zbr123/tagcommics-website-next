export type CharacterRole = "HERO" | "VILLAIN" | "ANTI_HERO" | "ENTITY";

export interface Character {
  slug: string;
  name: string;
  universe: string;
  role: CharacterRole;
  image: string;
  tagline: string;
  bio: string;
  /** Higher = more popular for sort */
  popularity: number;
}

export const CHARACTERS: Character[] = [
  {
    slug: "nova-prime",
    name: "Nova Prime",
    universe: "Cosmic Universe",
    role: "HERO",
    image: "/related-series1.png",
    tagline: "Elite guardian of the outer rim.",
    bio: "Nova Prime leads the stellar defense initiative.",
    popularity: 98,
  },
  {
    slug: "shadow-weaver",
    name: "Shadow Weaver",
    universe: "Mystic Realm",
    role: "VILLAIN",
    image: "/related-series2.png",
    tagline: "Threads fate through darkness.",
    bio: "A sorcerer who bends perception and fear.",
    popularity: 92,
  },
  {
    slug: "nightfall",
    name: "Nightfall",
    universe: "Earth-616",
    role: "ANTI_HERO",
    image: "/related-series3.png",
    tagline: "Justice without mercy.",
    bio: "Operating from the urban sprawl.",
    popularity: 88,
  },
  {
    slug: "arcana",
    name: "Arcana",
    universe: "Mystic Realm",
    role: "HERO",
    image: "/related-series4.png",
    tagline: "Arcane equilibrium.",
    bio: "Keeper of the twin orbs.",
    popularity: 85,
  },
  {
    slug: "titan-x",
    name: "Titan-X",
    universe: "Cosmic Universe",
    role: "ENTITY",
    image: "/titan-x.png",
    tagline: "Machine consciousness awakened.",
    bio: "A colossal construct whose red gaze calculates extinction-level events.",
    popularity: 90,
  },
  {
    slug: "phoenix-line",
    name: "Phoenix Line",
    universe: "Neon District",
    role: "HERO",
    image: "/character-book2.png",
    tagline: "Burns bright through every timeline.",
    bio: "Street-level guardian forged in the heat of the megacity sprawl.",
    popularity: 82,
  },
  {
    slug: "steel-circuit",
    name: "Steel Circuit",
    universe: "Neon District",
    role: "ANTI_HERO",
    image: "/comic_slider8.png",
    tagline: "Wired for trouble, built to last.",
    bio: "Ex-corporate enforcer who rewired his own loyalty protocols.",
    popularity: 79,
  },
  {
    slug: "void-runner",
    name: "Void Runner",
    universe: "Cosmic Universe",
    role: "HERO",
    image: "/character-book2.png",
    tagline: "Outruns gravity and regret.",
    bio: "Courier between fractured dimensions when the bridges fail.",
    popularity: 84,
  },
  {
    slug: "crimson-tide",
    name: "Crimson Tide",
    universe: "Earth-616",
    role: "VILLAIN",
    image: "/comic_slider10.png",
    tagline: "The tide turns red when she arrives.",
    bio: "Harbor queen of contraband and consequence.",
    popularity: 86,
  },
  {
    slug: "drift-city",
    name: "Drift City",
    universe: "Neon District",
    role: "ENTITY",
    image: "/comic_page_slider.png",
    tagline: "The city remembers everyone.",
    bio: "Emergent consciousness from traffic grids, cameras, and rumor.",
    popularity: 74,
  },
  {
    slug: "signal-ghost",
    name: "Signal Ghost",
    universe: "Mystic Realm",
    role: "ANTI_HERO",
    image: "/comic_page_slider2.png",
    tagline: "Broadcasts from the other side.",
    bio: "Hacker-mystic who hijacks screens to deliver prophecies.",
    popularity: 77,
  },
  {
    slug: "echo-nine",
    name: "Echo Nine",
    universe: "Ridge Verse",
    role: "HERO",
    image: "/comic_page_slider3.png",
    tagline: "Nine lives, one mission.",
    bio: "Elite scout mapping anomalies along the Ridge fault line.",
    popularity: 81,
  },
  {
    slug: "i-survived",
    name: "I Survived",
    universe: "Survivor Timeline",
    role: "HERO",
    image: "/I-SURVIVED.webp",
    tagline: "Proof the worst day can be survived.",
    bio: "Reluctant icon of resilience after the collapse event.",
    popularity: 83,
  },
  {
    slug: "the-new-girl",
    name: "The New Girl",
    universe: "Ridge Verse",
    role: "HERO",
    image: "/THE_NEW_GIRL.webp",
    tagline: "Fresh face, old powers awakening.",
    bio: "New transfer student with a lineage nobody expected.",
    popularity: 78,
  },
  {
    slug: "the-long-game",
    name: "The Long Game",
    universe: "Earth-616",
    role: "VILLAIN",
    image: "/The-LONG_GAME.webp",
    tagline: "Patience is the sharpest blade.",
    bio: "Mastermind who trades years for inches of advantage.",
    popularity: 91,
  },
  {
    slug: "women-of-ridge",
    name: "Women of Ridge",
    universe: "Ridge Verse",
    role: "HERO",
    image: "/THE_WOMEN_OF_RIDGE.webp",
    tagline: "Sisters at the edge of the world.",
    bio: "Collective guardians when the Ridge bleeds into our reality.",
    popularity: 87,
  },
];

export function getCharacterBySlug(slug: string) {
  return CHARACTERS.find((c) => c.slug === slug);
}
