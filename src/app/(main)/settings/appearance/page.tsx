"use client";

import { useTheme } from "@/lib/theme-provider";
import { themes } from "@/config/themes";
import { ThemePreviewCard } from "./ThemePreviewCard";
import { IntensitySelector } from "./IntensitySelector";
import { Sparkles, Activity } from "lucide-react";

export default function AppearanceSettings() {
  const { 
    activeThemeId, 
    setTheme, 
    animationEnabled, 
    setAnimationEnabled,
    animationIntensity,
    setAnimationIntensity
  } = useTheme();

  return (
    <div className="space-y-10">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Appearance</h2>
        <p className="text-gray-500 text-sm">Customize the look and feel of your workspace.</p>
      </div>

      {/* Theme Selection */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-pink-500" />
          <h3 className="font-semibold text-gray-900">Theme Engine</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Choose a theme. Each theme comes with its own unique colors, gradients, and motion signature.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(themes).map((theme) => (
            <ThemePreviewCard
              key={theme.id}
              theme={theme}
              isActive={activeThemeId === theme.id}
              onSelect={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </section>

      {/* Animation Settings */}
      <section className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-pink-500" />
          <h3 className="font-semibold text-gray-900">Motion & Animation</h3>
        </div>
        
        <div className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Enable Animation</h4>
              <p className="text-sm text-gray-500 mt-0.5">Toggle all ambient particles and heavy motion effects.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={animationEnabled}
                onChange={(e) => setAnimationEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          {/* Intensity Selector */}
          <div>
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 mb-1">Animation Intensity</h4>
              <p className="text-sm text-gray-500">
                Adjust the amount of particles and motion. Low intensity is automatically selected if your system prefers reduced motion.
              </p>
            </div>
            <IntensitySelector 
              value={animationIntensity}
              onChange={setAnimationIntensity}
              disabled={!animationEnabled}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
