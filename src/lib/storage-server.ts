import fs from "fs/promises";
import path from "path";

/**
 * Server-only storage operations.
 * DO NOT import this in Client Components.
 */
export async function uploadFileLocal(file: File, categorySlug: string): Promise<string> {
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define target directory: public/downloads/<categorySlug>
  const uploadDir = path.join(process.cwd(), "public", "downloads", categorySlug);
  
  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Use original filename but sanitize it slightly
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  // Add timestamp to prevent overwriting
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  // Return the public URL path
  return `/downloads/${categorySlug}/${fileName}`;
}

export async function deleteFileLocal(fileUrl: string): Promise<void> {
  // fileUrl format: /downloads/category/filename.ext
  if (!fileUrl.startsWith("/downloads/")) return;

  const absolutePath = path.join(process.cwd(), "public", fileUrl);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    console.error("Failed to delete file:", error);
    // Ignore if file doesn't exist anymore
  }
}
