"use server";

import { db } from "@/lib/db";
import { livechatTemplate as livechatTemplateTable } from "@/lib/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLivechatTemplatesAction() {
  try {
    const templates = await db.query.livechatTemplate.findMany({
      orderBy: [desc(livechatTemplateTable.isFavorite), asc(livechatTemplateTable.sortOrder), desc(livechatTemplateTable.createdAt)],
    });
    return { success: true, data: templates };
  } catch (error: any) {
    console.error("Error fetching livechat templates:", error);
    return { success: false, error: error.message || "Failed to fetch templates", data: [] };
  }
}

export async function createLivechatTemplateAction(data: {
  title: string;
  kodePk: string;
  content: string;
  categoryTag?: string;
  isFavorite?: boolean;
}) {
  try {
    if (!data.title?.trim() || !data.kodePk?.trim() || !data.content?.trim()) {
      return { success: false, error: "Judul, Kode PK, dan isi template balasan wajib diisi!" };
    }

    const newId = "lt-" + crypto.randomUUID();

    await db.insert(livechatTemplateTable).values({
      id: newId,
      workspaceId: "default-workspace",
      title: data.title.trim(),
      kodePk: data.kodePk.trim(),
      content: data.content.trim(),
      categoryTag: data.categoryTag?.trim() || "Umum",
      isFavorite: data.isFavorite ?? false,
      usageCount: 0,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/resources/template-livechat");
    revalidatePath("/template-livechat");
    revalidatePath("/", "layout");

    return { success: true, id: newId };
  } catch (error: any) {
    console.error("Error creating livechat template:", error);
    return { success: false, error: error.message || "Failed to create template" };
  }
}

export async function updateLivechatTemplateAction(
  id: string,
  data: {
    title: string;
    kodePk: string;
    content: string;
    categoryTag?: string;
    isFavorite?: boolean;
  }
) {
  try {
    if (!data.title?.trim() || !data.kodePk?.trim() || !data.content?.trim()) {
      return { success: false, error: "Judul, Kode PK, dan isi template balasan wajib diisi!" };
    }

    await db.update(livechatTemplateTable)
      .set({
        title: data.title.trim(),
        kodePk: data.kodePk.trim(),
        content: data.content.trim(),
        categoryTag: data.categoryTag?.trim() || "Umum",
        isFavorite: data.isFavorite ?? false,
        updatedAt: new Date(),
      })
      .where(eq(livechatTemplateTable.id, id));

    revalidatePath("/resources/template-livechat");
    revalidatePath("/template-livechat");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating livechat template:", error);
    return { success: false, error: error.message || "Failed to update template" };
  }
}

export async function deleteLivechatTemplateAction(id: string) {
  try {
    await db.delete(livechatTemplateTable).where(eq(livechatTemplateTable.id, id));

    revalidatePath("/resources/template-livechat");
    revalidatePath("/template-livechat");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting livechat template:", error);
    return { success: false, error: error.message || "Failed to delete template" };
  }
}

export async function toggleFavoriteLivechatTemplateAction(id: string, isFavorite: boolean) {
  try {
    await db.update(livechatTemplateTable)
      .set({ isFavorite, updatedAt: new Date() })
      .where(eq(livechatTemplateTable.id, id));

    revalidatePath("/resources/template-livechat");
    revalidatePath("/template-livechat");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling favorite template:", error);
    return { success: false, error: "Failed to update favorite" };
  }
}

export async function incrementCopyCountAction(id: string) {
  try {
    await db.update(livechatTemplateTable)
      .set({
        usageCount: sql`${livechatTemplateTable.usageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(livechatTemplateTable.id, id));

    return { success: true };
  } catch (error: any) {
    console.error("Error incrementing copy count:", error);
    return { success: false };
  }
}

export async function importLivechatTemplatesAction(
  templates: Array<{
    title: string;
    kodePk: string;
    content: string;
    categoryTag?: string;
  }>
) {
  try {
    if (!Array.isArray(templates) || templates.length === 0) {
      return { success: false, error: "Format file import tidak valid atau kosong." };
    }

    let importedCount = 0;
    for (const item of templates) {
      if (item.title && item.kodePk && item.content) {
        await db.insert(livechatTemplateTable).values({
          id: "lt-" + crypto.randomUUID(),
          workspaceId: "default-workspace",
          title: item.title.trim(),
          kodePk: item.kodePk.trim(),
          content: item.content.trim(),
          categoryTag: item.categoryTag?.trim() || "Umum",
          isFavorite: false,
          usageCount: 0,
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        importedCount++;
      }
    }

    revalidatePath("/resources/template-livechat");
    revalidatePath("/template-livechat");
    revalidatePath("/", "layout");

    return { success: true, count: importedCount };
  } catch (error: any) {
    console.error("Error importing templates:", error);
    return { success: false, error: error.message || "Failed to import templates" };
  }
}
