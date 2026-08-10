"use server";

import { db } from "@/lib/db";
import { resource as resourceTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(resourceId: string, isFavorite: boolean) {
  try {
    await db.update(resourceTable)
      .set({ isFavorite, updatedAt: new Date() })
      .where(eq(resourceTable.id, resourceId));
    
    // Revalidate the main layout or specific paths so that lists update
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to toggle favorite" };
  }
}
