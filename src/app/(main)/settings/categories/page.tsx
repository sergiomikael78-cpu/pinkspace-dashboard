import { FolderTree } from "lucide-react";
import Link from "next/link";

export default function CategoriesSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Categories</h2>
        <p className="text-gray-500 text-sm">Manage category views and defaults.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <FolderTree size={48} className="text-pink-200 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Category Management</h3>
        <p className="max-w-md text-sm mb-6">
          To add, edit, or delete categories, please use the Admin Panel.
        </p>
        <Link 
          href="/admin" 
          className="px-6 py-2 bg-pink-50 text-pink-600 font-semibold rounded-xl hover:bg-pink-100 transition-colors"
        >
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
}
