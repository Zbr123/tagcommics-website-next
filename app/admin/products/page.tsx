"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCharacters, addBookToCharacter, updateBook, deleteBook, type NormalizedCharacter } from "@/src/lib/characters-api";
import { useAuth } from "@/src/hooks/use-auth";

interface Product {
  id: number;
  book_id?: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  sold: string;
  image: string;
  category: string;
  tag: string;
  description?: string;
  stock?: number;
  isFlashSale?: boolean;
  isNewItem?: boolean;
  isEbook?: boolean;
  isPhysical?: boolean;
  ebookPdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Book-specific fields from API
  character_id?: string;
  character_name?: string;
  book_type?: "E-book" | "Physical" | "Sale" | "Flash Sale" | "New Item";
  discounted_price?: number;
  tags?: string;
  original_price?: number;
  image_url?: string;
  pdf_url?: string;
}

const CATEGORIES = ["Comics", "Manga", "Graphic Novels"];
const TAGS = ["BESTSELLER", "NEW", "HOT", "CLASSIC", "SALE", "NONE"];
const BOOK_TYPES = ["E-book", "Physical", "Sale", "Flash Sale", "New Item"];

export default function AdminProducts() {
  const { token: authToken, isLoaded } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [characters, setCharacters] = useState<NormalizedCharacter[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    author: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    sold: "0",
    image: "/comic-slider1.png",
    category: "Comics",
    tag: "NONE",
    description: "",
    stock: 0,
    isFlashSale: false,
    isNewItem: false,
    isEbook: false,
    isPhysical: false,
    ebookPdfUrl: "",
    book_type: "Physical",
    discounted_price: 0,
    tags: "",
    character_id: "",
  });

  const mapCharactersToProducts = (chars: NormalizedCharacter[]): Product[] => {
    const allBooks: Product[] = [];
    for (const char of chars) {
      if (!char.books || char.books.length === 0) continue;
      for (const book of char.books) {
        let tagsArray: string[] = [];
        if (book.tags) {
          if (typeof book.tags === "string") {
            tagsArray = book.tags.split(",").map((t) => t.trim()).filter((t) => t);
          } else if (Array.isArray(book.tags)) {
            tagsArray = book.tags;
          }
        }

        let tag = "NONE";
        if (book.book_type === "Flash Sale") tag = "SALE";
        else if (book.book_type === "New Item") tag = "NEW";

        allBooks.push({
          id: Number(String(book.id).replace(/-/g, "").slice(0, 9)) || Date.now(),
          book_id: String(book.id),
          title: book.title,
          author: book.author || "Unknown",
          price: Number(book.discounted_price) || 0,
          originalPrice: Number(book.original_price) || undefined,
          rating: book.review || 0,
          sold: "0",
          image: book.image_url || "/comic-slider1.png",
          category: book.category || "Comics",
          tag: tagsArray[0] || tag,
          stock: book.stock,
          isFlashSale: book.book_type === "Flash Sale",
          isNewItem: book.book_type === "New Item",
          isEbook: book.book_type === "E-book",
          isPhysical: book.book_type === "Physical",
          ebookPdfUrl: book.pdf_url || "",
          character_id: char.id,
          character_name: char.character_name,
          book_type: book.book_type,
          discounted_price: book.discounted_price,
          tags: typeof book.tags === "string" ? book.tags : (Array.isArray(book.tags) ? book.tags.join(", ") : ""),
          original_price: book.original_price,
          image_url: book.image_url,
          pdf_url: book.pdf_url,
        });
      }
    }
    return allBooks;
  };

  useEffect(() => {
    if (!isLoaded || !authToken) return;

    const loadCharacters = async () => {
      const data = await getCharacters();
      setCharacters(data);
      if (data.length > 0 && !selectedCharacterId) {
        setSelectedCharacterId(data[0].id);
      }

      setProducts(mapCharactersToProducts(data));
    };

    loadCharacters();
  }, [isLoaded, authToken, selectedCharacterId]);

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      if (product.character_id) setSelectedCharacterId(product.character_id);
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        author: "",
        price: 0,
        originalPrice: 0,
        discount: 0,
        rating: 0,
        sold: "0",
        image: "/comic-slider1.png",
        category: "Comics",
        tag: "NONE",
        description: "",
        stock: 0,
        isFlashSale: false,
        isNewItem: false,
        isEbook: false,
        isPhysical: false,
        ebookPdfUrl: "",
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    setFormData({
      title: "",
      author: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      rating: 0,
      sold: "0",
      image: "/comic-slider1.png",
      category: "Comics",
      tag: "NONE",
      description: "",
      stock: 0,
      isFlashSale: false,
      isNewItem: false,
      isEbook: false,
      isPhysical: false,
      ebookPdfUrl: "",
      book_type: "Physical",
      discounted_price: 0,
      tags: "",
      character_id: selectedCharacterId || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!selectedCharacterId) {
      alert("Please select a character");
      return;
    }

    if (formData.isEbook && !formData.ebookPdfUrl) {
      alert("Please select a PDF file for the E-book.");
      return;
    }

    // Determine book type based on form state
    let bookType: "E-book" | "Physical" | "Sale" | "Flash Sale" | "New Item" = "Physical";
    if (formData.isFlashSale) bookType = "Flash Sale";
    else if (formData.isNewItem) bookType = "New Item";
    else if (formData.isEbook) bookType = "E-book";

    const payload = {
      title: formData.title || "",
      author: formData.author,
      category: formData.category,
      original_price: formData.originalPrice,
      discounted_price: formData.price,
      stock: formData.stock,
      tags: formData.tags,
      book_type: bookType,
      review: formData.rating,
      image: imageInputRef.current?.files?.[0],
      pdf_file: pdfInputRef.current?.files?.[0],
    };

    // Add or update book based on edit mode
    const result = editingProduct?.book_id
      ? await updateBook(selectedCharacterId, editingProduct.book_id, payload)
      : await addBookToCharacter(selectedCharacterId, payload);

    if (result.success) {
      // Reload books from API to get fresh data
      const chars = await getCharacters();
      setCharacters(chars);

      setProducts(mapCharactersToProducts(chars));

      handleCloseForm();
    } else {
      alert(result.error || "Failed to save book");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    // Delete using backend identifiers (character UUID + book UUID)
    if (product.character_id && product.book_id) {
      await deleteBook(product.character_id, product.book_id);
    }

    // Reload from API after delete
    const chars = await getCharacters();
    setCharacters(chars);

    setProducts(mapCharactersToProducts(chars));
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    const matchesTag = filterTag === "All" || product.tag === filterTag;
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Products</h1>
          <p className="text-gray-400">Manage your comic book inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-brand to-brand-400 hover:from-brand-400 hover:to-brand text-brand-foreground font-bold py-3 px-6 rounded-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Tag</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="All">All Tags</option>
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Character</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-400">No products found. Add your first product!</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product.book_id ?? product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="text-white font-semibold">{product.title}</p>
                          <p className="text-gray-400 text-sm">{product.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{product.character_name || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-xs line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white text-sm">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isFlashSale && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                            Flash Sale
                          </span>
                        )}
                        {product.isNewItem && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                            New
                          </span>
                        )}
                        {product.tag !== "NONE" && (
                          <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded">
                            {product.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenForm(product)}
                          className="p-2 text-brand hover:text-brand-400 hover:bg-brand/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
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

      {/* Product Count */}
      <div className="text-center text-gray-400 text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Add/Edit Product Form Modal */}
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Character Selection */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Character *
                      </label>
                      <select
                        required
                        value={selectedCharacterId}
                        onChange={(e) => {
                          setSelectedCharacterId(e.target.value);
                          setFormData({ ...formData, character_id: e.target.value });
                        }}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
                      >
                        <option value="">Select a character</option>
                        {characters.map((char) => (
                          <option key={char.id} value={char.id}>
                            {char.character_name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Link this book to a character. Characters are managed in the Characters section.
                      </p>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="Product title"
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="Author name"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: parseFloat(e.target.value) || undefined,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Discounted Price (selling price) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Discounted Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        min="0"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                        placeholder="0"
                      />
                    </div>

                    {/* Tag */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Tag
                      </label>
                      <select
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand cursor-pointer"
                      >
                        {TAGS.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Image (file upload) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Product Image
                      </label>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setFormData({ ...formData, image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand file:text-brand-foreground file:font-semibold file:cursor-pointer focus:outline-none focus:border-brand"
                      />
                      {formData.image && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Preview</p>
                          <img
                            src={formData.image}
                            alt="Product preview"
                            className="h-24 w-24 object-cover rounded-lg border border-gray-700"
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
                        placeholder="Product description..."
                      />
                    </div>

                    {/* Book type: E-book / Physical */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Book type
                      </label>
                      <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isEbook || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isEbook: e.target.checked,
                                ...(e.target.checked ? {} : { ebookPdfUrl: "" }),
                              })
                            }
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-brand focus:ring-brand"
                          />
                          <span className="text-white font-semibold">E-book</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isPhysical || false}
                            onChange={(e) =>
                              setFormData({ ...formData, isPhysical: e.target.checked })
                            }
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-brand focus:ring-brand"
                          />
                          <span className="text-white font-semibold">Physical / Hard book</span>
                        </label>
                      </div>
                      {formData.isEbook && (
                        <div className="pt-2">
                          <label className="block text-sm font-semibold text-gray-400 mb-2">
                            E-book PDF file *
                          </label>
                          <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () =>
                                  setFormData({
                                    ...formData,
                                    ebookPdfUrl: reader.result as string,
                                  });
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand file:text-brand-foreground file:font-semibold file:cursor-pointer focus:outline-none focus:border-brand"
                          />
                          {formData.ebookPdfUrl && (
                            <p className="mt-2 text-xs text-green-400">PDF file selected</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Sale / Promo
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isFlashSale || false}
                            onChange={(e) =>
                              setFormData({ ...formData, isFlashSale: e.target.checked })
                            }
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-brand focus:ring-brand"
                          />
                          <span className="text-white font-semibold">Flash Sale</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isNewItem || false}
                            onChange={(e) =>
                              setFormData({ ...formData, isNewItem: e.target.checked })
                            }
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-brand focus:ring-brand"
                          />
                          <span className="text-white font-semibold">New Item</span>
                        </label>
                      </div>
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
                      className="px-6 py-3 bg-gradient-to-r from-brand to-brand-400 hover:from-brand-400 hover:to-brand text-brand-foreground font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {editingProduct ? "Update Product" : "Add Product"}
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
