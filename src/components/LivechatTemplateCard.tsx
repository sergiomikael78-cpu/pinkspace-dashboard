"use client";

import { useState } from "react";
import { Copy, Check, Star, Edit3, Trash2, Tag, Keyboard, Sparkles } from "lucide-react";
import { type LivechatTemplate } from "@/lib/schema";
import { incrementCopyCountAction, toggleFavoriteLivechatTemplateAction } from "@/app/actions/livechat-templates";

interface LivechatTemplateCardProps {
  template: LivechatTemplate;
  onEdit: (template: LivechatTemplate) => void;
  onDelete: (id: string) => void;
}

export default function LivechatTemplateCard({
  template,
  onEdit,
  onDelete,
}: LivechatTemplateCardProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(template.isFavorite));
  const [usageCount, setUsageCount] = useState(template.usageCount || 0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      setUsageCount((prev) => prev + 1);
      incrementCopyCountAction(template.id).catch(console.error);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal menyalin template:", err);
    }
  };

  const handleToggleFavorite = async () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    await toggleFavoriteLivechatTemplateAction(template.id, nextState);
  };

  // Determine tag color accent
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "Deposit":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Withdraw":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Akun & Login":
        return "bg-violet-50 text-violet-700 border-violet-200/80";
      case "Bank & Kendala":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Motivasi & JP":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "Promo & Event":
        return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80";
      default:
        return "bg-pink-50 text-pink-700 border-pink-200/80";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between h-full w-full rounded-2xl p-4 sm:p-5 bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-xs hover:shadow-md hover:border-pink-300 hover:bg-white transition-all duration-200 overflow-hidden">
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 opacity-90" />

      {/* Top Section: Kode PK & Header Metadata */}
      <div>
        {/* Trigger / Kode PK Header */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex-1 min-w-0">
            {/* Prominent Kode PK / Trigger Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/5 border border-pink-300/80 shadow-2xs max-w-full">
              <Keyboard size={15} className="text-pink-600 flex-shrink-0" />
              <span
                className="font-mono font-black text-sm sm:text-base text-pink-700 tracking-wider truncate select-all"
                title={`Trigger Kode PK: ${template.kodePk}`}
              >
                {template.kodePk}
              </span>
            </div>
          </div>

          {/* Action Star & Favorite */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? "Hapus dari favorit" : "Tandai sebagai favorit"}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                  : "text-ink-300 hover:text-amber-500 hover:bg-pink-50"
              }`}
            >
              <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Subheader: Category Tag & Copy Counter */}
        <div className="flex items-center justify-between text-xs mb-3 pb-2.5 border-b border-pink-100/70">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getTagStyle(
                template.categoryTag || "Umum"
              )}`}
            >
              <Tag size={11} />
              {template.categoryTag || "Umum"}
            </span>
          </div>

          <div className="text-[11px] text-ink-400 font-medium">
            {usageCount > 0 ? (
              <span>{usageCount}x disalin</span>
            ) : (
              <span className="text-ink-300">Siap dipakai</span>
            )}
          </div>
        </div>

        {/* Kotak Kalimat Balasan */}
        <div className="relative mb-3.5">
          <div className="w-full h-36 sm:h-40 overflow-y-auto rounded-xl p-3.5 bg-pink-50/40 border border-pink-100/80 text-xs sm:text-[13px] text-ink-800 font-sans leading-relaxed whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-pink-200 hover:border-pink-200 transition-colors">
            {template.content}
          </div>
        </div>
      </div>

      {/* Footer: 1-Click Copy & Actions */}
      <div className="pt-2 flex items-center gap-2">
        {/* 1-Click "Salin Balasan" Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all duration-150 active:scale-[0.98] ${
            copied
              ? "bg-emerald-600 text-white shadow-emerald-200"
              : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-pink-200/50"
          }`}
        >
          {copied ? (
            <>
              <Check size={16} className="animate-bounce" />
              <span>Tersalin ke Clipboard! ✓</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Salin Balasan</span>
            </>
          )}
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(template)}
          title="Edit Template"
          aria-label="Edit Template"
          className="p-2.5 rounded-xl border border-pink-200/80 text-ink-500 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-colors"
        >
          <Edit3 size={15} />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(template.id)}
          title="Hapus Template"
          aria-label="Hapus Template"
          className="p-2.5 rounded-xl border border-pink-200/80 text-ink-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
