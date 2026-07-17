"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-pink-100 text-ink-600 font-bold rounded-xl shadow-sm hover:bg-pink-50 hover:text-pink-600 transition-colors disabled:opacity-50"
    >
      <LogOut size={18} /> Keluar
    </button>
  );
}
