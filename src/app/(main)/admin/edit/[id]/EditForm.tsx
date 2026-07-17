"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateResource } from "@/app/actions/resource-update"; // I need to create this server action
import { Loader2, UploadCloud, Link as LinkIcon, FileCode, Edit2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditFormProps {
  categories: Category[];
  initialData: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
    iconEmoji: string | null;
    currentVersion: string;
    tags: string;
  };
}

export default function EditForm({ categories, initialData }: EditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceType, setSourceType] = useState<"FILE" | "LINK">(initialData.sourceType as any);
  const [error, setError] = useState<string | null>(null);
  
  // Track if user wants to upload a new file, otherwise keep existing
  const [replaceFile, setReplaceFile] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("id", initialData.id);
    formData.append("replaceFile", replaceFile.toString());
    
    const res = await updateResource(formData);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Failed to update resource.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-semibold text-ink-900">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData.title}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-semibold text-ink-900">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData.categoryId}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-semibold text-ink-900">Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initialData.description}
          className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="iconEmoji" className="text-sm font-semibold text-ink-900">Icon / Emoji</label>
          <input
            id="iconEmoji"
            name="iconEmoji"
            type="text"
            defaultValue={initialData.iconEmoji || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="currentVersion" className="text-sm font-semibold text-ink-900">Version</label>
          <input
            id="currentVersion"
            name="currentVersion"
            type="text"
            defaultValue={initialData.currentVersion}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tags" className="text-sm font-semibold text-ink-900">Tags (comma separated)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={initialData.tags}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-pink-100/50">
        <div className="flex gap-4 mb-4">
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "FILE" ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold" : "border-pink-100 bg-white text-ink-500 hover:bg-pink-50"}`}>
            <input 
              type="radio" 
              name="sourceType" 
              value="FILE" 
              checked={sourceType === "FILE"} 
              onChange={() => setSourceType("FILE")} 
              className="hidden" 
            />
            <UploadCloud size={18} /> File
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "LINK" ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold" : "border-pink-100 bg-white text-ink-500 hover:bg-pink-50"}`}>
            <input 
              type="radio" 
              name="sourceType" 
              value="LINK" 
              checked={sourceType === "LINK"} 
              onChange={() => setSourceType("LINK")} 
              className="hidden" 
            />
            <LinkIcon size={18} /> External Link
          </label>
        </div>

        {sourceType === "FILE" ? (
          <div className="space-y-3">
            {!replaceFile && initialData.sourceType === "FILE" && initialData.fileUrl ? (
              <div className="flex items-center justify-between p-4 rounded-xl border border-pink-200 bg-pink-50">
                <div className="flex items-center gap-3 text-sm font-medium text-ink-700">
                  <FileCode size={20} className="text-pink-500" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{initialData.fileUrl.split('/').pop()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplaceFile(true)}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-pink-200 transition-colors"
                >
                  Replace File
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="file" className="text-sm font-semibold text-ink-900">Upload New File</label>
                  {initialData.sourceType === "FILE" && (
                    <button
                      type="button"
                      onClick={() => setReplaceFile(false)}
                      className="text-xs font-medium text-pink-500 hover:underline"
                    >
                      Keep existing file
                    </button>
                  )}
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  required={sourceType === "FILE" && replaceFile}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label htmlFor="externalUrl" className="text-sm font-semibold text-ink-900">URL</label>
            <input
              id="externalUrl"
              name="externalUrl"
              type="url"
              required
              defaultValue={initialData.externalUrl || ""}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
            />
          </div>
        )}
      </div>

      <div className="pt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-ink-600 hover:bg-pink-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm hover:shadow-md transition-all disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
          {isSubmitting ? "Updating..." : "Update Resource"}
        </button>
      </div>
    </form>
  );
}
