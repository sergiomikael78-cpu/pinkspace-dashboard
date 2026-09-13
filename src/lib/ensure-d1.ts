import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CATEGORIES } from "@/config/categories";

let isD1Initialized = false;

export async function ensureD1DatabaseReady() {
  if (isD1Initialized) return;

  try {
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      // 1. Create all essential tables in Cloudflare D1
      await ctx.env.DB.exec(`
        CREATE TABLE IF NOT EXISTS Workspace (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          ownerId text,
          createdAt integer DEFAULT (unixepoch() * 1000) NOT NULL
        );
        INSERT OR IGNORE INTO Workspace (id, name) VALUES ('default-workspace', 'My Workspace');

        CREATE TABLE IF NOT EXISTS Category (
          id text PRIMARY KEY NOT NULL,
          workspaceId text NOT NULL,
          name text NOT NULL,
          slug text NOT NULL,
          description text,
          icon text,
          colorAccent text,
          sortOrder integer DEFAULT 0 NOT NULL
        );
        CREATE INDEX IF NOT EXISTS category_workspaceId_idx ON Category (workspaceId);
        CREATE UNIQUE INDEX IF NOT EXISTS category_workspaceId_slug_idx ON Category (workspaceId, slug);

        CREATE TABLE IF NOT EXISTS LivechatTemplate (
          id text PRIMARY KEY NOT NULL,
          workspaceId text NOT NULL,
          title text NOT NULL,
          kodePk text NOT NULL,
          content text NOT NULL,
          categoryTag text DEFAULT 'Umum',
          isFavorite integer DEFAULT 0 NOT NULL,
          usageCount integer DEFAULT 0 NOT NULL,
          sortOrder integer DEFAULT 0 NOT NULL,
          createdAt integer DEFAULT (unixepoch() * 1000) NOT NULL,
          updatedAt integer DEFAULT (unixepoch() * 1000) NOT NULL
        );
        CREATE INDEX IF NOT EXISTS livechatTemplate_workspaceId_idx ON LivechatTemplate (workspaceId);
        CREATE INDEX IF NOT EXISTS livechatTemplate_kodePk_idx ON LivechatTemplate (kodePk);

        CREATE TABLE IF NOT EXISTS Resource (
          id text PRIMARY KEY NOT NULL,
          workspaceId text NOT NULL,
          title text NOT NULL,
          description text NOT NULL,
          sourceType text NOT NULL,
          fileUrl text,
          externalUrl text,
          provider text,
          categoryId text NOT NULL,
          thumbnailUrl text,
          iconEmoji text,
          currentVersion text DEFAULT '1.0.0' NOT NULL,
          isFavorite integer DEFAULT 0 NOT NULL,
          openCount integer DEFAULT 0 NOT NULL,
          downloadCount integer DEFAULT 0 NOT NULL,
          lastOpenedAt integer,
          createdAt integer DEFAULT (unixepoch() * 1000) NOT NULL,
          updatedAt integer DEFAULT (unixepoch() * 1000) NOT NULL
        );
        CREATE INDEX IF NOT EXISTS resource_workspaceId_idx ON Resource (workspaceId);
        CREATE INDEX IF NOT EXISTS resource_categoryId_idx ON Resource (categoryId);

        CREATE TABLE IF NOT EXISTS Tag (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS Tag_name_unique ON Tag (name);

        CREATE TABLE IF NOT EXISTS ResourceTag (
          resourceId text NOT NULL,
          tagId text NOT NULL,
          PRIMARY KEY(resourceId, tagId)
        );

        CREATE TABLE IF NOT EXISTS ResourceVersion (
          id text PRIMARY KEY NOT NULL,
          resourceId text NOT NULL,
          version text NOT NULL,
          fileUrl text,
          externalUrl text,
          changelog text,
          createdAt integer DEFAULT (unixepoch() * 1000) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Collection (
          id text PRIMARY KEY NOT NULL,
          workspaceId text NOT NULL,
          name text NOT NULL,
          description text
        );

        CREATE TABLE IF NOT EXISTS CollectionResource (
          collectionId text NOT NULL,
          resourceId text NOT NULL,
          PRIMARY KEY(collectionId, resourceId)
        );

        CREATE TABLE IF NOT EXISTS UserPreference (
          id text PRIMARY KEY NOT NULL,
          workspaceId text NOT NULL,
          activeThemeId text DEFAULT 'soft-sakura' NOT NULL,
          animationEnabled integer DEFAULT 1 NOT NULL,
          animationIntensity text DEFAULT 'medium' NOT NULL,
          dashboardWidgets text DEFAULT '{"welcome":true,"statistics":true,"favorites":true,"recent":true,"collections":true}' NOT NULL,
          gridDensity text DEFAULT 'comfortable' NOT NULL,
          sidebarCollapsed integer DEFAULT 0 NOT NULL,
          searchSuggestions integer DEFAULT 1 NOT NULL,
          searchAutoComplete integer DEFAULT 1 NOT NULL,
          recentSearchEnabled integer DEFAULT 1 NOT NULL,
          defaultSearchCategory text,
          favoriteSorting text DEFAULT 'recent' NOT NULL,
          defaultCollectionId text,
          downloadFolder text,
          autoDownload integer DEFAULT 0 NOT NULL,
          downloadConfirmation integer DEFAULT 1 NOT NULL,
          imageQuality text DEFAULT 'auto' NOT NULL,
          lazyLoading integer DEFAULT 1 NOT NULL,
          updatedAt integer DEFAULT (unixepoch() * 1000) NOT NULL
        );

        INSERT OR IGNORE INTO LivechatTemplate (id, workspaceId, title, kodePk, content, categoryTag, isFavorite, usageCount, sortOrder)
        VALUES
        ('lt-sample-1', 'default-workspace', 'Salam Pembuka Ramah', 'PK01', 'Halo Kak! Selamat datang di layanan Livechat kami. 😊\nPerkenalkan saya CS yang bertugas hari ini. Ada yang bisa saya bantu untuk kendala atau transaksinya Kak?', 'Umum', 1, 15, 1),
        ('lt-sample-2', 'default-workspace', 'Konfirmasi Deposit Diproses', 'PK-DP01', 'Baik Kak, mohon ditunggu sebentar ya. Form deposit Kakak saat ini sedang dibantu verifikasi dan dicek ke mutasi bank oleh tim finance kami.', 'Deposit', 1, 38, 2),
        ('lt-sample-3', 'default-workspace', 'Kendala Bank Gangguan / Pending', 'PK-DP-GANGGUAN', 'Mohon maaf atas ketidaknyamanannya Kak. Saat ini jaringan mutasi bank yang bersangkutan sedang mengalami gangguan/maintenance dari pihak perbankan.', 'Deposit', 0, 9, 3),
        ('lt-sample-4', 'default-workspace', 'Format Reset Password Akun', 'PK-RESET-PASS', 'Untuk keamanan akun dan bantuan reset password, mohon lengkapi:\n- User ID:\n- Nama Rekening Terdaftar:\n- Nomor Rekening Terdaftar:\n- Email / No HP:', 'Akun', 1, 22, 4),
        ('lt-sample-5', 'default-workspace', 'Konfirmasi Withdraw Sukses', 'PK-WD-BERHASIL', 'Kabar baik Kak! Permintaan withdraw Kakak sudah berhasil kami proseskan dan dana telah berhasil ditransfer ke rekening terdaftar. Terima kasih banyak! 🎉', 'Withdraw', 0, 18, 5),
        ('lt-sample-6', 'default-workspace', 'Salam Penutup Livechat', 'PK-CLOSING', 'Sama-sama Kak, senang sekali bisa melayani Kakak. Apabila ada hal lain yang ingin ditanyakan, jangan ragu untuk menghubungi kami kembali ya Kak. Salam sukses selalu! ✨🌸', 'Umum', 0, 42, 6);
      `);

      // 2. Insert all categories
      for (const cat of CATEGORIES) {
        await ctx.env.DB.prepare(`
          INSERT OR IGNORE INTO Category (id, workspaceId, name, slug, description, icon, colorAccent, sortOrder)
          VALUES (?, 'default-workspace', ?, ?, ?, ?, ?, ?)
        `).bind(
          cat.id,
          cat.displayName,
          cat.slug,
          cat.description,
          cat.icon,
          cat.accentColor,
          cat.sortOrder
        ).run().catch(() => {});
      }

      // 3. Seed all 24 resources (Chrome Extension 6, Script 10, Assets 8) into D1
      const { SEED_RESOURCES } = await import("@/config/seed-data");
      const categoryMap = new Map<string, string>();
      for (const cat of CATEGORIES) {
        categoryMap.set(cat.slug, cat.id);
      }

      for (const res of SEED_RESOURCES) {
        const catId = categoryMap.get(res.categorySlug) || "cat-" + res.categorySlug;
        const resId = "res-" + res.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
        await ctx.env.DB.prepare(`
          INSERT OR IGNORE INTO Resource (id, workspaceId, title, description, sourceType, fileUrl, provider, categoryId, iconEmoji, currentVersion, isFavorite, openCount, downloadCount, createdAt, updatedAt)
          VALUES (?, 'default-workspace', ?, ?, ?, ?, 'manual', ?, ?, ?, 0, 0, 0, unixepoch() * 1000, unixepoch() * 1000)
        `).bind(
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

