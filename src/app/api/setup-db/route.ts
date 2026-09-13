import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CATEGORIES } from "@/config/categories";
import { SEED_RESOURCES } from "@/config/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ctx = getCloudflareContext();
    if (!ctx?.env?.DB) {
      return NextResponse.json({
        success: false,
        message: "No Cloudflare D1 database binding found",
      });
    }

    const db = ctx.env.DB;

    // 1. Execute each DDL statement individually with prepare().run() to avoid parser errors
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
      await db.prepare(sql).run();
    }

    // 2. Insert all categories
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
      ).run();
    }

    // 3. Insert all 24 resources (Chrome Extension 6, Script 10, Assets 8)
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
      ).run();
    }

    // 4. Seed Livechat Templates
    const sampleTemplates = [
      { id: "lt-1", title: "Salam Pembuka Ramah", kodePk: "PK01", tag: "Umum", isFav: 1, count: 15, text: "Halo Kak! Selamat datang di layanan Livechat kami. 😊\nPerkenalkan saya CS yang bertugas hari ini. Ada yang bisa saya bantu untuk kendala atau transaksinya Kak?" },
      { id: "lt-2", title: "Konfirmasi Deposit Diproses", kodePk: "PK-DP01", tag: "Deposit", isFav: 1, count: 38, text: "Baik Kak, mohon ditunggu sebentar ya. Form deposit Kakak saat ini sedang dibantu verifikasi dan dicek ke mutasi bank oleh tim finance kami. Kami akan kabari secepatnya begitu dana masuk ya Kak. Terima kasih atas kesabarannya. 🙏" },
      { id: "lt-3", title: "Kendala Bank Gangguan / Pending", kodePk: "PK-DP-GANGGUAN", tag: "Deposit", isFav: 0, count: 9, text: "Mohon maaf atas ketidaknyamanannya Kak. Saat ini jaringan mutasi bank yang bersangkutan sedang mengalami gangguan/maintenance dari pihak perbankan. Begitu mutasi bank normal kembali, saldo Kakak akan langsung kami proseskan tanpa perlu konfirmasi ulang. Mohon kesabarannya ya Kak." },
      { id: "lt-4", title: "Format Reset Password Akun", kodePk: "PK-RESET-PASS", tag: "Akun", isFav: 1, count: 22, text: "Untuk keamanan akun dan bantuan reset password, mohon lengkapi data verifikasi berikut ya Kak:\n- User ID:\n- Nama Rekening Terdaftar:\n- Nomor Rekening Terdaftar:\n- Email / Nomor HP:\nJika data sudah valid, password baru akan segera kami kirimkan." },
      { id: "lt-5", title: "Konfirmasi Withdraw Sukses", kodePk: "PK-WD-BERHASIL", tag: "Withdraw", isFav: 0, count: 18, text: "Kabar baik Kak! Permintaan withdraw Kakak sudah berhasil kami proseskan dan dana telah berhasil ditransfer ke nomor rekening yang terdaftar. Silakan lakukan pengecekan saldo pada mutasi rekening Kakak ya. Terima kasih banyak Kak! 🎉" },
      { id: "lt-6", title: "Salam Penutup Livechat", kodePk: "PK-CLOSING", tag: "Umum", isFav: 0, count: 42, text: "Sama-sama Kak, senang sekali bisa melayani Kakak. Apabila ada hal lain yang ingin ditanyakan, jangan ragu untuk menghubungi kami kembali ya Kak. Semoga harinya menyenangkan dan salam sukses selalu! ✨🌸" },
    ];

    for (const st of sampleTemplates) {
      await db.prepare(
        "INSERT OR IGNORE INTO LivechatTemplate (id, workspaceId, title, kodePk, content, categoryTag, isFavorite, usageCount, sortOrder, createdAt, updatedAt) VALUES (?, 'default-workspace', ?, ?, ?, ?, ?, ?, 0, unixepoch() * 1000, unixepoch() * 1000)"
      ).bind(st.id, st.title, st.kodePk, st.text, st.tag, st.isFav, st.count).run();
    }

    // Check counts
    const resCount = await db.prepare("SELECT count(*) as total FROM Resource").first<{ total: number }>();
    const tmplCount = await db.prepare("SELECT count(*) as total FROM LivechatTemplate").first<{ total: number }>();

    return NextResponse.json({
      success: true,
      message: "Cloudflare D1 database fully populated!",
      totalResourcesInD1: resCount?.total || 0,
      totalLivechatTemplatesInD1: tmplCount?.total || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to initialize D1 database",
      },
      { status: 500 }
    );
  }
}
