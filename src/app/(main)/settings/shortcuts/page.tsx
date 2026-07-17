import { Keyboard } from "lucide-react";

export default function ShortcutsSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Keyboard Shortcuts</h2>
        <p className="text-gray-500 text-sm">Speed up your workflow with hotkeys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder List */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Universal Search</span>
          <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-500 shadow-sm font-mono">Cmd + K</kbd>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Toggle Sidebar</span>
          <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-500 shadow-sm font-mono">Cmd + B</kbd>
        </div>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Custom keybindings will be supported in a future update.</p>
      </div>
    </div>
  );
}
