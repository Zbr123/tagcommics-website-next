"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCharacters, createCharacter, deleteCharacter, type Character, type CharacterAlignment } from "@/src/lib/characters-api";
import { useAuth } from "@/src/hooks/use-auth";

console.log("[AdminCharacters] Module loaded");

const ALIGNMENTS: { value: CharacterAlignment; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "villain", label: "Villain" },
  { value: "anti-hero", label: "Anti-Hero" },
  { value: "entity", label: "Entity" },
];

const ALIGNMENT_COLORS: Record<CharacterAlignment, string> = {
  "hero": "bg-green-500/20 text-green-400 border-green-500/30",
  "villain": "bg-red-500/20 text-red-400 border-red-500/30",
  "anti-hero": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "entity": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

interface FormData {
  character_name: string;
  description: string;
  tags: string;
  first_appearance: string;
  creator: string;
  alignment: CharacterAlignment;
  cover_image: File | null;
  cover_image_preview: string;
}

const EMPTY_FORM: FormData = {
  character_name: "",
  description: "",
  tags: "",
  first_appearance: "",
  creator: "",
  alignment: "hero",
  cover_image: null,
  cover_image_preview: "",
};

export default function AdminCharacters() {
  const { token: authToken, isLoaded } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAlignment, setFilterAlignment] = useState<string>("All");
  const imageInputRef = useRef<HTMLInputElement>(null);

  console.log("[AdminCharacters] authToken:", authToken, "isLoaded:", isLoaded);

  const loadCharacters = useCallback(async () => {
    setLoading(true);
    console.log("[AdminCharacters] Calling getCharacters...");
    const data = await getCharacters();
    console.log("[AdminCharacters] getCharacters returned:", data.length, "characters");
    setLoading(false);
    if (data.length > 0) {
      setCharacters(data);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !authToken) {
      console.log("[AdminCharacters] Not authenticated, redirecting to login");
      window.location.href = "/login?redirect=/admin/characters";
    }
  }, [isLoaded, authToken]);

  useEffect(() => {
    if (isLoaded && authToken) {
      console.log("[AdminCharacters] Auth loaded, loading characters");
      loadCharacters();
    }
  }, [isLoaded, authToken, loadCharacters]);

  const handleOpenForm = () => {
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(EMPTY_FORM);
    setFormError(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          cover_image: file,
          cover_image_preview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    console.log("[AdminCharacters] Submit - token:", authToken);

    if (!formData.character_name.trim()) {
      setFormError("Character name is required");
      return;
    }
    if (!formData.creator.trim()) {
      setFormError("Creator is required");
      return;
    }

    setIsSubmitting(true);

    console.log("[AdminCharacters] Calling createCharacter...");
    const result = await createCharacter({
      character_name: formData.character_name,
      description: formData.description,
      tags: formData.tags,
      first_appearance: formData.first_appearance,
      creator: formData.creator,
      alignment: formData.alignment,
      cover_image: formData.cover_image || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      handleCloseForm();
      loadCharacters();
    } else {
      console.log("[AdminCharacters] createCharacter failed:", result.error);
      setFormError(result.error || "Failed to create character");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    const result = await deleteCharacter(id);
    if (result.success) {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(result.error || "Failed to delete character");
    }
  };

  const filteredCharacters = characters.filter((char) => {
    const matchesSearch =
      char.character_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (() => {
        const tags = Array.isArray(char.tags)
          ? char.tags
          : typeof char.tags === "string"
            ? char.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t)
            : [];
        return tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      })();

    const matchesAlignment =
      filterAlignment === "All" || char.alignment === filterAlignment;

    return matchesSearch && matchesAlignment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Characters</h1>
          <p className="text-gray-400">Manage comic characters</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenForm}
          className="bg-gradient-to-r from-brand to-brand-400 hover:from-brand-400 hover:to-brand text-brand-foreground font-bold py-3 px-6 rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Character
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, creator, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Alignment</label>
            <select
              value={filterAlignment}
              onChange={(e) => setFilterAlignment(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="All">All Alignments</option>
              {ALIGNMENTS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Characters List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Character</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Creator</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Alignment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">First Appearance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading && characters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-10 h-10 text-brand animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-400">Loading characters…</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCharacters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-400">
                      {characters.length === 0
                        ? "No characters yet. Add your first character!"
                        : "No characters match your search."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCharacters.map((character) => (
                  <motion.tr
                    key={character.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={character.cover_image_url}
                          alt={character.character_name}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="text-white font-semibold">{character.character_name}</p>
                          {/* Tags helper - normalize to array */}
                          {(() => {
                            const tags = Array.isArray(character.tags)
                              ? character.tags
                              : typeof character.tags === "string"
                                ? character.tags.split(",").map(t => t.trim()).filter(t => t)
                                : [];
                            return tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-brand/10 text-brand text-xs rounded border border-brand/20"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {tags.length > 3 && (
                                  <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                                    +{tags.length - 3}
                                  </span>
                                )}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-gray-300 text-sm">{character.creator}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${ALIGNMENT_COLORS[character.alignment]}`}>
                        {character.alignment.charAt(0).toUpperCase() + character.alignment.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-gray-300 text-sm">{character.first_appearance || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => character.id && handleDelete(character.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Character Count */}
      {!loading && characters.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredCharacters.length} of {characters.length} characters
        </div>
      )}

      {/* Add Character Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm cursor-pointer"
              onClick={handleCloseForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">Add Character</h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {formError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Character Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Character Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.character_name}
                        onChange={(e) => setFormData({ ...formData, character_name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="Enter character name"
                      />
                    </div>

                    {/* Creator */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Creator *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.creator}
                        onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="Creator name"
                      />
                    </div>

                    {/* Alignment */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Alignment *
                      </label>
                      <select
                        required
                        value={formData.alignment}
                        onChange={(e) => setFormData({ ...formData, alignment: e.target.value as CharacterAlignment })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
                      >
                        {ALIGNMENTS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* First Appearance */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        First Appearance
                      </label>
                      <input
                        type="text"
                        value={formData.first_appearance}
                        onChange={(e) => setFormData({ ...formData, first_appearance: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="e.g., Comic Name #1 (2020)"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="Comma-separated: hero, mutant, omega"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand resize-none"
                        placeholder="Character description..."
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Cover Image
                      </label>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand file:text-brand-foreground file:font-semibold file:cursor-pointer focus:outline-none focus:border-brand"
                      />
                      {formData.cover_image_preview && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Preview</p>
                          <img
                            src={formData.cover_image_preview}
                            alt="Cover preview"
                            className="h-32 w-auto object-cover rounded-lg border border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-brand to-brand-400 hover:from-brand-400 hover:to-brand text-brand-foreground font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Add Character"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}