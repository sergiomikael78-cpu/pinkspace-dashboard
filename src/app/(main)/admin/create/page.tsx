import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import CreateForm from "./CreateForm";

export default async function CreateResourcePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-pink-500 transition-colors">
        <ArrowLeft size={16} /> Back to Admin Panel
      </Link>

      <div className="flex items-center gap-4 pb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md bg-gradient-to-br from-green-500 to-green-600">
          <PlusCircle size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Add New Resource</h1>
          <p className="text-sm text-ink-500">Upload a new file or add an external link to your workspace.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <CreateForm categories={categories} />
      </div>
    </div>
  );
}
