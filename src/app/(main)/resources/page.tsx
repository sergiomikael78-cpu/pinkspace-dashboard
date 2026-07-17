import { prisma } from "@/lib/db";
import ResourceCard from "@/components/ResourceCardClientWrapper";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { CATEGORIES } from "@/config/categories";

export default async function ResourcesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const resourcesByCategory = await Promise.all(
    categories.map(async (category) => {
      const resources = await prisma.resource.findMany({
        where: { categoryId: category.id },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { title: "asc" },
      });
      return { category, resources };
    })
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="border-b border-pink-100 pb-6">
        <h1 className="text-3xl font-extrabold text-ink-900 mb-2">All Resources</h1>
        <p className="text-ink-500">Browse all available resources in your workspace.</p>
      </div>

      <div className="space-y-12">
        {resourcesByCategory.map(({ category, resources }) => {
          if (resources.length === 0) return null;
          
          return (
            <section key={category.id} id={category.slug} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm"
                  style={{ background: CATEGORIES.find(c => c.slug === category.slug)?.gradient || category.colorAccent || "var(--pink-500)" }}
                >
                  {category.icon || "📂"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
                    <Link href={`/resources/${category.slug}`} className="hover:text-pink-600 transition-colors">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-ink-500">{resources.length} resources</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
