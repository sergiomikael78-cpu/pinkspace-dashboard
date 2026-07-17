import { Search } from "lucide-react";

export default function SearchSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Search</h2>
        <p className="text-gray-500 text-sm">Configure search behavior and suggestions.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <Search size={48} className="text-pink-200 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Coming Soon</h3>
        <p className="max-w-md text-sm">
          Advanced search configurations, including recent searches and autocomplete toggles, will be integrated shortly.
        </p>
      </div>
    </div>
  );
}
