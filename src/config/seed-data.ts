/**
 * Seed Data Configuration
 * Maps the actual user-provided files to resource metadata for database seeding.
 * All download paths are relative to the public/downloads/ directory.
 */

export interface SeedResource {
  title: string;
  description: string;
  sourceType: "FILE" | "LINK";
  fileUrl: string;
  categorySlug: string;
  tags: string[];
  iconEmoji: string;
  currentVersion: string;
  thumbnailUrl?: string;
}

export const SEED_RESOURCES: SeedResource[] = [
  // ── Chrome Extensions ──────────────────────────────────────
  {
    title: "Pink Password Generator Pro",
    description:
      "Beautiful pink-themed password generator dashboard for LiveChat agents. Generate secure, unique passwords with a stunning UI. Chrome Extension (Manifest V3).",
    sourceType: "FILE",
    fileUrl: "/downloads/chrome-extension/Generate-pass-Mila.zip",
    categorySlug: "chrome-extension",
    tags: ["chrome", "password", "livechat", "productivity", "pink"],
    iconEmoji: "🔑",
    currentVersion: "1.0.0",
  },
  {
    title: "CS Advanced Tool v2.1 (Otoscatter)",
    description:
      "Advanced automation tool for LiveChat agents. Features: auto TS, browser-profile independent operation, fast performance. Chrome Extension (Manifest V3).",
    sourceType: "FILE",
    fileUrl: "/downloads/chrome-extension/CS-Advanced-Tool-v2.1.zip",
    categorySlug: "chrome-extension",
    tags: ["chrome", "automation", "livechat", "advanced", "tool"],
    iconEmoji: "⚡",
    currentVersion: "2.1",
  },
  {
    title: "Extension Mila Suite",
    description:
      "Complete Mila extension suite package containing all Highlighter Pro scripts, decorative assets, and the internal landing page. Bundled as a single installable ZIP.",
    sourceType: "FILE",
    fileUrl: "/downloads/chrome-extension/Extension-Mila-Suite.zip",
    categorySlug: "chrome-extension",
    tags: ["chrome", "mila", "suite", "livechat", "highlighter"],
    iconEmoji: "🌸",
    currentVersion: "1.0.0",
  },

  // ── UserScripts ────────────────────────────────────────────
  {
    title: "Mila 1 — Highlighter Pro with Dashboard",
    description:
      "Premium chat word highlighter with floating dashboard. Supports custom group names, colors, auto-response templates, and SLA notification controls. Tampermonkey UserScript for LiveChat.",
    sourceType: "FILE",
    fileUrl: "/downloads/script/Mila-1-Highlighter-Pro.user.js",
    categorySlug: "script",
    tags: ["userscript", "tampermonkey", "livechat", "highlighter", "dashboard"],
    iconEmoji: "🎨",
    currentVersion: "2025-10-07",
  },
  {
    title: "Mila 2 — Duplicate Message Danger Alert",
    description:
      "Real-time duplicate message detection and spam protection for LiveChat. Highlights duplicate messages with bold red HUD warnings and visual alerts. Tampermonkey UserScript.",
    sourceType: "FILE",
    fileUrl: "/downloads/script/Mila-2-Duplicate-Checker.user.js",
    categorySlug: "script",
    tags: ["userscript", "tampermonkey", "livechat", "spam", "duplicate"],
    iconEmoji: "🚨",
    currentVersion: "2025-01-21",
  },
  {
    title: "Mila 3 — Minimal UI + SLA Tracker",
    description:
      "Custom LiveChat UI modifications with heartbeat SLA indicators (yellow/red), rainbow tags, toast notifications, and fixed sidebar widths. Per-ID toggle support. Tampermonkey UserScript.",
    sourceType: "FILE",
    fileUrl: "/downloads/script/Mila-3-UI-SLA-Tracker.user.js",
    categorySlug: "script",
    tags: ["userscript", "tampermonkey", "livechat", "sla", "ui"],
    iconEmoji: "⏱️",
    currentVersion: "2.0.4",
  },
  {
    title: "Mila 4 — Pengecekan Duration Timer",
    description:
      "Tracks agent task-checking duration with multi-phase alerts (2min/3min/5min). Auto-starts on trigger keywords, auto-stops on archived chats. Integrates with Mila 1 dashboard settings. Tampermonkey UserScript.",
    sourceType: "FILE",
    fileUrl: "/downloads/script/Mila-4-Duration-Timer.user.js",
    categorySlug: "script",
    tags: ["userscript", "tampermonkey", "livechat", "timer", "duration"],
    iconEmoji: "🔍",
    currentVersion: "1.3.0",
  },
  {
    title: "Kode PGsoft Picker OCR",
    description:
      "Drag-to-select image region OCR tool using Tesseract.js. Allows agents to visually select a region on an image, perform optical character recognition, and copy the result. Tampermonkey UserScript.",
    sourceType: "FILE",
    fileUrl: "/downloads/script/Kode-PGsoft-Picker-OCR.user.js",
    categorySlug: "script",
    tags: ["userscript", "tampermonkey", "ocr", "tesseract", "image"],
    iconEmoji: "📷",
    currentVersion: "2026-06-20",
  },

  // ── Assets ─────────────────────────────────────────────────
  {
    title: "Bear Decoration Asset",
    description:
      "Cute bear illustration used as a floating decorative element in the Mila suite interface. PNG format with transparency.",
    sourceType: "FILE",
    fileUrl: "/downloads/assets/bear.png",
    categorySlug: "assets",
    tags: ["image", "decoration", "bear", "cute", "png"],
    iconEmoji: "🐻",
    currentVersion: "1.0.0",
    thumbnailUrl: "/downloads/assets/bear.png",
  },
  {
    title: "Flower Decoration Asset",
    description:
      "Pink flower illustration used as a floating decorative element in the Mila suite interface. PNG format.",
    sourceType: "FILE",
    fileUrl: "/downloads/assets/flower.png",
    categorySlug: "assets",
    tags: ["image", "decoration", "flower", "pink", "png"],
    iconEmoji: "🌸",
    currentVersion: "1.0.0",
    thumbnailUrl: "/downloads/assets/flower.png",
  },
  {
    title: "Mila Sticker Character",
    description:
      "Mila character sticker illustration used as a mascot/branding element in the Highlighter Pro Suite landing page. PNG format.",
    sourceType: "FILE",
    fileUrl: "/downloads/assets/mila_sticker.png",
    categorySlug: "assets",
    tags: ["image", "sticker", "mila", "mascot", "png"],
    iconEmoji: "💖",
    currentVersion: "1.0.0",
    thumbnailUrl: "/downloads/assets/mila_sticker.png",
  },
  {
    title: "Flower Old Decoration Asset",
    description:
      "Previous version of the flower decoration illustration. PNG format. Kept as a reference/archive asset.",
    sourceType: "FILE",
    fileUrl: "/downloads/assets/flower_old.png",
    categorySlug: "assets",
    tags: ["image", "decoration", "flower", "archive", "png"],
    iconEmoji: "🌺",
    currentVersion: "1.0.0",
    thumbnailUrl: "/downloads/assets/flower_old.png",
  },
];
