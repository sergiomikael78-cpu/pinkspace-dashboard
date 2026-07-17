"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/config/categories";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  iconEmoji: string;
  fileUrl?: string;
}

interface SearchPaletteProps {
  resources: SearchResult[];
}

export default function SearchPalette({ resources }: SearchPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      )
    : resources.slice(0, 6);

  // Keyboard shortcut: Cmd+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        window.location.href = `/resources/${filtered[selectedIndex].categorySlug}#${filtered[selectedIndex].id}`;
        setIsOpen(false);
      }
    },
    [filtered, selectedIndex]
  );

  const getCategoryName = (slug: string) => {
    return CATEGORIES.find((c) => c.slug === slug)?.displayName || slug;
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-ink-300 transition-all duration-150 hover:text-ink-500 w-full max-w-md"
        style={{
          background: "rgba(255, 255, 255, 0.6)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search resources...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-pink-50 text-ink-300 rounded border border-pink-100">
          ⌘K
        </kbd>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  boxShadow:
                    "0 25px 60px rgba(136, 60, 93, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-100/50">
                  <Search size={20} className="text-pink-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search resources, extensions, scripts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyNav}
                    className="flex-1 bg-transparent outline-none text-ink-900 placeholder:text-ink-300 text-sm"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <X size={16} className="text-ink-300" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto py-2 px-2">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-ink-300">
                      <Sparkles size={32} className="mb-2 text-pink-300" />
                      <p className="text-sm">No resources found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    <>
                      {!query && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-300">
                          <Clock size={12} />
                          <span>Recent Resources</span>
                        </div>
                      )}
                      {filtered.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            window.location.href = `/resources/${result.categorySlug}#${result.id}`;
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors ${
                            selectedIndex === index
                              ? "bg-pink-500/10"
                              : "hover:bg-pink-50"
                          }`}
                        >
                          <span className="text-lg flex-shrink-0">{result.iconEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-900 truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-ink-300 truncate">
                              {getCategoryName(result.categorySlug)}
                            </p>
                          </div>
                          {selectedIndex === index && (
                            <ArrowRight size={14} className="text-pink-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-pink-100/50 px-4 py-2.5 flex items-center gap-4 text-[11px] text-ink-300">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-pink-50 rounded text-[10px]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-pink-50 rounded text-[10px]">↵</kbd>
                    Open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-pink-50 rounded text-[10px]">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
