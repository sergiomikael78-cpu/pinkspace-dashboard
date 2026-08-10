"use server";

import { db } from "@/lib/db";
import { category as categoryTable, resource as resourceTable, tag as tagTable, resourceTag as resourceTagTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { uploadFileLocal, deleteFileLocal } from "@/lib/storage-server";
import { revalidatePath } from "next/cache";

export async function createResource(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const sourceType = formData.get("sourceType") as "FILE" | "LINK";
    const externalUrl = formData.get("externalUrl") as string | null;
    const iconEmoji = formData.get("iconEmoji") as string | null;
    const currentVersion = (formData.get("currentVersion") as string) || "1.0.0";
    const tagsInput = formData.get("tags") as string; // comma separated
    
    // File upload
    const file = formData.get("file") as File | null;
    let fileUrl = null;

    const category = await db.query.category.findFirst({
      where: eq(categoryTable.id, categoryId),
    });
    if (!category) throw new Error("Category not found");

    if (sourceType === "FILE" && file && file.size > 0) {
      fileUrl = await uploadFileLocal(file, category.slug);
    }

    // Process Tags
    const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

    const newResourceId = crypto.randomUUID();

    // Insert resource
    await db.insert(resourceTable).values({
      id: newResourceId,
      title,
      description,
      categoryId,
      sourceType,
      fileUrl,
      externalUrl: sourceType === "LINK" ? externalUrl : null,
      iconEmoji: iconEmoji || "📦",
      currentVersion,
      workspaceId: "default-workspace",
    });

    // Connect/Create tags
    for (const tagName of tags) {
      let tagObj = await db.query.tag.findFirst({
        where: eq(tagTable.name, tagName),
      });

      if (!tagObj) {
        const tagId = crypto.randomUUID();
        await db.insert(tagTable).values({ id: tagId, name: tagName }).onConflictDoNothing();
        tagObj = await db.query.tag.findFirst({
          where: eq(tagTable.name, tagName),
        });
      }

      if (tagObj) {
        await db.insert(resourceTagTable).values({
          resourceId: newResourceId,
          tagId: tagObj.id,
        }).onConflictDoNothing();
      }
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    revalidatePath(`/resources/${category.slug}`);

    return { success: true, id: newResourceId };
  } catch (error: any) {
    console.error("Failed to create resource:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteResource(id: string) {
  try {
    const res = await db.query.resource.findFirst({
      where: eq(resourceTable.id, id),
    });
    if (!res) throw new Error("Resource not found");

    // Delete associated file if it exists
    if (res.sourceType === "FILE" && res.fileUrl) {
      await deleteFileLocal(res.fileUrl);
    }

    // Delete from DB
    await db.delete(resourceTable).where(eq(resourceTable.id, id));

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
