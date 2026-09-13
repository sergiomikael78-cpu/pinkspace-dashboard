"use client";

import { useState } from "react";
import { Copy, Check, Star, Edit3, Trash2, Tag, CheckCircle2 } from "lucide-react";
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

  return (
    <div className="group relative flex flex-col justify-between h-full w-full rounded-2xl p-4 sm:p-5 bg-white/85 backdrop-blur-md border border-pink-200/70 shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-200 overflow-hidden">
      {/* Top Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 opacity-80" />

      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex-1 min-w-0">
            <h3
              className="text-base sm:text-lg font-bold text-ink-900 line-clamp-2 leading-snug tracking-tight"
              title={template.title}
            >
              {template.title}
            </h3>
          </div>

          {/* Badge Kode PK */}
          <div className="flex-shrink-0">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-wide bg-pink-100 text-pink-700 border border-pink-200 shadow-xs max-w-[140px] truncate"
              title={`Kode PK: ${template.kodePk}`}
            >
              {template.kodePk}
            </span>
          </div>
        </div>

        {/* Subheader: Tag & Usage Count & Star */}
        <div className="flex items-center justify-between text-xs text-ink-400 mb-3 pb-2.5 border-b border-pink-100/60">
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag size={12} className="text-pink-400 flex-shrink-0" />
            <span className="truncate max-w-[110px] font-medium text-ink-600 bg-pink-50/80 px-2 py-0.5 rounded-md border border-pink-100/60">
              {template.categoryTag || "Umum"}
            </span>
            <span className="text-[11px] text-ink-400 ml-1">
              • {usageCount}x disalin
            </span>
          </div>

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
            <Star size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Template Content Box */}
        <div className="relative mb-4">
          <div className="w-full max-h-36 sm:max-h-40 overflow-y-auto rounded-xl p-3.5 bg-pink-50/50 border border-pink-100/70 text-xs sm:text-[13px] text-ink-700 font-sans leading-relaxed whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-pink-200">
            {template.content}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-2 flex items-center gap-2">
        {/* Main Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl font-medium text-xs sm:text-sm shadow-xs transition-all duration-150 ${
            copied
              ? "bg-emerald-600 text-white font-semibold shadow-emerald-200 scale-[0.99]"
              : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 active:scale-[0.98]"
          }`}
        >
          {copied ? (
            <>
              <Check size={16} className="animate-bounce" />
              <span>Tersalin ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Salin Balasan</span>
            </>
          )}
        </button>

        {/* Quick Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(template)}
          title="Edit Template"
          aria-label="Edit Template"
          className="p-2.5 rounded-xl border border-pink-200/80 text-ink-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
        >
          <Edit3 size={15} />
        </button>

        {/* Quick Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(template.id)}
          title="Hapus Template"
          aria-label="Hapus Template"
          className="p-2.5 rounded-xl border border-pink-200/80 text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
