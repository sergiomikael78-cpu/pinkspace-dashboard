"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsNavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function SettingsNavLink({ href, icon: Icon, label }: SettingsNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
        isActive
          ? "text-white"
          : "hover:bg-black/5"
      }`}
      style={{
        color: isActive ? "#fff" : "var(--color-ink-700)"
      }}
    >
      {isActive && (
        <motion.div
          layoutId="settings-active-bg"
          className="absolute inset-0 rounded-xl z-0"
          style={{ background: "var(--color-primary)" }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon size={18} className="relative z-10" />
      <span className="relative z-10 font-semibold">{label}</span>
    </Link>
  );
}
