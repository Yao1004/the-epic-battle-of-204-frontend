"use client";
import { useEffect, useState } from "react";
import { fetchDomains, deleteDomain } from "@/lib/api";
import { AxiosErrorShape, type Domain } from "@/lib/types";

export default function DomainsTable({ token }: { token: string }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    setLoading(true);
    setMsg("");
    try {
      const data = await fetchDomains(token, "manual", "all");
      setDomains(data);
    } catch (e) {
      let msg = "";
      if (typeof e === "object" && e && "response" in e) {
        const err = e as AxiosErrorShape;
        msg = err.response?.data?.detail || err.message || "";
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setMsg("Failed to fetch: " + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async (domain: string, list_type: string) => {
    if (!confirm(`Are you sure to delete "${domain}" (${list_type})?`)) return;
    try {
      await deleteDomain(token, domain, list_type);
      setMsg(`Deleted: ${domain} (${list_type})`);
      refresh();
    } catch (e) {
      let msg = "";
      if (typeof e === "object" && e && "response" in e) {
        const err = e as AxiosErrorShape;
        msg = err.response?.data?.detail || err.message || "";
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setMsg("Delete failed: " + msg);
    }
  };

  return (
    <div>
      <button
        className="mb-5 flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-200 hover:shadow-md"
        onClick={refresh}
      >
        <span className="material-symbols-outlined">refresh</span>
        <span>Refresh Domain List</span>
      </button>
      <div className="mb-3">{msg && <span className="text-red-500">{msg}</span>}</div>
      <div className="bg-gray-50 p-4 rounded-lg min-h-[150px]">
        {loading ? (
          <span className="text-gray-400">Loading…</span>
        ) : !domains?.length ? (
          <span className="text-gray-400">No records.</span>
        ) : (
          <table className="table-auto w-full text-left text-gray-800">
            <thead>
              <tr>
                <th className="pb-2">Domain</th>
                <th className="pb-2">List Type</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((row) => (
                <tr
                  key={row.domain + row.list_type}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2">{row.domain}</td>
                  <td className="py-2">
                    {row.list_type === "blacklist" ? "Blacklist" : "Whitelist"}
                  </td>
                  <td className="py-2">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1"
                      onClick={() => handleDelete(row.domain, row.list_type)}
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
