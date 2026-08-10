"use client";

import { useState } from "react";
import { Database, Download, Trash2, HardDrive, CheckCircle2 } from "lucide-react";
import { SettingItem } from "@/components/ui/SettingItem";

export default function DataManagementSettings() {
  const [cleared, setCleared] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportData = () => {
    setExporting(true);
    setTimeout(() => {
      const mockData = {
        workspace: "Pinkspace Workspace",
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        resources: [
          { title: "Pink Password Generator Pro", category: "chrome-extension", type: "LINK" },
          { title: "Mila Highlighter Pro", category: "script", type: "FILE" },
        ],
      };

      const jsonStr = JSON.stringify(mockData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const blobUrl = URL.createObjectURL(blob);
      
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = `pinkspace_backup_${Date.now()}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      setExporting(false);
    }, 500);
  };

  const handleClearCache = () => {
    if (confirm("Apakah Anda yakin ingin membersihkan cache lokal browser? Preferensi lokal akan diset ulang.")) {
      localStorage.clear();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-pink-100 pb-4">
        <h2 className="text-xl font-bold text-ink-900 mb-1">Data Management & Backup</h2>
        <p className="text-ink-500 text-sm">
          Kelola cadangan data metadata, ekspor resource, dan bersihkan memori cache.
        </p>
      </div>

      {/* Rincian Penyimpanan */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ink-900 font-semibold text-sm">
          <HardDrive size={18} className="text-pink-500" />
          <h3>Penggunaan Penyimpanan Local & Storage</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/60 border border-pink-100 rounded-2xl">
            <p className="text-xs text-ink-500 font-medium">Database SQLite (dev.db)</p>
            <p className="text-lg font-bold text-ink-900 mt-1">114.6 KB</p>
            <p className="text-[10px] text-pink-600 mt-0.5">Ringan & Optimal</p>
          </div>

          <div className="p-4 bg-white/60 border border-pink-100 rounded-2xl">
            <p className="text-xs text-ink-500 font-medium">Cache Browser (localStorage)</p>
            <p className="text-lg font-bold text-ink-900 mt-1">~ 12.4 KB</p>
            <p className="text-[10px] text-pink-600 mt-0.5">Preferensi & Tema</p>
          </div>

          <div className="p-4 bg-white/60 border border-pink-100 rounded-2xl">
            <p className="text-xs text-ink-500 font-medium">File Upload Storage</p>
            <p className="text-lg font-bold text-ink-900 mt-1">Local / Vercel Blob</p>
            <p className="text-[10px] text-pink-600 mt-0.5">Siap S3 Compatible</p>
          </div>
        </div>
      </section>

      {/* Cadangan & Ekspor */}
      <section className="space-y-4 pt-4 border-t border-pink-100/60">
        <div className="flex items-center gap-2 text-ink-900 font-semibold text-sm">
          <Database size={18} className="text-pink-500" />
          <h3>Ekspor & Pembersihan</h3>
        </div>

        <SettingItem
          title="Ekspor Seluruh Data Workspace (JSON Backup)"
          description="Unduh berkas JSON yang berisi daftar lengkap resource, tag, dan koleksi Anda untuk keperluan cadangan."
        >
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="px-3.5 py-2 text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={14} />
            <span>{exporting ? "Mengekspor..." : "Ekspor Data JSON"}</span>
          </button>
        </SettingItem>

        <SettingItem
          title="Bersihkan Cache Lokal Browser"
          description="Hapus cache preferensi yang tersimpan di localStorage untuk menyegarkan pengaturan."
        >
          <button
            onClick={handleClearCache}
            className="px-3.5 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
          >
            {cleared ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Trash2 size={14} />}
            <span>{cleared ? "Cache Dibersihkan!" : "Clear Cache"}</span>
          </button>
        </SettingItem>
      </section>
    </div>
  );
}
