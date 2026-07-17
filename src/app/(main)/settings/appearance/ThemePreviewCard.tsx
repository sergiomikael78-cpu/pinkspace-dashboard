"use client";

import { Check } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface ThemePreviewCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onSelect: () => void;
}

export function ThemePreviewCard({ theme, isActive, onSelect }: ThemePreviewCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col text-left rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
        isActive
          ? "border-pink-500 shadow-md ring-4 ring-pink-500/20"
          : "border-transparent shadow-sm hover:shadow-md hover:border-pink-300 bg-white"
      }`}
    >
      {/* Preview Header / Mock Window */}
      <div 
        className="h-28 w-full relative p-3 flex flex-col justify-between"
        style={{ background: theme.tokens["--color-background"] }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-60" />
        </div>
        
        {/* Mock Content */}
        <div className="flex gap-2 h-full mt-3">
          {/* Sidebar mock */}
          <div 
            className="w-1/4 rounded-md opacity-40"
            style={{ background: theme.tokens["--color-surface-hover"] }}
          />
          {/* Main content mock */}
          <div className="flex-1 flex flex-col gap-2">
            <div 
              className="w-full h-8 rounded-md opacity-60"
              style={{ background: theme.tokens["--gradient-hero"] }}
            />
            <div className="flex gap-2 flex-1">
              <div className="flex-1 rounded-md opacity-50" style={{ background: theme.tokens["--color-surface"] }} />
              <div className="flex-1 rounded-md opacity-50" style={{ background: theme.tokens["--color-surface"] }} />
            </div>
          </div>
        </div>

        {isActive && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-white text-pink-600 rounded-full p-2 shadow-lg">
              <Check size={20} strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Theme Info */}
      <div className="p-4 bg-white border-t border-gray-100 flex-1 w-full">
        <h3 className="font-bold text-gray-900 mb-1">{theme.name}</h3>
        <p className="text-xs text-gray-500 flex flex-wrap gap-1">
          {theme.mood.map((m, i) => (
            <span key={i} className="inline-block">{m}{i < theme.mood.length - 1 && ","}</span>
          ))}
        </p>
      </div>
    </button>
  );
}
