"use server";

import { prisma } from "@/lib/db";
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

    const existingResource = await prisma.resource.findUnique({ where: { id } });
    if (!existingResource) throw new Error("Resource not found");

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error("Category not found");

    let newFileUrl = existingResource.fileUrl;

    if (sourceType === "FILE" && replaceFile && file && file.size > 0) {
      // User is replacing the file
      newFileUrl = await uploadFileLocal(file, category.slug);
      
      // Delete old file if it existed
      if (existingResource.fileUrl) {
        await deleteFileLocal(existingResource.fileUrl);
      }
    } else if (sourceType === "LINK" && existingResource.fileUrl) {
      // Changed from FILE to LINK, so delete old file
      await deleteFileLocal(existingResource.fileUrl);
      newFileUrl = null;
    }

    // Process Tags
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);

    // Update resource
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        sourceType,
        fileUrl: sourceType === "FILE" ? newFileUrl : null,
        externalUrl: sourceType === "LINK" ? externalUrl : null,
        iconEmoji: iconEmoji || "📦",
        currentVersion,
        // We delete all existing mappings and recreate them (simplest approach for tag updates)
        tags: {
          deleteMany: {},
          create: tags.map(tag => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag }
              }
            }
          }))
        }
      }
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    revalidatePath(`/resources/${category.slug}`);

    return { success: true, id: resource.id };
  } catch (error: any) {
    console.error("Failed to update resource:", error);
    return { success: false, error: error.message };
  }
}
