import { getDb } from "./db";
import { sql, eq } from "drizzle-orm";
import { category, livechatTemplate, workspace } from "./schema";
import { CATEGORIES } from "../config/categories";

export async function initLivechatTableAndSeed() {
  console.log("🌸 Ensuring LivechatTemplate table and initial seed...");
  const db = getDb();

  // 1. Create table if not exists
  db.run(sql`
    CREATE TABLE IF NOT EXISTS LivechatTemplate (
      id TEXT PRIMARY KEY,
      workspaceId TEXT NOT NULL REFERENCES Workspace(id),
      title TEXT NOT NULL,
      kodePk TEXT NOT NULL,
      content TEXT NOT NULL,
      categoryTag TEXT DEFAULT 'Umum',
      isFavorite INTEGER DEFAULT 0 NOT NULL,
      usageCount INTEGER DEFAULT 0 NOT NULL,
      sortOrder INTEGER DEFAULT 0 NOT NULL,
      createdAt INTEGER DEFAULT (unixepoch() * 1000) NOT NULL,
      updatedAt INTEGER DEFAULT (unixepoch() * 1000) NOT NULL
    );
  `);

  db.run(sql`CREATE INDEX IF NOT EXISTS livechatTemplate_workspaceId_idx ON LivechatTemplate (workspaceId);`);
  db.run(sql`CREATE INDEX IF NOT EXISTS livechatTemplate_kodePk_idx ON LivechatTemplate (kodePk);`);

  console.log("✅ Table LivechatTemplate is ready.");

  // 2. Ensure default workspace
  let ws = await db.query.workspace.findFirst({
    where: eq(workspace.id, "default-workspace"),
  });
  if (!ws) {
    await db.insert(workspace).values({
      id: "default-workspace",
      name: "My Workspace",
    }).onConflictDoNothing();
  }

  // 3. Ensure category exists in db
  const livechatCatConfig = CATEGORIES.find(c => c.slug === "template-livechat");
  if (livechatCatConfig) {
    const existingCat = await db.query.category.findFirst({
      where: eq(category.slug, "template-livechat"),
    });

    if (!existingCat) {
      await db.insert(category).values({
        id: livechatCatConfig.id,
        workspaceId: "default-workspace",
        name: livechatCatConfig.displayName,
        slug: livechatCatConfig.slug,
        description: livechatCatConfig.description,
        icon: livechatCatConfig.icon,
        colorAccent: livechatCatConfig.accentColor,
        sortOrder: livechatCatConfig.sortOrder,
      }).onConflictDoNothing();
      console.log("✅ Category Template Livechat registered in DB.");
    }
  }

  // 4. Seed initial realistic CS templates if table empty
  const existingTemplates = await db.query.livechatTemplate.findMany();
  if (existingTemplates.length === 0) {
    const sampleTemplates = [
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Salam Pembuka Ramah",
        kodePk: "PK01",
        categoryTag: "Umum",
        isFavorite: true,
        usageCount: 15,
        sortOrder: 1,
        content: `Halo Kak! Selamat datang di layanan Livechat kami. 😊\nPerkenalkan saya CS yang bertugas hari ini. Ada yang bisa saya bantu untuk kendala atau transaksinya Kak?`,
      },
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Konfirmasi Deposit Diproses",
        kodePk: "PK-DP01",
        categoryTag: "Deposit",
        isFavorite: true,
        usageCount: 38,
        sortOrder: 2,
        content: `Baik Kak, mohon ditunggu sebentar ya. Form deposit Kakak saat ini sedang dibantu verifikasi dan dicek ke mutasi bank oleh tim finance kami. Kami akan kabari secepatnya begitu dana masuk ya Kak. Terima kasih atas kesabarannya. 🙏`,
      },
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Kendala Bank Gangguan / Pending",
        kodePk: "PK-DP-GANGGUAN",
        categoryTag: "Deposit",
        isFavorite: false,
        usageCount: 9,
        sortOrder: 3,
        content: `Mohon maaf atas ketidaknyamanannya Kak. Saat ini jaringan mutasi bank yang bersangkutan sedang mengalami gangguan/maintenance dari pihak perbankan. Begitu mutasi bank normal kembali, saldo Kakak akan langsung kami proseskan tanpa perlu konfirmasi ulang. Mohon kesabarannya ya Kak.`,
      },
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Format Reset Password Akun",
        kodePk: "PK-RESET-PASS",
        categoryTag: "Akun",
        isFavorite: true,
        usageCount: 22,
        sortOrder: 4,
        content: `Untuk keamanan akun dan bantuan reset password, mohon lengkapi data verifikasi berikut ya Kak:\n- User ID:\n- Nama Rekening Terdaftar:\n- Nomor Rekening Terdaftar:\n- Email / Nomor HP:\nJika data sudah valid, password baru akan segera kami kirimkan.`,
      },
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Konfirmasi Withdraw Sukses",
        kodePk: "PK-WD-BERHASIL",
        categoryTag: "Withdraw",
        isFavorite: false,
        usageCount: 18,
        sortOrder: 5,
        content: `Kabar baik Kak! Permintaan withdraw Kakak sudah berhasil kami proseskan dan dana telah berhasil ditransfer ke nomor rekening yang terdaftar. Silakan lakukan pengecekan saldo pada mutasi rekening Kakak ya. Terima kasih banyak Kak! 🎉`,
      },
      {
        id: "lt-" + crypto.randomUUID().slice(0, 8),
        workspaceId: "default-workspace",
        title: "Salam Penutup Livechat",
        kodePk: "PK-CLOSING",
        categoryTag: "Umum",
        isFavorite: false,
        usageCount: 42,
        sortOrder: 6,
        content: `Sama-sama Kak, senang sekali bisa melayani Kakak. Apabila ada hal lain yang ingin ditanyakan, jangan ragu untuk menghubungi kami kembali ya Kak. Semoga harinya menyenangkan dan salam sukses selalu! ✨🌸`,
      },
    ];

    for (const t of sampleTemplates) {
      await db.insert(livechatTemplate).values(t);
    }
    console.log(`✅ Seeded ${sampleTemplates.length} default CS templates.`);
  }

  console.log("🎉 All Livechat table and seed initialization complete!");
}

if (require.main === module) {
  initLivechatTableAndSeed().catch(console.error);
}
