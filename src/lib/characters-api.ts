const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const DEBUG = true;

function log(...args: unknown[]) {
  if (DEBUG) console.log("[characters-api]", ...args);
}

function getApiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveUrl(path: string | undefined | null): string {
  if (!path) return "/comic_page_slider.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // If it's just a filename (no slashes), it's stored on the backend at /uploads/characters/
  // Full URL format: http://localhost:5000/api/v1/uploads/characters/{filename}
  if (!path.startsWith("/")) {
    return `${BASE_URL}/uploads/characters/${path}`;
  }

  // For other / paths, return as-is
  return path;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("comics-auth");
  console.log("[characters-api] localStorage comics-auth:", stored);
  if (!stored) return null;
  try {
    const data = JSON.parse(stored);
    console.log("[characters-api] parsed data:", data);
    console.log("[characters-api] token:", data.token);
    return data.token || null;
  } catch (e) {
    console.log("[characters-api] parse error:", e);
    return null;
  }
}

// ============================================
// Types
// ============================================

export type CharacterAlignment = "hero" | "villain" | "anti-hero" | "entity";

export interface Character {
  id?: string;
  character_id?: string;
  character_name: string;
  description: string;
  tags: string[] | string;
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image_url: string;
  [key: string]: unknown; // Allow additional fields from API
}

export interface CharacterListResponse {
  status: number;
  message?: string;
  data: Character[];
}

export interface CharacterDetailResponse {
  status: number;
  message?: string;
  data: Character;
}

// ============================================
// API Functions
// ============================================

export async function getCharacters(): Promise<Character[]> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    log(`Fetching characters from: ${getApiUrl("/characters")}`);
    const res = await fetch(getApiUrl("/characters"), { headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    log("Characters response:", data);

    if (data.data && Array.isArray(data.data)) {
      return data.data.map((c: Character) => {
        // Ensure tags is always an array - backend may return comma-separated string
        let tagsArray: string[] = [];
        if (c.tags) {
          if (typeof c.tags === "string" && c.tags) {
            tagsArray = c.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t);
          } else if (Array.isArray(c.tags)) {
            tagsArray = c.tags as string[];
          }
        }
        const resolvedImageUrl = resolveUrl(c.cover_image_url);
        log(`Character ${c.character_name}: original URL=${c.cover_image_url}, resolved URL=${resolvedImageUrl}`);
        return {
          id: c.character_id, // Map API's character_id to our id field
          character_name: c.character_name,
          description: c.description,
          tags: tagsArray,
          first_appearance: c.first_appearance || "",
          creator: c.creator,
          alignment: c.alignment,
          cover_image_url: resolvedImageUrl,
        };
      });
    }
    return [];
  } catch (err) {
    log("getCharacters failed:", err);
    return [];
  }
}

export interface CreateCharacterPayload {
  character_name: string;
  description: string;
  tags: string;
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image?: File;
}

export async function createCharacter(
  payload: CreateCharacterPayload
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log("Creating character:", payload.character_name);

    const formData = new FormData();
    formData.append("character_name", payload.character_name);
    formData.append("description", payload.description);
    formData.append("tags", payload.tags);
    formData.append("first_appearance", payload.first_appearance);
    formData.append("creator", payload.creator);
    formData.append("alignment", payload.alignment);
    if (payload.cover_image) {
      formData.append("cover_image", payload.cover_image);
    }

    const res = await fetch(getApiUrl("/characters"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    log("Character created:", data);
    return { success: true };
  } catch (err) {
    log("createCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function deleteCharacter(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, error: "No authentication token" };
  }

  try {
    log(`Deleting character: ${id}`);
    const res = await fetch(getApiUrl(`/characters/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      log(`API Error ${res.status}:`, error);
      return { success: false, error: error.message || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    log("deleteCharacter failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}