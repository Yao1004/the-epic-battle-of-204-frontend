"use client";
import { useEffect, useState } from "react";
import { fetchDomains, deleteDomain } from "@/lib/api";
import { AxiosErrorShape, type Domain } from "@/lib/types";
import { DomainListSection } from "@/components/DomainListSection";

function ConfirmModal({ open, onConfirm, onCancel, domain, listType }: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  domain: string;
  listType: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px]">
        <div className="mb-4 text-gray-800 text-lg font-semibold">Confirm Deletion</div>
        <div className="mb-6 text-gray-600 text-sm">
          Are you sure to delete <span className="font-bold">{domain}</span> from <span className="font-bold">{listType}</span>?
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DomainsTable({ token }: { token: string }) {
  const [bodies, setBodies] = useState<Array<{ domains: Domain[]; meta: { total: number; offset: number; limit: number } }>>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState(["", "", "", ""]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ source: string, domain: string; listType: string } | null>(null);

  const refresh = async () => {
    setLoading(true);
    setMsg("");
    try {
      const data = [
        await fetchDomains(token, "manual", "whitelist"),
        await fetchDomains(token, "manual", "blacklist"),
        await fetchDomains(token, "llm", "whitelist"),
        await fetchDomains(token, "llm", "blacklist"),
      ];
      // Ensure each entry is { domains: Domain[], meta: ... }
      setBodies(data);
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

  const handleDelete = (source: string, domain: string, list_type: string) => {
    setPendingDelete({ source, domain, listType: list_type });
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!pendingDelete) return;
    setConfirmOpen(false);
    try {
      await deleteDomain(token, pendingDelete.source, pendingDelete.domain, pendingDelete.listType);
      setMsg(`Deleted: ${pendingDelete.domain} (${pendingDelete.listType})`);
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
    } finally {
      setPendingDelete(null);
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
        ) : !bodies?.length ? (
          <span className="text-gray-400">No records.</span>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Whitelist */}
            <div className="flex flex-col h-full">
              <div className="font-bold text-gray-600 mb-2 text-lg">Whitelist</div>
              <DomainListSection
                title="Manual"
                data={bodies[0]}
                searchValue={search[0]}
                setSearchValue={v => setSearch([v, search[1], search[2], search[3]])}
                onDelete={handleDelete}
                source="manual"
              />
              <DomainListSection
                title="LLM"
                data={bodies[2]}
                searchValue={search[2]}
                setSearchValue={v => setSearch([search[0], search[1], v, search[3]])}
                onDelete={handleDelete}
                source="llm"
              />
            </div>
            {/* Right: Blacklist */}
            <div className="flex flex-col h-full">
              <div className="font-bold text-gray-600 mb-2 text-lg">Blacklist</div>
              <DomainListSection
                title="Manual"
                data={bodies[1]}
                searchValue={search[1]}
                setSearchValue={v => setSearch([search[0], v, search[2], search[3]])}
                onDelete={handleDelete}
                source="manual"
              />
              <DomainListSection
                title="LLM"
                data={bodies[3]}
                searchValue={search[3]}
                setSearchValue={v => setSearch([search[0], search[1], search[2], v])}
                onDelete={handleDelete}
                source="llm"
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        open={confirmOpen}
        onConfirm={doDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null); }}
        domain={pendingDelete?.domain || ""}
        listType={pendingDelete?.listType || ""}
      />
    </div>
  );
}
