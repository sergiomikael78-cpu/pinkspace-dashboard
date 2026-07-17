"use client";

import { 
  Palette, 
  LayoutGrid, 
  Search, 
  Heart, 
  FolderTree, 
  Download, 
  Gauge, 
  Database, 
  Keyboard, 
  Info 
} from "lucide-react";
import { SettingsNavLink } from "./SettingsNavLink";

export function SettingsSidebar() {
  const sections = [
    { name: "Appearance", path: "/settings/appearance", icon: Palette },
    { name: "Dashboard", path: "/settings/dashboard", icon: LayoutGrid },
    { name: "Search", path: "/settings/search", icon: Search },
    { name: "Favorites", path: "/settings/favorites", icon: Heart },
    { name: "Categories", path: "/settings/categories", icon: FolderTree },
    { name: "Downloads", path: "/settings/downloads", icon: Download },
    { name: "Performance", path: "/settings/performance", icon: Gauge },
    { name: "Data Management", path: "/settings/data", icon: Database },
    { name: "Shortcuts", path: "/settings/shortcuts", icon: Keyboard },
    { name: "About", path: "/settings/about", icon: Info },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-1">
      {sections.map((section) => (
        <SettingsNavLink 
          key={section.path} 
          href={section.path} 
          icon={section.icon} 
          label={section.name} 
        />
      ))}
    </aside>
  );
}
