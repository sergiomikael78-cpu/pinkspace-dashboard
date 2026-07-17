"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResource } from "@/app/actions/resource";
import { Loader2, UploadCloud, Link as LinkIcon, PlusCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export default function CreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceType, setSourceType] = useState<"FILE" | "LINK">("FILE");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createResource(formData);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Failed to create resource.");
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
            placeholder="e.g. Pink Password Generator"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-semibold text-ink-900">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm appearance-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
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
          placeholder="What is this resource about?"
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
            placeholder="e.g. 🔑"
            defaultValue="📦"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="currentVersion" className="text-sm font-semibold text-ink-900">Version</label>
          <input
            id="currentVersion"
            name="currentVersion"
            type="text"
            defaultValue="1.0.0"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tags" className="text-sm font-semibold text-ink-900">Tags (comma separated)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="e.g. utility, tool"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-pink-100/50">
        <div className="flex gap-4 mb-4">
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "FILE" ? "border-pink-500 bg-pink-50/50 text-pink-700 font-bold" : "border-pink-100 bg-white text-ink-500 hover:bg-pink-50"}`}>
            <input 
              type="radio" 
              name="sourceType" 
              value="FILE" 
              checked={sourceType === "FILE"} 
              onChange={() => setSourceType("FILE")} 
              className="hidden" 
            />
            <UploadCloud size={18} /> Upload File
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "LINK" ? "border-pink-500 bg-pink-50/50 text-pink-700 font-bold" : "border-pink-100 bg-white text-ink-500 hover:bg-pink-50"}`}>
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
          <div className="space-y-1.5">
            <label htmlFor="file" className="text-sm font-semibold text-ink-900">Select File</label>
            <input
              id="file"
              name="file"
              type="file"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <label htmlFor="externalUrl" className="text-sm font-semibold text-ink-900">URL</label>
            <input
              id="externalUrl"
              name="externalUrl"
              type="url"
              required
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
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-pink-600 shadow-sm hover:shadow-md transition-all disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
          {isSubmitting ? "Saving..." : "Save Resource"}
        </button>
      </div>
    </form>
  );
}
