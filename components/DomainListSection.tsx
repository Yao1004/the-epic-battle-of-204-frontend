"use client";
import { type Domain } from "@/lib/types";

export function DomainListSection({
  title,
  data,
  searchValue,
  setSearchValue,
  onDelete,
  source
}: {
  title: string;
  data: Domain[];
  searchValue: string;
  setSearchValue: (v: string) => void;
  onDelete: (source: string, domain: string, list_type: string) => void;
  source: string;
}) {
  const filtered = data.filter(row => row.domain.includes(searchValue));

  return (
    <div className="flex-1 flex flex-col mb-6">
      <div className="font-semibold text-gray-500 mb-1">{title}</div>
      <input
        type="text"
        className="mb-2 px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Search..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      {data.length === 0 ? (
        <div className="text-gray-400 text-sm mb-2">No records.</div>
      ) : (
        <div className="overflow-y-auto max-h-56">
          <ul className="divide-y divide-gray-100">
            {filtered.map((row) => (
              <li key={row.domain + row.list_type} className="relative py-2 pl-2 pr-8 hover:bg-gray-50 group flex items-center">
                <span>{row.domain}</span>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-base"
                  title="Delete"
                  onClick={() => onDelete(source, row.domain, row.list_type)}
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}