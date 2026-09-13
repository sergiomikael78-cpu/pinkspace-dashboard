import { db } from "./db";
import { workspace, category, resource, tag, resourceTag } from "./schema";
import { CATEGORIES } from "../config/categories";
import { SEED_RESOURCES } from "../config/seed-data";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌸 Seeding Pinkspace database with Drizzle...\n");

  // 1. Create default workspace
  let ws = await db.query.workspace.findFirst({
    where: eq(workspace.id, "default-workspace"),
  });

  if (!ws) {
    await db.insert(workspace).values({
      id: "default-workspace",
      name: "My Workspace",
    }).onConflictDoNothing();
    ws = await db.query.workspace.findFirst({ where: eq(workspace.id, "default-workspace") });
  }
  console.log(`✅ Workspace ready: My Workspace`);

  // 2. Seed categories from central config
  const categoryMap = new Map<string, string>(); // slug -> db id
  for (const cat of CATEGORIES) {
    let existingCat = await db.query.category.findFirst({
      where: eq(category.slug, cat.slug),
    });

    if (!existingCat) {
      await db.insert(category).values({
        id: cat.id,
        workspaceId: "default-workspace",
        name: cat.displayName,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        colorAccent: cat.accentColor,
        sortOrder: cat.sortOrder,
      }).onConflictDoNothing();
      existingCat = await db.query.category.findFirst({ where: eq(category.slug, cat.slug) });
    }
    if (existingCat) {
      categoryMap.set(cat.slug, existingCat.id);
      console.log(`  📁 Category: ${cat.icon} ${cat.displayName}`);
    }
  }

  // 3. Seed resources
  console.log("");
  for (const res of SEED_RESOURCES) {
    const categoryId = categoryMap.get(res.categorySlug);
    if (!categoryId) {
      console.warn(`  ⚠️ Category not found for slug: ${res.categorySlug}`);
      continue;
    }

    const tagIds: string[] = [];
    for (const tagName of res.tags) {
      let tagObj = await db.query.tag.findFirst({ where: eq(tag.name, tagName) });
      if (!tagObj) {
        const tagId = crypto.randomUUID();
        await db.insert(tag).values({ id: tagId, name: tagName }).onConflictDoNothing();
        tagObj = await db.query.tag.findFirst({ where: eq(tag.name, tagName) });
      }
      if (tagObj) {
        tagIds.push(tagObj.id);
      }
    }

    const resId = crypto.randomUUID();
    await db.insert(resource).values({
      id: resId,
      workspaceId: "default-workspace",
      title: res.title,
      description: res.description,
      sourceType: res.sourceType,
      fileUrl: res.fileUrl,
      provider: "manual",
      categoryId: categoryId,
      iconEmoji: res.iconEmoji,
      currentVersion: res.currentVersion,
      thumbnailUrl: res.thumbnailUrl || null,
    }).onConflictDoNothing();

    for (const tagId of tagIds) {
      await db.insert(resourceTag).values({
        resourceId: resId,
        tagId,
      }).onConflictDoNothing();
    }

    console.log(`  📦 Resource: ${res.iconEmoji} ${res.title}`);
  }

  // 4. Initialize and seed Livechat templates
  const { initLivechatTableAndSeed } = await import("./migrate-livechat");
  await initLivechatTableAndSeed();

  console.log("\n🎉 Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
