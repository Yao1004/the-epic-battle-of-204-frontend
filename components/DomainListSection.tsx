"use client";
import { type Domain } from "@/lib/types";
import { useEffect, useState } from "react";

export function DomainListSection({
  title,
  data,
  searchValue,
  setSearchValue,
  onDelete,
  source
}: {
  title: string;
  data: {
    domains: Domain[];
    meta: {
      total: number;
      offset: number;
      limit: number;
    }
  };
  searchValue: string;
  setSearchValue: (v: string) => void;
  onDelete: (source: string, domain: string, list_type: string) => void;
  source: string;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  // Filtered domains
  const filtered = data.domains.filter(row => row.domain.includes(searchValue));
  const pageCount = Math.max(1, Math.ceil(data.meta.total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  let pages: (number | string)[] = [];
  if (pageCount <= 7) {
    pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  } else {
    if (page <= 4) {
      pages = [1, 2, 3, 4, 5, '...', pageCount];
    } else if (page >= pageCount - 3) {
      pages = [1, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    } else {
      pages = [1, '...', page - 1, page, page + 1, '...', pageCount];
    }
  }

  // Reset to first page on search change
  useEffect(() => { setPage(1); }, [searchValue]);

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
      {filtered.length === 0 ? (
        <div className="text-gray-400 text-sm mb-2">No records.</div>
      ) : (
        <>
        <div className="overflow-y-auto max-h-56">
          <ul className="divide-y divide-gray-100">
            {paged.map((row) => (
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
        {/* Pagination controls styled like the stats panel */}
        <div className="flex justify-center mt-2 gap-2">
          <button
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {pages.map((p, i) =>
            p === '...'
              ? <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-400">...</span>
              : (
                <button
                  key={`page-${p}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold transition-all ${p === page ? 'bg-blue-500 text-white shadow-lg' : 'bg-transparent text-blue-500 hover:bg-blue-100'}`}
                  onClick={() => setPage(Number(p))}
                  disabled={p === page}
                >
                  {p}
                </button>
              )
          )}
          <button
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === pageCount || pageCount === 0}
          >
            Next
          </button>
        </div>
        </>
      )}
    </div>
  );
}