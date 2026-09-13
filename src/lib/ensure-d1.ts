import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CATEGORIES } from "@/config/categories";
import { SEED_RESOURCES } from "@/config/seed-data";

let isD1Initialized = false;

export async function ensureD1DatabaseReady() {
  if (isD1Initialized) return;

  try {
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      const db = ctx.env.DB;

      const tables = [
        "CREATE TABLE IF NOT EXISTS Workspace (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, ownerId TEXT, createdAt INTEGER DEFAULT 0 NOT NULL);",
        "INSERT OR IGNORE INTO Workspace (id, name) VALUES ('default-workspace', 'My Workspace');",
        "CREATE TABLE IF NOT EXISTS Category (id TEXT PRIMARY KEY NOT NULL, workspaceId TEXT NOT NULL, name TEXT NOT NULL, slug TEXT NOT NULL, description TEXT, icon TEXT, colorAccent TEXT, sortOrder INTEGER DEFAULT 0 NOT NULL);",
        "CREATE TABLE IF NOT EXISTS Resource (id TEXT PRIMARY KEY NOT NULL, workspaceId TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, sourceType TEXT NOT NULL, fileUrl TEXT, externalUrl TEXT, provider TEXT, categoryId TEXT NOT NULL, thumbnailUrl TEXT, iconEmoji TEXT, currentVersion TEXT DEFAULT '1.0.0' NOT NULL, isFavorite INTEGER DEFAULT 0 NOT NULL, openCount INTEGER DEFAULT 0 NOT NULL, downloadCount INTEGER DEFAULT 0 NOT NULL, lastOpenedAt INTEGER, createdAt INTEGER DEFAULT 0 NOT NULL, updatedAt INTEGER DEFAULT 0 NOT NULL);",
        "CREATE TABLE IF NOT EXISTS LivechatTemplate (id TEXT PRIMARY KEY NOT NULL, workspaceId TEXT NOT NULL, title TEXT NOT NULL, kodePk TEXT NOT NULL, content TEXT NOT NULL, categoryTag TEXT DEFAULT 'Umum', isFavorite INTEGER DEFAULT 0 NOT NULL, usageCount INTEGER DEFAULT 0 NOT NULL, sortOrder INTEGER DEFAULT 0 NOT NULL, createdAt INTEGER DEFAULT 0 NOT NULL, updatedAt INTEGER DEFAULT 0 NOT NULL);",
        "CREATE TABLE IF NOT EXISTS Tag (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL);",
        "CREATE TABLE IF NOT EXISTS ResourceTag (resourceId TEXT NOT NULL, tagId TEXT NOT NULL, PRIMARY KEY(resourceId, tagId));",
        "CREATE TABLE IF NOT EXISTS ResourceVersion (id TEXT PRIMARY KEY NOT NULL, resourceId TEXT NOT NULL, version TEXT NOT NULL, fileUrl TEXT, externalUrl TEXT, changelog TEXT, createdAt INTEGER DEFAULT 0 NOT NULL);",
        "CREATE TABLE IF NOT EXISTS Collection (id TEXT PRIMARY KEY NOT NULL, workspaceId TEXT NOT NULL, name TEXT NOT NULL, description TEXT);",
        "CREATE TABLE IF NOT EXISTS CollectionResource (collectionId TEXT NOT NULL, resourceId TEXT NOT NULL, PRIMARY KEY(collectionId, resourceId));",
        "CREATE TABLE IF NOT EXISTS UserPreference (id TEXT PRIMARY KEY NOT NULL, workspaceId TEXT NOT NULL, activeThemeId TEXT DEFAULT 'soft-sakura' NOT NULL, animationEnabled INTEGER DEFAULT 1 NOT NULL, animationIntensity TEXT DEFAULT 'medium' NOT NULL, dashboardWidgets TEXT DEFAULT '{\"welcome\":true}' NOT NULL, gridDensity TEXT DEFAULT 'comfortable' NOT NULL, sidebarCollapsed INTEGER DEFAULT 0 NOT NULL, searchSuggestions INTEGER DEFAULT 1 NOT NULL, searchAutoComplete INTEGER DEFAULT 1 NOT NULL, recentSearchEnabled INTEGER DEFAULT 1 NOT NULL, defaultSearchCategory TEXT, favoriteSorting TEXT DEFAULT 'recent' NOT NULL, defaultCollectionId TEXT, downloadFolder TEXT, autoDownload INTEGER DEFAULT 0 NOT NULL, downloadConfirmation INTEGER DEFAULT 1 NOT NULL, imageQuality TEXT DEFAULT 'auto' NOT NULL, lazyLoading INTEGER DEFAULT 1 NOT NULL, updatedAt INTEGER DEFAULT 0 NOT NULL);"
      ];

      for (const sql of tables) {
        await db.prepare(sql).run().catch(() => {});
      }

      for (const cat of CATEGORIES) {
        await db.prepare(
          "INSERT OR IGNORE INTO Category (id, workspaceId, name, slug, description, icon, colorAccent, sortOrder) VALUES (?, 'default-workspace', ?, ?, ?, ?, ?, ?)"
        ).bind(
          cat.id,
          cat.displayName,
          cat.slug,
          cat.description,
          cat.icon,
          cat.accentColor,
          cat.sortOrder
        ).run().catch(() => {});
      }

      const categoryMap = new Map<string, string>();
      for (const cat of CATEGORIES) {
        categoryMap.set(cat.slug, cat.id);
      }

      for (const res of SEED_RESOURCES) {
        const catId = categoryMap.get(res.categorySlug) || "cat-" + res.categorySlug;
        const resId = "res-" + res.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
        await db.prepare(
          "INSERT OR IGNORE INTO Resource (id, workspaceId, title, description, sourceType, fileUrl, provider, categoryId, iconEmoji, currentVersion, isFavorite, openCount, downloadCount, createdAt, updatedAt) VALUES (?, 'default-workspace', ?, ?, ?, ?, 'manual', ?, ?, ?, 0, 0, 0, unixepoch() * 1000, unixepoch() * 1000)"
        ).bind(
          resId,
          res.title,
          res.description,
          res.sourceType,
          res.fileUrl,
          catId,
          res.iconEmoji || "📦",
          res.currentVersion || "1.0.0"
        ).run().catch(() => {});
      }

      isD1Initialized = true;
    }
  } catch (error) {
    console.error("Failed to auto-initialize Cloudflare D1 tables:", error);
  }
}
