import { prisma } from "@/lib/db";
import ResourceCard from "@/components/ResourceCardClientWrapper";
import { HeartCrack, Heart } from "lucide-react";

export default async function FavoritesPage() {
  const favoriteResources = await prisma.resource.findMany({
    where: { isFavorite: true },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 border-b border-pink-100 pb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md bg-gradient-to-br from-pink-500 to-pink-600">
          <Heart size={24} className="fill-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900 mb-1">My Favorites</h1>
          <p className="text-ink-500">Resources you have marked as favorite.</p>
        </div>
      </div>

      {favoriteResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoriteResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-ink-300">
          <HeartCrack size={48} className="mb-4 text-pink-200" />
          <h3 className="text-lg font-bold text-ink-900 mb-1">No favorites yet</h3>
          <p className="text-sm">Click the heart icon on any resource to add it here.</p>
        </div>
      )}
    </div>
  );
}
