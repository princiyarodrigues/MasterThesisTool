import { Search } from 'lucide-react';

export function SearchBar({ onSearch }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search knowledge base..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-100 focus:border-green-300 focus:ring-2 focus:ring-green-100 bg-white shadow-sm"
      />
    </div>
  );
}