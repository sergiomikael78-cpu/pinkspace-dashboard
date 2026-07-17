import Link from "next/link";
import { SettingsSidebar } from "./SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--color-foreground)" }}>Settings</h1>
        <p style={{ color: "var(--color-ink-500)" }}>Manage your workspace preferences and appearance.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <SettingsSidebar />

        {/* Right Detail Panel */}
        <main className="flex-1 min-w-0 glass-card p-6 md:p-8 rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
