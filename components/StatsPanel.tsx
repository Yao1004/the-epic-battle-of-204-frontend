"use client";
import { useEffect, useState } from "react";
import { fetchDomainLogs, fetchListStats } from "@/lib/api";

interface DomainLog {
  id: number;
  domain: string;
  status: string;
  timestamp: string;
}

export default function StatsPanel({ token }: { token: string }) {
  const [logs, setLogs] = useState<DomainLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total_domains: 0,
    whitelist_count: 0,
    blacklist_count: 0,
    manual_count: 0,
    llm_count: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    async function loadStats() {
      try {
        const s = await fetchListStats(token);
        setStats(s);
      } catch {
        // ignore stats error for now
      }
    }
    loadStats();
  }, [token]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchDomainLogs(token, (page - 1) * pageSize, pageSize);
        // Response structure: { logs: DomainLog[], meta: { total, offset, limit } }
        let logsData = res.logs || [];
        setTotal(res.meta?.total || logsData.length || 0);
        if (search.trim()) {
          logsData = logsData.filter((log: DomainLog) => log.domain.toLowerCase().includes(search.trim().toLowerCase()));
        }
        setLogs(Array.isArray(logsData) ? logsData : []);
      } catch(err) {
        const errorObj = err as { response?: { status?: number } };
        if (errorObj.response && errorObj.response.status) {
          setError(`Failed to load stats (Error ${errorObj.response.status})`);
        } else {
          setError("Failed to load stats");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, page, search]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-10 max-w-3xl mx-auto mt-8">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-500 px-6 py-3 flex items-center text-white font-semibold text-lg rounded-t-xl">
        <span className="material-symbols-outlined mr-2">analytics</span>
        Domain Statistics
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="flex-1 bg-green-50 rounded-xl flex flex-row items-center justify-center p-4 shadow-md">
            <span className="bg-green-600 text-white p-3 rounded-full mr-4 text-2xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </span>
            <div className="text-left">
              <div className="flex flex-row items-center font-bold text-xl">
                <div className="text-green-800 font-bold text-lg">Allowed</div>
                <div className="text-2xl font-extrabold text-green-900 ml-2 ">{stats.whitelist_count}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl flex flex-row items-center justify-center p-4 shadow-md">
            <span className="bg-red-600 text-white p-3 rounded-full mr-4 text-2xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined">block</span>
            </span>
            <div className="text-left">
              <div className="flex flex-row items-center font-bold text-xl">
                <div className="text-red-800 font-bold text-lg">Blocked</div>
                <div className="text-2xl font-extrabold text-red-900 ml-2 ">{stats.blacklist_count}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-700 dark:text-gray-400 font-medium flex items-center">
              <span className="material-symbols-outlined mr-1 text-indigo-600">calendar_month</span>
              Recent Activity
            </div>
            <input
              className="ml-auto border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
              type="text"
              placeholder="Search domain..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              style={{ minWidth: 180 }}
            />
          </div>
          <div className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <div className="py-2 text-gray-400">Loading…</div>
            ) : error ? (
              <div className="py-2 text-red-500">{error}</div>
            ) : logs.length === 0 ? (
              <div className="py-2 text-gray-400">No recent activity.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <span className={`material-symbols-outlined mr-2 ${log.status === "blocked" ? "text-red-500" : log.status === "allowed" ? "text-green-500" : log.status === "reviewed" ? "text-purple-500" : ""}`}>
                      {log.status === "blocked" ? "block" : log.status === "allowed" ? "verified" : log.status === "reviewed" ? "pending" : "info"}
                    </span>
                    <span>{log.domain} {log.status === "blocked" ? "blocked" : log.status === "allowed" ? "allowed" : log.status === "reviewed" ? "reviewed" : log.status}</span>
                  </div>
                  <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
          {/* Pagination controls styled like the image */}
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
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-all ${p === page ? 'bg-blue-500 text-white shadow-lg' : 'bg-transparent text-blue-500 hover:bg-blue-100'}`}
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
        </div>
      </div>
    </div>
  );
}
