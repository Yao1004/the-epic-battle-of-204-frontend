"use client";
import { type Domain } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { fetchDomains } from "@/lib/api";

export function DomainListSection({
  title,
  searchValue,
  setSearchValue,
  onDelete,
  source,
  token,
  listType
}: {
  title: string;
  searchValue: string;
  setSearchValue: (v: string) => void;
  onDelete: (source: string, domain: string, list_type: string) => void;
  source: string;
  token: string;
  listType: string;
}) {
  const [page, setPage] = useState(1);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [meta, setMeta] = useState({ total: 0, offset: 0, limit: 0 });
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  // Fetch domains with searchValue as a keyword for backend search
  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDomains(token, source, listType, (page - 1) * pageSize, pageSize, searchValue.trim());
      const allDomains = res.domains || [];
      // Make sure meta.total is correctly set, even if the response structure is different than expected
      const responseMeta = res.meta || {};
      setMeta({
        total: responseMeta.total || responseMeta.count || res.count || allDomains.length || 0,
        offset: responseMeta.offset || (page - 1) * pageSize || 0,
        limit: responseMeta.limit || pageSize || 5
      });
      setDomains(allDomains);
    } finally {
      setLoading(false);
    }
  }, [token, source, listType, page, pageSize, searchValue]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const pageCount = Math.max(1, Math.ceil(meta.total / pageSize));
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

  // Only reset page to 1 when searchValue, token, source, or listType changes (not after delete/refresh)
  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  // Handle deletion: if last item on page and not on first page, move to previous page
  useEffect(() => {
    if (domains.length === 0 && page > 1 && meta.total > 0) {
      // Only decrement page ONCE, and only after fetchPage has run for the new page
      setPage(prev => {
        if (prev === 1) return 1;
        if (meta.total <= (prev - 1) * pageSize) {
          return prev - 1;
        }
        return prev;
      });
    }
  }, [domains, meta.total, page]);

  // Refresh data on custom event
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (
        e.detail &&
        e.detail.source === source &&
        e.detail.listType === listType
      ) {
        fetchPage();
      }
    };
    window.addEventListener('domain-list-section-refresh', handler as EventListener);
    return () => {
      window.removeEventListener('domain-list-section-refresh', handler as EventListener);
    };
  }, [fetchPage, source, listType, token, page]);

  return (
    <div className="flex-1 flex flex-col mb-6">
      <div className="font-semibold text-gray-500 dark:text-gray-300 mb-1 h-6 flex items-center">{title}</div>
      <div className="relative mb-2 h-10 flex items-center">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          search
        </span>
        <input
          type="text"
          className="w-full h-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none transition-all duration-200"
          placeholder="Search domains..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-gray-400 text-sm mb-2">Loading…</div>
      ) : (
        <>
        <div className="overflow-y-auto max-h-56">
          {domains.length === 0 ? (
            <div className="text-gray-400 text-sm mb-2">No records.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {domains.map((row) => (
                <li key={row.domain + row.list_type} className="relative py-2 pl-2 pr-8 hover:bg-gray-50 dark:hover:bg-gray-400 group flex items-center">
                  <span>{row.domain}</span>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity text-base"
                    title="Delete"
                    onClick={() => onDelete(source, row.domain, row.list_type)}
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
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
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-all ${p === page ? 'bg-indigo-500 text-white shadow-lg' : 'bg-transparent text-indigo-500 hover:bg-indigo-100'}`}
                    onClick={() => setPage(Number(p))}
                    disabled={p === page}
                  >
                    {p}
                  </button>
                )
            )}
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
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