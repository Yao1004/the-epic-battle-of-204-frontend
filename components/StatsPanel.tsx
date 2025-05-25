"use client";
import { useEffect, useState } from "react";
import { fetchDomainLogs, fetchListStats } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";

interface DomainLog {
  id: number;
  domain: string;
  status: string;
  timestamp: string;
}

export default function StatsPanel({ token, onUnauthorized}: { token: string, onUnauthorized?: () => void }) {
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
      } catch (e) {
        if (typeof e === "object" && e && "response" in e) {
          const err = e as AxiosErrorShape & { response?: { status?: number; data?: { detail?: string } } };
          const response = err.response;
          if (response && typeof response.status === 'number' && response.status === 401 && onUnauthorized) {
            onUnauthorized();
            return;
          }
          setError(response?.data?.detail || err.message || "");
        }
      }
    }
    loadStats();
  }, [token, onUnauthorized]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchDomainLogs(token, (page - 1) * pageSize, pageSize, search.trim());
        const logsData = res.logs || [];
        setTotal(res.meta?.total || logsData.length || 0);
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
  console.log(`Stats page ${page} of ${pageCount}, total records: ${total}, search: "${search}"`);
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
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-10 mx-auto mt-8">
      {/* <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-3 flex items-center text-white font-semibold text-lg rounded-t-xl">
        <span className="material-symbols-outlined mr-2">analytics</span>
        Domain Statistics
      </div> */}
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="flex-1 bg-emerald-600 rounded-xl flex flex-row items-center justify-center p-4 shadow-md">
            <span className="material-symbols-outlined mr-3 text-emerald-50 text-3xl">verified</span>
            <div className="text-left">
              <div className="flex flex-row items-center font-bold text-xl">
                <div className="text-emerald-100 font-bold text-lg">Allowed</div>
                <div className="text-2xl font-extrabold text-emerald-50 ml-3 ">{stats.whitelist_count}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-rose-600 rounded-xl flex flex-row items-center justify-center p-4 shadow-md">
            <span className="material-symbols-outlined mr-3 text-rose-50 text-3xl">block</span>
            <div className="text-left">
              <div className="flex flex-row items-center font-bold text-xl">
                <div className="text-rose-100 font-bold text-lg">Blocked</div>
                <div className="text-2xl font-extrabold text-rose-50 ml-3 ">{stats.blacklist_count}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-500 dark:text-gray-300 items-center">
              Recent Activity
            </div>
            <div className="relative mb-2" style={{ minWidth: 180 }}>
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                search
              </span>
              <input
                className="pl-8 pr-2 py-1 border border-gray-300 rounded text-sm focus:border-indigo-500 focus:outline-none w-full"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => { setPage(1); setSearch(e.target.value); }}
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {loading ? (
              <div className="py-2 text-gray-400">Loading…</div>
            ) : error ? (
              <div className="py-2 text-rose-500">{error}</div>
            ) : logs.length === 0 ? (
              <div className="py-2 text-gray-400">No recent activity.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <span className={`material-symbols-outlined mr-2 ${log.status === "blocked" ? "text-rose-500" : log.status === "allowed" ? "text-emerald-500" : log.status === "reviewed" ? "text-purple-500" : ""}`}>
                      {log.status === "blocked" ? "block" : log.status === "allowed" ? "verified" : log.status === "reviewed" ? "pending" : "info"}
                    </span>
                    <span>{log.domain} {log.status === "blocked" ? "blocked" : log.status === "allowed" ? "allowed" : log.status === "reviewed" ? "reviewed" : log.status}</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(log.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    {" "}
                    {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
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
        </div>
      </div>
    </div>
  );
}
