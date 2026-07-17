import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../src/config/categories";
import { SEED_RESOURCES } from "../src/config/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Pinkspace database...\n");

  // 1. Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "default-workspace" },
    update: {},
    create: {
      id: "default-workspace",
      name: "My Workspace",
    },
  });
  console.log(`✅ Workspace created: ${workspace.name}`);

  // 2. Seed categories from central config
  const categoryMap = new Map<string, string>(); // slug -> db id
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: {
        workspaceId_slug: {
          workspaceId: workspace.id,
          slug: cat.slug,
        },
      },
      update: {
        name: cat.displayName,
        description: cat.description,
        icon: cat.icon,
        colorAccent: cat.accentColor,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        workspaceId: workspace.id,
        name: cat.displayName,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        colorAccent: cat.accentColor,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(cat.slug, category.id);
    console.log(`  📁 Category: ${cat.icon} ${cat.displayName}`);
  }

  // 3. Seed resources
  console.log("");
  for (const res of SEED_RESOURCES) {
    const categoryId = categoryMap.get(res.categorySlug);
    if (!categoryId) {
      console.warn(`  ⚠️  Category not found for slug: ${res.categorySlug}`);
      continue;
    }

    // Create or find tags
    const tagIds: string[] = [];
    for (const tagName of res.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      tagIds.push(tag.id);
    }

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        workspaceId: workspace.id,
        title: res.title,
        description: res.description,
        sourceType: res.sourceType,
        fileUrl: res.fileUrl,
        provider: "manual",
        categoryId: categoryId,
        iconEmoji: res.iconEmoji,
        currentVersion: res.currentVersion,
        thumbnailUrl: res.thumbnailUrl || null,
        tags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });

    console.log(`  📦 Resource: ${res.iconEmoji} ${resource.title}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
