import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Decorative Mascot / Sticker */}
      <div className="absolute top-[15%] right-[10%] opacity-80 mix-blend-multiply floating-asset animate-[floatAsset_8s_ease-in-out_infinite]">
        <img src="/downloads/assets/mila_sticker.png" alt="" className="w-32 h-auto opacity-70 drop-shadow-md" />
      </div>
      <div className="absolute bottom-[20%] left-[10%] opacity-60 mix-blend-multiply floating-asset animate-[floatAsset_9s_ease-in-out_infinite_reverse]">
        <img src="/downloads/assets/flower.png" alt="" className="w-24 h-auto drop-shadow-sm" />
      </div>
      <div className="absolute top-[30%] left-[15%] opacity-50 mix-blend-multiply floating-asset animate-[floatAsset_10s_ease-in-out_infinite_1s]">
        <img src="/downloads/assets/bear.png" alt="" className="w-20 h-auto drop-shadow-sm" />
      </div>

      <div className="max-w-3xl w-full text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-pink-200 shadow-sm mb-8 text-[11px] font-bold uppercase tracking-widest text-pink-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          Command Center v1.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-ink-900 mb-6 drop-shadow-sm">
          Welcome to <br />
          <span className="shimmer-text">Pinkspace</span>
        </h1>
        
        <p className="text-lg md:text-xl text-ink-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate personal developer workspace. Manage your extensions, prompts, 
          blueprints, and tools in one beautiful, lightning-fast dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-300 ease-out bg-pink-500 rounded-2xl hover:bg-pink-600 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,111,181,0.35)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              Open Workspace <ArrowRight size={18} />
            </span>
          </Link>
          
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-ink-700 transition-all duration-300 ease-out bg-white/60 backdrop-blur-md border border-pink-200 rounded-2xl hover:bg-white hover:shadow-md"
          >
            Browse Resources
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-pink-100/50 pt-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Lightning Fast</h3>
              <p className="text-sm text-ink-500">Universal search & instant filtering powered by local indexing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Dynamic Taxonomy</h3>
              <p className="text-sm text-ink-500">Organize everything into completely customizable categories.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Future Proof</h3>
              <p className="text-sm text-ink-500">Built on Next.js 15, Prisma, and flexible storage abstractions.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
