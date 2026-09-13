export const dynamic = "force-dynamic";

import Sidebar from "@/components/Sidebar";
import SearchPalette from "@/components/SearchPalette";
import { db } from "@/lib/db";
import { SEED_RESOURCES } from "@/config/seed-data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories with resources to count
  const categories = await db.query.category.findMany({
    with: {
      resources: true,
    },
  });
  
  // Transform to { slug: count }
  const resourceCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    resourceCounts[cat.slug] = cat.resources ? cat.resources.length : 0;
  });

  // Fetch livechat templates count and add to search
  const livechatTemplates = await db.query.livechatTemplate.findMany();
  resourceCounts["template-livechat"] = livechatTemplates.length;

  // Prepare searchable resources
  const searchResources = await db.query.resource.findMany({
    with: {
      category: true,
    },
  });

  const formattedSearchResources = searchResources.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    categorySlug: r.category ? r.category.slug : "",
    iconEmoji: r.iconEmoji || "📦"
  }));

  livechatTemplates.forEach((lt) => {
    formattedSearchResources.push({
      id: lt.id,
      title: `[${lt.kodePk}] ${lt.title}`,
      description: lt.content,
      categorySlug: "template-livechat",
      iconEmoji: "💬",
    });
  });

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar resourceCounts={resourceCounts} />
      
      <div className="flex-1 flex flex-col pl-[72px] lg:pl-[260px] transition-all duration-300">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/40 backdrop-blur-md border-b border-pink-100/30">
          <div className="flex-1 max-w-xl">
            <SearchPalette resources={formattedSearchResources} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-200 overflow-hidden">
                <img src="/downloads/assets/mila_sticker.png" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-bold text-ink-900 leading-none">Mila.hu</p>
                <p className="text-[10px] text-ink-500">Workspace Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
