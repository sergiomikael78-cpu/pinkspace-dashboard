"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  Sparkles,
  Download,
  Upload,
  X,
  Star,
  SlidersHorizontal,
  FileCode,
  Tag,
  ChevronDown,
  Layers,
} from "lucide-react";
import { type LivechatTemplate } from "@/lib/schema";
import LivechatTemplateCard from "./LivechatTemplateCard";
import LivechatTemplateModal from "./LivechatTemplateModal";
import {
  createLivechatTemplateAction,
  updateLivechatTemplateAction,
  deleteLivechatTemplateAction,
  importLivechatTemplatesAction,
} from "@/app/actions/livechat-templates";

interface LivechatTemplateManagerProps {
  initialTemplates: LivechatTemplate[];
}

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "Deposit", label: "Deposit" },
  { id: "Akun & Login", label: "Akun & Login" },
  { id: "Withdraw", label: "Withdraw" },
  { id: "Bank & Kendala", label: "Bank & Kendala" },
  { id: "Motivasi & JP", label: "Motivasi & JP" },
  { id: "Promo & Event", label: "Promo & Event" },
  { id: "Umum", label: "Umum" },
];

const INITIAL_PAGE_SIZE = 36;
const PAGE_INCREMENT = 36;

export default function LivechatTemplateManager({
  initialTemplates,
}: LivechatTemplateManagerProps) {
  const [templates, setTemplates] = useState<LivechatTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"favorite" | "kodePk" | "usage">("kodePk");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LivechatTemplate | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset pagination on filter/search change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [searchQuery, selectedCategory, onlyFavorites, sortBy]);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: templates.length };
    for (const t of templates) {
      const tag = t.categoryTag || "Umum";
      counts[tag] = (counts[tag] || 0) + 1;
    }
    return counts;
  }, [templates]);

  // Filter & Search Logic
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return templates
      .filter((t) => {
        if (onlyFavorites && !t.isFavorite) return false;
        if (selectedCategory !== "all" && (t.categoryTag || "Umum") !== selectedCategory) {
          return false;
        }
        if (!q) return true;
        const matchesKodePk = (t.kodePk || "").toLowerCase().includes(q);
        const matchesContent = (t.content || "").toLowerCase().includes(q);
        const matchesTag = (t.categoryTag || "").toLowerCase().includes(q);
        return matchesKodePk || matchesContent || matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "favorite") {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return (b.usageCount || 0) - (a.usageCount || 0);
        }
        if (sortBy === "usage") {
          return (b.usageCount || 0) - (a.usageCount || 0);
        }
        if (sortBy === "kodePk") {
          return (a.kodePk || "").localeCompare(b.kodePk || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        return 0;
      });
  }, [templates, searchQuery, selectedCategory, onlyFavorites, sortBy]);

  // Visible sliced templates for high-performance rendering
  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  // Handle Save (Create / Update)
  const handleSaveTemplate = async (data: {
    id?: string;
    title: string;
    kodePk: string;
    content: string;
    categoryTag: string;
    isFavorite: boolean;
  }) => {
    if (data.id) {
      // Update
      const res = await updateLivechatTemplateAction(data.id, data);
      if (!res.success) throw new Error(res.error);

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === data.id
            ? {
                ...t,
                title: data.title,
                kodePk: data.kodePk,
                content: data.content,
                categoryTag: data.categoryTag,
                isFavorite: data.isFavorite,
                updatedAt: new Date(),
              }
            : t
        )
      );
    } else {
      // Create
      const res = await createLivechatTemplateAction(data);
      if (!res.success) throw new Error(res.error);

      const newTemplate: LivechatTemplate = {
        id: res.id || "lt-" + Date.now(),
        workspaceId: "default-workspace",
        title: data.title,
        kodePk: data.kodePk,
        content: data.content,
        categoryTag: data.categoryTag,
        isFavorite: data.isFavorite,
        usageCount: 0,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTemplates((prev) => [newTemplate, ...prev]);
    }
  };

  // Handle Delete
  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus template balasan ini?")) {
      return;
    }

    const res = await deleteLivechatTemplateAction(id);
    if (res.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert("Gagal menghapus template: " + res.error);
    }
  };

  // Handle Export to JSON
  const handleExportJSON = () => {
    const exportData = templates.map(({ title, kodePk, content, categoryTag }) => ({
      title,
      kodePk,
      content,
      categoryTag,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pinkspace-template-livechat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import from XML / JSON
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let parsedList: Array<{ title: string; kodePk: string; content: string; categoryTag: string }> = [];

      if (file.name.endsWith(".xml")) {
        // Parse Perfect Keyboard XML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/xml");
        const macroElements = doc.querySelectorAll("macro");

        macroElements.forEach((m, idx) => {
          const rawText = m.querySelector("macroText")?.textContent || "";
          if (!rawText.trim()) return;

          let cleanedText = rawText
            .replace(/<BR\s*\/?>/gi, "\n")
            .replace(/<\/P>/gi, "\n")
            .replace(/<\/DIV>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/^text#macro:/i, "")
            .replace(/<ent__>/gi, "\n")
            .replace(/<enter>/gi, "\n")
            .replace(/<space>/gi, " ")
            .replace(/<wx>/gi, "")
            .replace(/<#>/gi, "")
            .trim();

          let tscut = m.querySelector("tscut")?.textContent?.trim() || "";
          if (!tscut) {
            const trigger = m.querySelector("trigger");
            const hk = trigger?.getAttribute("hk");
            if (hk && hk !== "0") {
              tscut = `HK-${hk}`;
            } else {
              tscut = `PK-${idx + 1}`;
            }
          }

          parsedList.push({
            title: tscut,
            kodePk: tscut,
            content: cleanedText,
            categoryTag: "Umum",
          });
        });
      } else {
        parsedList = JSON.parse(text);
      }

      if (!Array.isArray(parsedList) || parsedList.length === 0) {
        alert("Tidak ada template valid yang dapat diimpor dari file tersebut.");
        return;
      }

      const res = await importLivechatTemplatesAction(parsedList);
      if (res.success) {
        alert(`Berhasil mengimpor ${res.count} template! Halaman akan dimuat ulang.`);
        window.location.reload();
      } else {
        alert("Gagal mengimpor template: " + res.error);
      }
    } catch (err: any) {
      alert("Format file tidak valid: " + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-16">
      {/* Hidden File Input for XML / JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json,.xml"
        className="hidden"
      />

      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-pink-200/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-sm flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF6FB5 0%, #FDA4AF 100%)",
            }}
          >
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
                Template Livechat
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                {templates.length} Template
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 mt-1 max-w-xl">
              Sinkronisasi penuh Perfect Keyboard. Cari cepat berdasarkan <strong>Kode PK / Shortcut</strong> atau <strong>potongan kalimat</strong>, lalu salin dengan 1-klik!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-xs active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            <span>Tambah Template</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            title="Ekspor template ke JSON sebagai cadangan"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-pink-200/80 bg-white/80 hover:bg-pink-50 text-ink-700 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Download size={15} className="text-pink-500" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Impor template dari file XML Perfect Keyboard atau JSON"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-pink-200/80 bg-white/80 hover:bg-pink-50 text-ink-700 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Upload size={15} className="text-pink-500" />
            <span className="hidden sm:inline">Import PK</span>
          </button>
        </div>
      </div>

      {/* Sticky / Dedicated Search & Control Bar */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-pink-200/80 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Kode PK (contoh: num1, /jp, 7h) atau penggalan isi balasan... (Tekan '/' untuk fokus)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-xs sm:text-sm text-ink-900 placeholder:text-ink-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            {/* Toggle Favorit */}
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyFavorites
                  ? "bg-amber-50 border-amber-300 text-amber-700 shadow-xs"
                  : "bg-white border-pink-200 text-ink-600 hover:bg-pink-50"
              }`}
            >
              <Star
                size={14}
                fill={onlyFavorites ? "currentColor" : "none"}
                className={onlyFavorites ? "text-amber-500" : "text-ink-400"}
              />
              <span>Favorit Saja</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan template"
                className="px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-pink-400/50 cursor-pointer"
              >
                <option value="kodePk">Urut Kode PK (A-Z)</option>
                <option value="favorite">Prioritas Favorit</option>
                <option value="usage">Paling Sering Disalin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? "bg-pink-600 text-white shadow-2xs"
                    : "bg-pink-50/70 text-ink-600 hover:bg-pink-100/70 border border-pink-200/60"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-pink-200/50 text-pink-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between text-xs text-ink-400 pt-1 border-t border-pink-100/60">
          <div>
            Menampilkan <span className="font-bold text-pink-600">{Math.min(visibleCount, filteredTemplates.length)}</span> dari {filteredTemplates.length} template yang cocok
            {searchQuery && (
              <span className="ml-1 text-ink-500">
                untuk pencarian: <span className="italic font-medium text-pink-600">"{searchQuery}"</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-ink-400 hidden sm:block">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-pink-100/80 font-mono text-[10px] text-pink-700">/</kbd> untuk cari cepat
          </div>
        </div>
      </div>

      {/* Templates Grid Display */}
      {filteredTemplates.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {visibleTemplates.map((template) => (
              <LivechatTemplateCard
                key={template.id}
                template={template}
                onEdit={(t) => {
                  setEditingTemplate(t);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>

          {/* Load More Button for progressive pagination */}
          {visibleCount < filteredTemplates.length && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_INCREMENT)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 text-pink-600 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                <ChevronDown size={16} />
                <span>
                  Muat Lebih Banyak (+{Math.min(PAGE_INCREMENT, filteredTemplates.length - visibleCount)} template)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVisibleCount(filteredTemplates.length)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-ink-500 hover:text-ink-800 hover:bg-pink-50/50 transition-colors"
              >
                Tampilkan Semua ({filteredTemplates.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/60 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-pink-100/80 flex items-center justify-center text-pink-500 text-2xl mb-4">
            🔍
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
            Tidak ada template yang cocok
          </h3>
          <p className="text-xs sm:text-sm text-ink-500 max-w-md mb-5">
            {searchQuery
              ? `Tidak ditemukan template dengan kata kunci "${searchQuery}". Coba gunakan kata kunci Kode PK atau topik lainnya.`
              : "Belum ada template di kategori ini."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Add / Edit Template Modal */}
      <LivechatTemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        initialData={editingTemplate}
      />
    </div>
  );
}
