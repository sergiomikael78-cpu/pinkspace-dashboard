"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Keyboard, Tag, Star, Check } from "lucide-react";
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

const CATEGORY_OPTIONS = [
  "Umum",
  "Deposit",
  "Withdraw",
  "Akun & Login",
  "Bank & Kendala",
  "Motivasi & JP",
  "Promo & Event",
];

export default function LivechatTemplateModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LivechatTemplateModalProps) {
  const [kodePk, setKodePk] = useState("");
  const [content, setContent] = useState("");
  const [categoryTag, setCategoryTag] = useState("Umum");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setKodePk(initialData.kodePk);
      setContent(initialData.content);
      setCategoryTag(initialData.categoryTag || "Umum");
      setIsFavorite(Boolean(initialData.isFavorite));
    } else {
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
    if (!kodePk.trim()) {
      setErrorMessage("Kode PK / Trigger Shortcut wajib diisi!");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Isi template kalimat balasan tidak boleh kosong!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await onSave({
        id: initialData ? initialData.id : undefined,
        title: kodePk.trim(),
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
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50/80 to-rose-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Keyboard size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900">
                {initialData ? "Edit Template Livechat" : "Tambah Template Livechat"}
              </h2>
              <p className="text-xs text-ink-500">
                Fokus pada Kode PK / Trigger & Kalimat Balasan CS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-pink-100/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Kode PK / Trigger Input */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Kode PK / Trigger Shortcut <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={kodePk}
                onChange={(e) => setKodePk(e.target.value)}
                placeholder="Contoh: CTRL+num1, /daftar, /jp, 7h, PK-01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/90 bg-white/90 text-sm font-mono font-bold text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 placeholder:text-ink-300 placeholder:font-normal placeholder:font-sans transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-ink-400 mt-1">
              Shortcut keyboard dari Perfect Keyboard atau kode cepat CS.
            </p>
          </div>

          {/* Kategori Tag */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Kategori / Tag Balasan
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCategoryTag(opt)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    categoryTag === opt
                      ? "bg-pink-500 text-white border-pink-500 shadow-2xs"
                      : "bg-pink-50/60 text-ink-600 border-pink-200/80 hover:bg-pink-100/60"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Template Content Box */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Template Kalimat Balasan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ketik kalimat balasan lengkap yang akan disalin oleh CS..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/90 bg-white/90 text-xs sm:text-sm text-ink-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 placeholder:text-ink-300 transition-all resize-y scrollbar-thin scrollbar-thumb-pink-200"
              required
            />
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-pink-300 rounded cursor-pointer"
              />
              <span className="text-xs font-medium text-ink-700 flex items-center gap-1">
                <Star size={13} className={isFavorite ? "text-amber-500 fill-amber-500" : "text-ink-400"} />
                Tandai sebagai template favorit
              </span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-600 hover:bg-pink-50 border border-transparent transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-xs active:scale-[0.98] transition-all disabled:opacity-60"
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
