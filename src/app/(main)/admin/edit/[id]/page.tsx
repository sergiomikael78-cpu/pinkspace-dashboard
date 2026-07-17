import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";
import EditForm from "./EditForm";
import { notFound } from "next/navigation";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!resource) {
    notFound();
  }

  // Transform resource into a flat structure for the form
  const flatResource = {
    ...resource,
    tags: resource.tags.map(t => t.tag.name).join(", "),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-pink-500 transition-colors">
        <ArrowLeft size={16} /> Back to Admin Panel
      </Link>

      <div className="flex items-center gap-4 pb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
          <Edit2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Edit Resource</h1>
          <p className="text-sm text-ink-500">Update details for {resource.title}</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <EditForm categories={categories} initialData={flatResource} />
      </div>
    </div>
  );
}
