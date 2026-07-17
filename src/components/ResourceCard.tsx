"use client";

import { useState } from "react";
import { Download, Eye, Heart, ExternalLink, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { storage } from "@/lib/storage";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
    iconEmoji: string | null;
    thumbnailUrl: string | null;
    currentVersion: string;
    isFavorite: boolean;
    createdAt: Date;
    category: {
      name: string;
      slug: string;
      colorAccent: string | null;
    };
    tags: { tag: { name: string } }[];
  };
  onPreview?: () => void;
}

export default function ResourceCard({ resource, onPreview }: ResourceCardProps) {
  const [isFavorite, setIsFavorite] = useState(resource.isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    if (resource.sourceType === "FILE" && resource.fileUrl) {
      const url = storage.getDownloadUrl(resource.fileUrl);
      const link = document.createElement("a");
      link.href = url;
      link.download = resource.fileUrl.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resource.sourceType === "LINK" && resource.externalUrl) {
      window.open(resource.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Call API to persist favorite status
  };

  return (
    <div
      className="card-glow rounded-2xl bg-white/80 backdrop-blur-md border border-pink-100/50 shadow-sm overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail or Fallback */}
      <div className="h-32 bg-pink-50 relative overflow-hidden flex items-center justify-center group-hover:bg-pink-100/50 transition-colors">
        {resource.thumbnailUrl ? (
          <img
            src={storage.getThumbnailUrl(resource.thumbnailUrl)}
            alt={resource.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <span className="text-5xl drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-110">
            {resource.iconEmoji || "📦"}
          </span>
        )}
        
        {/* Category Pill overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: resource.category.colorAccent || "var(--pink-600)",
              border: `1px solid ${resource.category.colorAccent}30`,
            }}
          >
            {resource.category.name}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-pink-50 transition-colors z-10"
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isFavorite
                ? "fill-pink-500 text-pink-500 heart-pop"
                : "text-ink-300"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-ink-900 leading-tight mb-1 line-clamp-1" title={resource.title}>
          {resource.title}
        </h3>
        <p className="text-xs text-ink-500 line-clamp-2 mb-3 flex-1" title={resource.description}>
          {resource.description}
        </p>

        {/* Tags & Meta */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.name}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-ink-50 text-ink-500 border border-ink-100"
              >
                <Tag size={8} />
                {tag.name}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-ink-50 text-ink-500 border border-ink-100">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-ink-300 font-medium">
            <span>v{resource.currentVersion}</span>
            <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-pink-50">
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-ink-700 bg-white border border-pink-100 hover:bg-pink-50 transition-colors"
          >
            <Eye size={14} />
            Preview
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm"
            style={{
              background: "linear-gradient(135deg, var(--pink-500) 0%, var(--pink-600) 100%)",
            }}
          >
            {resource.sourceType === "FILE" ? (
              <>
                <Download size={14} /> Download
              </>
            ) : (
              <>
                <ExternalLink size={14} /> Open Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
