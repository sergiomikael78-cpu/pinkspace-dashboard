"use server";

import { db } from "@/lib/db";
import { category as categoryTable, resource as resourceTable, tag as tagTable, resourceTag as resourceTagTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { uploadFileLocal, deleteFileLocal } from "@/lib/storage-server";
import { revalidatePath } from "next/cache";

export async function updateResource(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const sourceType = formData.get("sourceType") as "FILE" | "LINK";
    const externalUrl = formData.get("externalUrl") as string | null;
    const iconEmoji = formData.get("iconEmoji") as string | null;
    const currentVersion = (formData.get("currentVersion") as string) || "1.0.0";
    const tagsInput = formData.get("tags") as string; // comma separated
    const replaceFile = formData.get("replaceFile") === "true";
    
    // File upload
    const file = formData.get("file") as File | null;

    const existingResource = await db.query.resource.findFirst({
      where: eq(resourceTable.id, id),
    });
    if (!existingResource) throw new Error("Resource not found");

    const category = await db.query.category.findFirst({
      where: eq(categoryTable.id, categoryId),
    });
    if (!category) throw new Error("Category not found");

    let newFileUrl = existingResource.fileUrl;

    if (sourceType === "FILE" && replaceFile && file && file.size > 0) {
      newFileUrl = await uploadFileLocal(file, category.slug);
      if (existingResource.fileUrl) {
        await deleteFileLocal(existingResource.fileUrl);
      }
    } else if (sourceType === "LINK" && existingResource.fileUrl) {
      await deleteFileLocal(existingResource.fileUrl);
      newFileUrl = null;
    }

    // Process Tags
    const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];

    // Update resource details
    await db.update(resourceTable)
      .set({
        title,
        description,
        categoryId,
        sourceType,
        fileUrl: sourceType === "FILE" ? newFileUrl : null,
        externalUrl: sourceType === "LINK" ? externalUrl : null,
        iconEmoji: iconEmoji || "📦",
        currentVersion,
        updatedAt: new Date(),
      })
      .where(eq(resourceTable.id, id));

    // Clear old tags mapping for this resource
    await db.delete(resourceTagTable).where(eq(resourceTagTable.resourceId, id));

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
          resourceId: id,
          tagId: tagObj.id,
        }).onConflictDoNothing();
      }
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    revalidatePath(`/resources/${category.slug}`);

    return { success: true, id };
  } catch (error: any) {
    console.error("Failed to update resource:", error);
    return { success: false, error: error.message };
  }
}
