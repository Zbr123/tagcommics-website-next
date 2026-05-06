import type { Character, CharacterRole } from "./characters";
import { CHARACTERS } from "./characters";
import type { CharacterBook, NormalizedCharacter } from "@/src/lib/characters-api";
import { characterNameToSlug } from "@/src/lib/character-slug";

export interface AttributeScores {
  strength: number;
  speed: number;
  intelligence: number;
  durability: number;
}

export interface LoreAccordionItem {
  id: string;
  title: string;
  body: string;
}

/** Featured comics on character detail — Read Now uses `id` at `/reader/[id]` */
export interface CharacterComic {
  id: string | number;
  title: string;
  image: string;
  pdfUrl?: string;
  author?: string;
  category?: string;
  tags?: string[] | string;
  bookType?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  /** e.g. "#1", "Vol. 2" */
  issue: string;
  genre: string;
  status: string;
  /** When set, cover + title link to storefront detail */
  catalogComicId?: number;
}

export interface RelatedEntity {
  slug: string;
  name: string;
  image: string;
  relation: string;
}


const STOCK_COVERS = [
  "/character-book1.png",
  "/character-book2.png",
  "/character-book3.png",
  "/related-series3.png",
  "/related-series4.png",
];

export interface CharacterDetailProfile {
  character: Character;
  /** Uppercase universe line under HERO badge */
  universeBadge: string;
  titleLine1: string;
  titleLine2: string;
  spotlightBody: string;
  firstAppearance: string;
  creator: string;
  alignment: string;
  attributes: AttributeScores;
  lore: LoreAccordionItem[];
  comics: CharacterComic[];
  related: RelatedEntity[];
}

const alignmentByRole: Record<CharacterRole, string> = {
  HERO: "Lawful Good",
  VILLAIN: "Chaotic Evil",
  ANTI_HERO: "Chaotic Neutral",
  ENTITY: "True Neutral",
};


function hashScores(slug: string): AttributeScores {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const r = (n: number) => 68 + (h % n);
  h = (h * 17) >>> 0;
  return {
    strength: r(28),
    speed: 70 + (h % 26),
    intelligence: 72 + ((h >> 3) % 24),
    durability: 69 + ((h >> 5) % 27),
  };
}

function defaultTitleLines(c: Character): [string, string] {
  const parts = c.name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return [parts[0]!.toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
  }
  return [c.name.toUpperCase(), c.universe.toUpperCase()];
}

function defaultLore(c: Character): LoreAccordionItem[] {
  return [
    {
      id: "incident",
      title: "The Incident",
      body: `The defining moment that set ${c.name} on their current path—public records are redacted, but witnesses still speak in whispers about what unfolded that night.`,
    },
    {
      id: "powers",
      title: "Powers & Abilities",
      body: `${c.name} brings a signature toolkit to every encounter: ${c.tagline.toLowerCase()} Field analysts catalog signature moves, resonance patterns, and tactical habits observed across engagements.`,
    },
    {
      id: "weaknesses",
      title: "Weaknesses",
      body: `No operator is without blind spots. Psychological pressure, temporal drift, and energy depletion remain recurring vulnerabilities in long-form conflicts across ${c.universe}.`,
    },
  ];
}

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function defaultComics(c: Character): CharacterComic[] {
  const h = slugHash(c.slug);
  const count = 2 + (h % 3);
  const titles = [
    `${c.name}: Origins`,
    `${c.universe} Field Report`,
    `Legends — ${c.name.split(" ")[0] ?? c.name}`,
    `Black File #${(h % 9) + 1}`,
  ];
  const statuses: CharacterComic["status"][] = ["Ongoing", "New Issue", "Completed", "Ongoing"];
  return Array.from({ length: count }, (_, i) => ({
    id: 8000 + h + i,
    title: titles[i]!,
    image: STOCK_COVERS[i % STOCK_COVERS.length]!,
    issue: `#${10 + i}`,
    genre: c.universe.split(/[\s-]/)[0] ?? "Sci-Fi",
    status: statuses[i % statuses.length]!,
    catalogComicId: ((h + i) % 18) + 1,
  }));
}

function pickRelated(currentSlug: string, all: Character[]): RelatedEntity[] {
  const others = all.filter((x) => x.slug !== currentSlug).slice(0, 6);
  const labels = ["Ally", "Nemesis", "Companion", "Mentor", "Rival", "Contact"] as const;
  return others.slice(0, 4).map((ch, i) => ({
    slug: ch.slug,
    name: ch.name,
    image: ch.image,
    relation: labels[i] ?? "Ally",
  }));
}

