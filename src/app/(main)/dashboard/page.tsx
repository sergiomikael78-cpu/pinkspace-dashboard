import Link from "next/link";
import { prisma } from "@/lib/db";
import ResourceCard from "@/components/ResourceCardClientWrapper";
import { Activity, Clock, Download, ArrowRight, FolderOpen, Star } from "lucide-react";
import { CATEGORIES } from "@/config/categories";

export default async function DashboardPage() {
  const recentResources = await prisma.resource.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  const popularResources = await prisma.resource.findMany({
    take: 3,
    orderBy: { downloadCount: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  const totalResources = await prisma.resource.count();
  const totalCategories = CATEGORIES.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-pink-600 p-8 shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Star size={120} />
        </div>
        <div className="relative z-10 text-white max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back to Pinkspace</h2>
          <p className="text-pink-100 mb-6 font-medium">Your personal developer command center is ready.</p>
          <div className="flex gap-4">
            <Link href="/resources" className="bg-white text-pink-600 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-pink-50 transition-colors inline-flex items-center gap-2">
              <FolderOpen size={18} /> Browse Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Resources", value: totalResources, icon: FolderOpen, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Categories", value: totalCategories, icon: Layers, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Total Downloads", value: "142", icon: Download, color: "text-green-500", bg: "bg-green-50" },
          { label: "Active Today", value: "3", icon: Activity, color: "text-pink-500", bg: "bg-pink-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs text-ink-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-ink-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
              <Clock size={20} className="text-pink-500" /> Recently Added
            </h3>
            <Link href="/resources" className="text-sm font-semibold text-pink-500 hover:text-pink-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
            <Star size={20} className="text-gold" /> Popular Resources
          </h3>
          
          <div className="space-y-3">
            {popularResources.map((resource) => (
              <div key={resource.id} className="glass-card p-4 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {resource.iconEmoji || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-ink-900 truncate">{resource.title}</h4>
                  <p className="text-xs text-ink-500 truncate">{resource.category.name}</p>
                  <Link href={`/resources/${resource.category.slug}#${resource.id}`} className="text-[11px] font-semibold text-pink-500 hover:underline mt-1 inline-block">
                    View detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to define a small wrapper since ResourceCard expects to be interactive and trigger PreviewModal.
// We'll create `ResourceCardClientWrapper.tsx` next.
function Layers(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>;
}
