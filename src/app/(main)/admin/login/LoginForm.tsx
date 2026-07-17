"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Loader2, KeyRound, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await login(formData);

    if (res.success) {
      router.push("/admin");
      router.refresh(); // Refresh to ensure middleware state is updated on client
    } else {
      setError(res.error || "Login gagal.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center animate-in shake">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-ink-900 block">
          Kata Sandi
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <KeyRound size={18} className="text-ink-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Masukkan kata sandi..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-100 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-[0_4px_15px_rgba(255,111,181,0.25)] hover:shadow-[0_6px_20px_rgba(255,111,181,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group"
        style={{ background: "linear-gradient(135deg, var(--pink-500), var(--pink-600))" }}
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            Masuk <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