/** UX Pilot–style full override for Nova Prime */
const OVERRIDES: Partial<Record<string, Partial<Omit<CharacterDetailProfile, "character">>>> = {
  "nova-prime": {
    universeBadge: "COSMIC UNIVERSE",
    titleLine1: "NOVA",
    titleLine2: "PRIME",
    spotlightBody:
      "Last survivor of the Helios Accords, Nova Prime patrols the fracture lanes where civilizations blink out without warning. When ancient beacons wake along the rim, only one pilot still answers—carrying a debt to the dead and a promise to the living. The void does not negotiate; neither does she.",
    firstAppearance: "Cosmic Origins #1",
    creator: "Sarah Jenkins",
    alignment: "Lawful Good",
    attributes: { strength: 92, speed: 88, intelligence: 96, durability: 85 },
    lore: [
      {
        id: "incident",
        title: "The Incident",
        body:
          "During a critical experiment observing the collapse of a distant neutron star, Dr. Thorne's quantum observatory was bathed in an unprecedented wave of exotic radiation. Instead of destroying him, the energy bonded with his cellular structure, fundamentally altering his DNA and connecting him to the cosmic background radiation of the universe itself.",
      },
      {
        id: "powers",
        title: "Powers & Abilities",
        body:
          "- Energy Manipulation: Can absorb, channel, and project vast amounts of cosmic energy.\n- Flight: Capable of interstellar travel faster than light by riding cosmic currents.\n- Enhanced Durability: Skin is dense enough to withstand the vacuum of space and extreme temperatures.\n- Cosmic Awareness: Possesses a limited cosmic sense that alerts him to universal threats.",
      },
      {
        id: "weaknesses",
        title: "Weaknesses",
        body:
          "Nova Prime's powers are tied to the ambient cosmic energy of his environment. In areas of dead space or dimensions cut off from his home universe, his powers rapidly deplete. Additionally, overexertion can lead to a temporary loss of physical cohesion, risking permanent dissipation into pure energy.",
      },
    ],
    comics: [
      {
        id: 9101,
        title: "Cosmic Origins",
        image: "/comic-slider1.png",
        issue: "#1",
        genre: "Sci-Fi",
        status: "Ongoing",
      },
      {
        id: 9102,
        title: "Rise of Nova",
        image: "/comic-slider5.png",
        issue: "Vol. 1",
        genre: "Action",
        status: "Ongoing",
      },
      {
        id: 9103,
        title: "War of Galaxies",
        image: "/comic-slider3.png",
        issue: "#12",
        genre: "Sci-Fi",
        status: "New Issue",
      },
      {
        id: 9104,
        title: "Void Collapse",
        image: "/comic-slide4.png",
        issue: "#4",
        genre: "Cosmic Horror",
        status: "Ongoing",
      },
    ],
    related: [
      { slug: "phoenix-line", name: "Starlight", image: "/character-book2.png", relation: "Ally" },
      { slug: "titan-x", name: "Void King", image: "/titan-x.png", relation: "Nemesis" },
      { slug: "arcana", name: "A.E.G.I.S", image: "/related-series4.png", relation: "Companion" },
      { slug: "echo-nine", name: "Elder Kael", image: "/comic_page_slider3.png", relation: "Mentor" },
    ],
  },
};

function mapNormalizedRole(n: NormalizedCharacter): CharacterRole {
  const raw = (n.role || "").trim().toUpperCase().replace(/-/g, "_");
  if (raw === "HERO" || raw === "VILLAIN" || raw === "ANTI_HERO" || raw === "ENTITY") {
    return raw as CharacterRole;
  }
  switch (n.alignment) {
    case "hero":
      return "HERO";
    case "villain":
      return "VILLAIN";
    case "anti-hero":
      return "ANTI_HERO";
    case "entity":
      return "ENTITY";
    default:
      return "HERO";
  }
}

function popularityFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 50 + (h % 50);
}

function taglineFromNormalized(n: NormalizedCharacter): string {
  const d = n.description.trim();
  if (!d) return n.tags.slice(0, 3).join(" · ") || "Multiverse operative.";
  const sentence = d.split(/(?<=[.!?])\s/)[0];
  if (sentence && sentence.length <= 140) return sentence;
  return d.length > 120 ? `${d.slice(0, 117)}…` : d;
}

