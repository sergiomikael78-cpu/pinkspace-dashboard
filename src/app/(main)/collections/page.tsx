"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Construction, Sparkles, Home, Library, Loader2 } from "lucide-react";

export default function CollectionsPage() {
  const [stage, setStage] = useState<"loading" | "reveal">("loading");

  useEffect(() => {
    // Stage 1: Show a fake "loading collections" animation
    const timer = setTimeout(() => {
      setStage("reveal");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Stage 1: Fake Loading */}
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Spinning ring */}
            <div className="relative mx-auto w-20 h-20 mb-6">
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-pink-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-1 rounded-xl border-2 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Library size={28} className="text-pink-500" />
              </div>
            </div>

            <motion.p
              className="text-sm font-bold text-ink-700"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Membuka Collections...
            </motion.p>
            <p className="text-xs text-ink-400 mt-1">Memuat koleksi resource kamu</p>

            {/* Fake progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-pink-400"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Stage 2: Reveal the "Coming Soon" message */}
        {stage === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md mx-auto px-6"
          >
            {/* Animated Icon */}
            <motion.div
              className="relative mx-auto w-24 h-24 mb-8"
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <div
                className="absolute inset-0 rounded-3xl rotate-6"
                style={{
                  background: "linear-gradient(135deg, var(--pink-400), var(--pink-600))",
                  opacity: 0.2,
                }}
              />
              <div
                className="absolute inset-0 rounded-3xl -rotate-3"
                style={{
                  background: "linear-gradient(135deg, var(--pink-400), var(--pink-600))",
                  opacity: 0.1,
                }}
              />
              <div
                className="relative w-full h-full rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--pink-500), var(--pink-600))",
                }}
              >
                <Construction size={40} className="text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={16} className="text-yellow-800" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.h1
              className="text-3xl font-extrabold text-ink-900 mb-3 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Oops, kamu tersesat! 🗺️
            </motion.h1>
            <motion.p
              className="text-base text-ink-500 mb-2 leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Fitur <span className="font-bold text-pink-600">Collections</span> sedang dalam pengerjaan.
            </motion.p>
            <motion.p
              className="text-sm text-ink-400 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              Tim kami sedang menyiapkan sesuatu yang istimewa untukmu.
              <br />
              Sabar ya, sebentar lagi selesai! ✨
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="w-full max-w-xs mx-auto mb-8"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-ink-400 mb-2">
                <span>Progress</span>
                <span className="text-pink-500">Coming Soon</span>
              </div>
              <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--pink-400), var(--pink-600))",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "35%" }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,111,181,0.35)]"
                style={{
                  background: "linear-gradient(135deg, var(--pink-500) 0%, var(--pink-600) 100%)",
                }}
              >
                <Home size={18} />
                Kembali ke Dashboard
              </Link>

              <p className="mt-4 text-xs text-ink-300">
                Atau tekan{" "}
                <kbd className="px-1.5 py-0.5 bg-pink-50 rounded text-[10px] font-mono border border-pink-100">
                  Ctrl + K
                </kbd>{" "}
                untuk mencari resource lainnya
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
