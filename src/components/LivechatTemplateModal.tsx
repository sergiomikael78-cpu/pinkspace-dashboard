"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, MessageSquare, Tag, KeyRound, Check } from "lucide-react";
import { type LivechatTemplate } from "@/lib/schema";

interface LivechatTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    kodePk: string;
    content: string;
    categoryTag: string;
    isFavorite: boolean;
  }) => Promise<void>;
  initialData?: LivechatTemplate | null;
}

export default function LivechatTemplateModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LivechatTemplateModalProps) {
  const [title, setTitle] = useState("");
  const [kodePk, setKodePk] = useState("");
  const [content, setContent] = useState("");
  const [categoryTag, setCategoryTag] = useState("Umum");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setKodePk(initialData.kodePk);
      setContent(initialData.content);
      setCategoryTag(initialData.categoryTag || "Umum");
      setIsFavorite(Boolean(initialData.isFavorite));
    } else {
      setTitle("");
      setKodePk("");
      setContent("");
      setCategoryTag("Umum");
      setIsFavorite(false);
    }
    setErrorMessage("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Judul template wajib diisi!");
      return;
    }
    if (!kodePk.trim()) {
      setErrorMessage("Kode PK wajib diisi!");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Isi template balasan tidak boleh kosong!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await onSave({
        id: initialData ? initialData.id : undefined,
        title: title.trim(),
        kodePk: kodePk.trim(),
        content: content.trim(),
        categoryTag: categoryTag.trim() || "Umum",
        isFavorite,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat menyimpan template.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-pink-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header bar with gradient */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <MessageSquare size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900">
                {initialData ? "Edit Template Livechat" : "Tambah Template Livechat"}
              </h2>
              <p className="text-xs text-ink-500">
                Lengkapi judul, kode PK, dan isi balasan pesan ke member.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-pink-100/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Judul Input */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-ink-700 flex items-center gap-1.5">
                <span>Judul Template</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Salam Pembuka, Format Reset Pin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 bg-white text-sm text-ink-900 placeholder:text-ink-300"
                required
              />
            </div>

            {/* Kode PK Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-700 flex items-center gap-1.5">
                <KeyRound size={13} className="text-pink-500" />
                <span>Kode PK</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={kodePk}
                onChange={(e) => setKodePk(e.target.value)}
                placeholder="Contoh: PK01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 bg-white font-mono font-medium text-sm text-ink-900 placeholder:text-ink-300"
                required
              />
            </div>
          </div>

          {/* Kategori/Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-700 flex items-center gap-1.5">
              <Tag size={13} className="text-pink-500" />
              <span>Label Kategori / Tag (Opsional)</span>
            </label>
            <input
              type="text"
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              placeholder="Contoh: Deposit, Withdraw, Akun, Umum"
              className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 bg-white text-sm text-ink-900 placeholder:text-ink-300"
            />
          </div>

          {/* Template Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink-700 flex items-center gap-1.5">
                <span>Isi Template Balasan</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-ink-400">{content.length} karakter</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan format balasan livechat ke member di sini... (tekan enter untuk baris baru)"
              rows={5}
              className="w-full px-3.5 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 bg-white text-sm text-ink-800 leading-relaxed placeholder:text-ink-300 resize-y"
              required
            />
          </div>

          {/* Favorite toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFavorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-400"
            />
            <label htmlFor="isFavorite" className="text-xs font-medium text-ink-600 cursor-pointer">
              Sematkan sebagai template Favorit (muncul di urutan teratas)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-pink-200 text-ink-600 text-xs sm:text-sm font-medium hover:bg-pink-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{initialData ? "Simpan Perubahan" : "Tambahkan Template"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