function booksToCharacterComics(books: CharacterBook[] | undefined): CharacterComic[] {
  if (!books?.length) return [];
  return books.map((b) => {
    const genre =
      b.category?.trim() ||
      (typeof b.tags === "string" ? b.tags.split(",")[0]?.trim() : "") ||
      "Comics";
    return {
      id: b.id,
      title: b.title,
      image: b.image_url,
      pdfUrl: b.pdf_url,
      author: b.author,
      category: b.category,
      tags: b.tags,
      bookType: b.book_type,
      price: b.discounted_price || b.original_price,
      originalPrice: b.original_price || undefined,
      stock: b.stock,
      issue: b.book_type,
      genre,
      status: b.stock > 0 ? `${b.stock} in stock` : "Out of stock",
      catalogComicId: undefined,
    };
  });
}

function mapRelatedFromApi(raw: unknown[] | undefined): RelatedEntity[] {
  if (!raw?.length) return [];
  return raw
    .map((item, i) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = typeof row.name === "string" ? row.name : typeof row.character_name === "string" ? row.character_name : "";
      const slugSource = typeof row.slug === "string" ? row.slug : name;
      if (!slugSource) return null;
      const image =
        typeof row.image === "string"
          ? row.image
          : typeof row.cover_image_url === "string"
            ? row.cover_image_url
            : "/comic_page_slider.png";
      const relation =
        typeof row.relation === "string" && row.relation.trim()
          ? row.relation
          : typeof row.type === "string" && row.type.trim()
            ? row.type
            : "Related";
      return {
        slug: characterNameToSlug(slugSource),
        name: name || `Related ${i + 1}`,
        image,
        relation,
      };
    })
    .filter((x): x is RelatedEntity => Boolean(x));
}

/** Build profile from API-backed character (public detail pages). */
export function buildCharacterDetailProfileFromApi(n: NormalizedCharacter): CharacterDetailProfile {
  const slug = characterNameToSlug(n.character_name);
  const role = mapNormalizedRole(n);
  const character: Character = {
    slug,
    name: n.character_name,
    universe: n.universe || "Multiverse",
    role,
    image: n.cover_image_url,
    tagline: taglineFromNormalized(n),
    bio: n.description,
    popularity: popularityFromId(n.id),
  };

  const [d1, d2] = defaultTitleLines(character);
  const scores =
    n.strength != null &&
    n.speed != null &&
    n.intelligence != null &&
    n.durability != null
      ? {
          strength: n.strength,
          speed: n.speed,
          intelligence: n.intelligence,
          durability: n.durability,
        }
      : hashScores(slug);

  const lore: LoreAccordionItem[] =
    n.lore_items && n.lore_items.length > 0
      ? n.lore_items.map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
        }))
      : defaultLore(character);

  const comics = booksToCharacterComics(n.books);

  return {
    character,
    universeBadge: (n.universe ?? character.universe).toUpperCase(),
    titleLine1: n.title_line1 ?? d1,
    titleLine2: n.title_line2 ?? d2,
    spotlightBody:
      n.spotlight_body ??
      (n.description.trim() ||
        `${character.tagline} Track dossiers and latest intercepts across ${character.universe}.`),
    firstAppearance: n.first_appearance || "—",
    creator: n.creator || "—",
    alignment: alignmentByRole[role],
    attributes: scores,
    lore,
    comics,
    related: mapRelatedFromApi(n.related_entities),
  };
}

/** Grid card model from API list/detail normalized row */
export function normalizedToGridCharacter(n: NormalizedCharacter): Character {
  const slug = characterNameToSlug(n.character_name);
  return {
    slug,
    name: n.character_name,
    universe: n.universe || "Multiverse",
    role: mapNormalizedRole(n),
    image: n.cover_image_url,
    tagline: taglineFromNormalized(n),
    bio: n.description,
    popularity: popularityFromId(n.id),
  };
}

export function buildCharacterDetailProfile(character: Character): CharacterDetailProfile {
  const ov = OVERRIDES[character.slug];
  const [d1, d2] = defaultTitleLines(character);
  const scores = hashScores(character.slug);

  const comics = ov?.comics ?? defaultComics(character);
  const related = ov?.related ?? pickRelated(character.slug, CHARACTERS);

  return {
    character,
    universeBadge: ov?.universeBadge ?? character.universe.toUpperCase(),
    titleLine1: ov?.titleLine1 ?? d1,
    titleLine2: ov?.titleLine2 ?? d2,
    spotlightBody:
      ov?.spotlightBody ??
      `${character.tagline} ${character.bio} Across ${character.universe}, their dossier is flagged for priority review—track their arc from first contact to latest intercepts.`,
    firstAppearance: ov?.firstAppearance ?? `${character.universe} Field Report #1`,
    creator: ov?.creator ?? "Multiverse Design Collective",
    alignment: ov?.alignment ?? alignmentByRole[character.role],
    attributes: ov?.attributes ?? scores,
    lore: ov?.lore ?? defaultLore(character),
    comics,
    related,
  };
}
