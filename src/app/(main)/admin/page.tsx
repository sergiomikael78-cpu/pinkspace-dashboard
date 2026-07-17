import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import DeleteButton from "./DeleteButton"; // We'll create this client component next
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const resources = await prisma.resource.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-ink-900 mb-1">Admin Panel</h1>
            <p className="text-ink-500">Manage all your workspace resources.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
          <Link
            href="/admin/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white font-bold rounded-xl shadow-sm hover:bg-pink-600 transition-colors"
          >
            <Plus size={18} /> Add Resource
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pink-50/50 text-ink-500 font-semibold border-b border-pink-100">
              <tr>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-pink-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{resource.iconEmoji || "📦"}</span>
                      <div>
                        <p className="font-bold text-ink-900">{resource.title}</p>
                        <p className="text-xs text-ink-400 line-clamp-1 max-w-[200px]">{resource.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-pink-100 text-pink-700">
                      {resource.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-ink-600">
                      {resource.sourceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-500 text-xs">
                    v{resource.currentVersion}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/edit/${resource.id}`} className="p-2 text-ink-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <DeleteButton id={resource.id} title={resource.title} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-400">
                    No resources found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
