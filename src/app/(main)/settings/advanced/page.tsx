"use client";

import { useState } from "react";
import { Wrench, Terminal, Bug, FlaskConical } from "lucide-react";
import { SettingItem } from "@/components/ui/SettingItem";

export default function AdvancedSettings() {
  const [debugMode, setDebugMode] = useState(false);
  const [experimentalImport, setExperimentalImport] = useState(false);
  const [queryLogger, setQueryLogger] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-pink-100 pb-4">
        <h2 className="text-xl font-bold text-ink-900 mb-1">Advanced Developer Options</h2>
        <p className="text-ink-500 text-sm">
          Pengaturan khusus pengembang, mode debug, dan fitur eksperimental.
        </p>
      </div>

      {/* Experimental Feature Flags */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ink-900 font-semibold text-sm">
          <FlaskConical size={18} className="text-pink-500" />
          <h3>Experimental Feature Flags</h3>
        </div>

        <SettingItem
          title="Auto-Import Provider Plugins"
          description="Aktifkan listener otomatis untuk impor otomatis dari GitHub, Chrome Web Store, dan VS Code Marketplace."
          badge="Eksperimental"
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={experimentalImport}
              onChange={(e) => setExperimentalImport(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </SettingItem>
      </section>

      {/* Debugging & Telemetry */}
      <section className="space-y-4 pt-4 border-t border-pink-100/60">
        <div className="flex items-center gap-2 text-ink-900 font-semibold text-sm">
          <Bug size={18} className="text-pink-500" />
          <h3>Pengujian & Log Kueri</h3>
        </div>

        <SettingItem
          title="Aktifkan Console Debug Mode"
          description="Cetak rincian siklus Theme Engine, `AmbientLayer` frame rate, dan status komponen di Web Console."
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </SettingItem>

        <SettingItem
          title="Log Waktu Eksekusi Kueri Drizzle"
          description="Tampilkan waktu respon kueri database SQLite/Postgres pada terminal server."
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={queryLogger}
              onChange={(e) => setQueryLogger(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </SettingItem>
      </section>
    </div>
  );
}
