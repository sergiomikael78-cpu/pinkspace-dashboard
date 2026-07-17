"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Heart,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, type CategoryConfig } from "@/config/categories";

interface SidebarProps {
  resourceCounts?: Record<string, number>;
}

export default function Sidebar({ resourceCounts = {} }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (prefix: string) => pathname.startsWith(prefix);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resources", label: "All Resources", icon: FolderOpen },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/collections", label: "Collections", icon: Library },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-pink-100/50">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #FF6FB5 0%, #E8479C 100%)",
            boxShadow: "0 4px 12px rgba(255, 111, 181, 0.3)",
          }}
        >
          <Sparkles size={18} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <h1 className="text-base font-bold text-ink-900">Pinkspace</h1>
              <p className="text-[10px] text-ink-300 -mt-0.5">Dev Workspace</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-pink-500/10 text-pink-700"
                  : "text-ink-500 hover:bg-pink-50 hover:text-ink-700"
              }`}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 ${
                  active ? "text-pink-500" : "text-ink-300 group-hover:text-pink-400"
                }`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Categories Section */}
        {!collapsed && (
          <div className="pt-3">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-300 hover:text-ink-500 transition-colors"
            >
              <span>Categories</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  categoriesOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-0.5"
                >
                  {CATEGORIES.map((cat: CategoryConfig) => {
                    const active = isActivePrefix(`/resources/${cat.slug}`);
                    const count = resourceCounts[cat.slug] || 0;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/resources/${cat.slug}`}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                          active
                            ? "bg-pink-500/10 text-pink-700 font-medium"
                            : "text-ink-500 hover:bg-pink-50 hover:text-ink-700"
                        }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span className="flex-1 truncate">{cat.displayName}</span>
                        {count > 0 && (
                          <span className="text-[11px] text-ink-300 bg-pink-50 px-1.5 py-0.5 rounded-full">
                            {count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-pink-100/50 p-3 space-y-1">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            isActivePrefix("/admin")
              ? "bg-pink-500/10 text-pink-700"
              : "text-ink-500 hover:bg-pink-50 hover:text-ink-700"
          }`}
        >
          <Plus size={20} className="flex-shrink-0" />
          {!collapsed && <span>Admin Panel</span>}
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            isActive("/settings")
              ? "bg-pink-500/10 text-pink-700"
              : "text-ink-500 hover:bg-pink-50 hover:text-ink-700"
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-pink-200 shadow-sm flex items-center justify-center hover:bg-pink-50 transition-colors z-50"
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-pink-500" />
        ) : (
          <ChevronLeft size={12} className="text-pink-500" />
        )}
      </button>
    </motion.aside>
  );
}
