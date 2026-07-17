"use server";

import { prisma } from "@/lib/db";
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

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error("Category not found");

    if (sourceType === "FILE" && file && file.size > 0) {
      fileUrl = await uploadFileLocal(file, category.slug);
    }

    // Process Tags
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        categoryId,
        sourceType,
        fileUrl,
        externalUrl: sourceType === "LINK" ? externalUrl : null,
        iconEmoji: iconEmoji || "📦",
        currentVersion,
        workspaceId: "default-workspace", // Using the single workspace ID seeded in DB
        tags: {
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
    console.error("Failed to create resource:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteResource(id: string) {
  try {
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new Error("Resource not found");

    // Delete associated file if it exists
    if (resource.sourceType === "FILE" && resource.fileUrl) {
      await deleteFileLocal(resource.fileUrl);
    }

    // Delete from DB (Prisma cascading will handle tags mapping if configured, 
    // but ResourceTag has onDelete: Cascade already)
    await prisma.resource.delete({ where: { id } });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/resources");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
