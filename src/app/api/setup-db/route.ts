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

    // 1. Ensure tables exist
    await db.exec(`
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
    `);

    // 2. Insert categories
    for (const cat of CATEGORIES) {
      await db.prepare(`
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
      ).run();
    }

    // 3. Insert all 24 resources
    const categoryMap = new Map<string, string>();
    for (const cat of CATEGORIES) {
      categoryMap.set(cat.slug, cat.id);
    }

    let insertedResources = 0;
    const errors: string[] = [];

    for (const res of SEED_RESOURCES) {
      const catId = categoryMap.get(res.categorySlug) || "cat-" + res.categorySlug;
      const resId = "res-" + res.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
      try {
        await db.prepare(`
          INSERT OR IGNORE INTO Resource (
            id, workspaceId, title, description, sourceType, fileUrl, provider, categoryId, iconEmoji, currentVersion, isFavorite, openCount, downloadCount, createdAt, updatedAt
          ) VALUES (
            ?, 'default-workspace', ?, ?, ?, ?, 'manual', ?, ?, ?, 0, 0, 0, unixepoch() * 1000, unixepoch() * 1000
          )
        `).bind(
          resId,
          res.title,
          res.description,
          res.sourceType,
          res.fileUrl,
          catId,
          res.iconEmoji || "📦",
          res.currentVersion || "1.0.0"
        ).run();
        insertedResources++;
      } catch (e: any) {
        errors.push(`${res.title}: ${e.message}`);
      }
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
      await db.prepare(`
        INSERT OR IGNORE INTO LivechatTemplate (
          id, workspaceId, title, kodePk, content, categoryTag, isFavorite, usageCount, sortOrder, createdAt, updatedAt
        ) VALUES (
          ?, 'default-workspace', ?, ?, ?, ?, ?, ?, 0, unixepoch() * 1000, unixepoch() * 1000
        )
      `).bind(st.id, st.title, st.kodePk, st.text, st.tag, st.isFav, st.count).run();
    }

    // Check counts
    const resCount = await db.prepare("SELECT count(*) as total FROM Resource").first<{ total: number }>();
    const tmplCount = await db.prepare("SELECT count(*) as total FROM LivechatTemplate").first<{ total: number }>();

    return NextResponse.json({
      success: true,
      message: "Cloudflare D1 database fully populated!",
      totalResourcesInD1: resCount?.total || 0,
      totalLivechatTemplatesInD1: tmplCount?.total || 0,
      errors: errors.length > 0 ? errors : undefined,
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
