/**
 * Storage Provider Abstraction Layer
 * 
 * MVP: Files are served from /public/downloads/ (local filesystem).
 * Future: Switch to S3, Vercel Blob, Cloudflare R2, or Supabase Storage
 * by implementing the StorageProvider interface.
 * No application code changes required — only swap the provider.
 */

export interface StorageProvider {
  /** Get a public URL for downloading a resource file */
  getDownloadUrl(filePath: string): string;
  
  /** Get a public URL for a thumbnail image */
  getThumbnailUrl(filePath: string): string;
  
  /** Upload a file (future - Admin Panel) */
  uploadFile?(file: File, path: string): Promise<string>;
  
  /** Delete a file (future - Admin Panel) */
  deleteFile?(path: string): Promise<void>;
}

/**
 * Local filesystem storage provider.
 * Serves files from Next.js /public directory.
 */
class LocalStorageProvider implements StorageProvider {
  getDownloadUrl(filePath: string): string {
    // filePath is already relative to /public (e.g. "/downloads/script/Mila-1.user.js")
    return filePath;
  }

  getThumbnailUrl(filePath: string): string {
    return filePath;
  }
}

// Export the active provider — swap this to change storage backend
export const storage: StorageProvider = new LocalStorageProvider();
