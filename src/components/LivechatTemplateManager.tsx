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
  FileText,
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

export default function LivechatTemplateManager({
  initialTemplates,
}: LivechatTemplateManagerProps) {
  const [templates, setTemplates] = useState<LivechatTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"favorite" | "usage" | "title" | "kodePk">("favorite");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LivechatTemplate | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Filter & Search Logic
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return templates
      .filter((t) => {
        if (onlyFavorites && !t.isFavorite) return false;
        if (!q) return true;
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesKodePk = t.kodePk.toLowerCase().includes(q);
        const matchesContent = t.content.toLowerCase().includes(q);
        const matchesTag = (t.categoryTag || "").toLowerCase().includes(q);
        return matchesTitle || matchesKodePk || matchesContent || matchesTag;
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
          return a.kodePk.localeCompare(b.kodePk);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [templates, searchQuery, onlyFavorites, sortBy]);

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

  // Handle Import from JSON
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        alert("Format file JSON tidak sesuai. Harus berupa list template.");
        return;
      }

      const res = await importLivechatTemplatesAction(parsed);
      if (res.success) {
        alert(`Berhasil mengimpor ${res.count} template! Halaman akan dimuat ulang.`);
        window.location.reload();
      } else {
        alert("Gagal mengimpor template: " + res.error);
      }
    } catch (err: any) {
      alert("File JSON tidak valid: " + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-16">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
                Template Livechat
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200">
                CS Workspace
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 mt-1 max-w-xl">
              Pusat template balasan cepat ke member. Cari berdasarkan Judul, Kode PK, atau isi pesan balasan.
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm shadow-sm active:scale-[0.98] transition-all"
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
            title="Impor template dari file JSON"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-pink-200/80 bg-white/80 hover:bg-pink-50 text-ink-700 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Upload size={15} className="text-pink-500" />
            <span className="hidden sm:inline">Restore</span>
          </button>
        </div>
      </div>

      {/* Sticky / Dedicated Search & Control Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-200/70 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Universal Search Input */}
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
              placeholder="Cari judul, Kode PK (misal: PK01), atau penggalan isi balasan... (Tekan '/' untuk fokus)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-xs sm:text-sm text-ink-900 placeholder:text-ink-300 transition-all"
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
                <option value="favorite">Prioritas Favorit</option>
                <option value="usage">Paling Sering Disalin</option>
                <option value="kodePk">Urut Kode PK (A-Z)</option>
                <option value="title">Urut Judul (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between text-xs text-ink-400 pt-1 border-t border-pink-100/50">
          <div>
            Menampilkan <span className="font-bold text-pink-600">{filteredTemplates.length}</span> dari {templates.length} template balasan
            {searchQuery && (
              <span className="ml-1 text-ink-500">
                untuk pencarian: <span className="italic font-medium">"{searchQuery}"</span>
              </span>
            )}
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-pink-600 hover:underline font-medium text-xs"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Template Grid (Strictly neat, proportionate & responsive) */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
          {filteredTemplates.map((template) => (
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
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/60 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl text-pink-500">
            <MessageSquare size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-900">
              {searchQuery
                ? "Tidak ada template yang cocok"
                : "Belum ada template balasan"}
            </h3>
            <p className="text-xs sm:text-sm text-ink-400 max-w-md mt-1">
              {searchQuery
                ? `Tidak ditemukan template dengan judul, kode PK, atau isi "${searchQuery}". Coba kata kunci lain.`
                : "Mulai tambahkan template pesan livechat pertama Anda agar respon ke member semakin cepat dan rapi."}
            </p>
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-xs transition-colors"
            >
              Hapus Pencarian
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingTemplate(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
            >
              <Plus size={16} />
              <span>Tambah Template Pertama</span>
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
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
