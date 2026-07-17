import { Info } from "lucide-react";

export default function AboutSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">About</h2>
        <p className="text-gray-500 text-sm">System information and version details.</p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-lg mb-2">
          <Info size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Pinkspace Workspace</h3>
        <p className="text-gray-500">Version 1.0.0 (Beta)</p>
        
        <div className="w-full h-px bg-gray-100 my-4" />
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-left w-full max-w-sm">
          <div>
            <p className="text-sm text-gray-500">Framework</p>
            <p className="font-medium text-gray-800">Next.js 14</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Database</p>
            <p className="font-medium text-gray-800">SQLite (Prisma)</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Author</p>
            <p className="font-medium text-gray-800">Mila Workflow</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">License</p>
            <p className="font-medium text-gray-800">MIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
