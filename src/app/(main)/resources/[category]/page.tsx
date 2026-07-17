import { prisma } from "@/lib/db";
import ResourceCard from "@/components/ResourceCardClientWrapper";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/config/categories";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  const category = await prisma.category.findFirst({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  const resources = await prisma.resource.findMany({
    where: { categoryId: category.id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { title: "asc" },
  });

  const configCat = CATEGORIES.find(c => c.slug === category.slug);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-ink-300 hover:text-pink-500 transition-colors">
        <ArrowLeft size={16} /> Back to all resources
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-pink-100 pb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md"
            style={{ background: configCat?.gradient || category.colorAccent || "var(--pink-500)" }}
          >
            {category.icon || "📂"}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-ink-900 mb-1">{category.name}</h1>
            <p className="text-ink-500 max-w-2xl">{category.description || `Browse resources in ${category.name}`}</p>
          </div>
        </div>
        <div className="text-sm font-medium text-ink-500 bg-white px-4 py-2 rounded-xl border border-pink-100 shadow-sm">
          {resources.length} resource{resources.length !== 1 ? 's' : ''}
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-ink-300">
          <SearchX size={48} className="mb-4 text-pink-200" />
          <h3 className="text-lg font-bold text-ink-900 mb-1">No resources found</h3>
          <p className="text-sm">This category is currently empty.</p>
        </div>
      )}
    </div>
  );
}
