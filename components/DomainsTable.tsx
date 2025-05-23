"use client";
import { useState } from "react";
import { deleteDomain } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-w-[300px]">
        <div className="mb-4 text-gray-800 dark:text-white text-lg font-semibold">Confirm Deletion</div>
        <div className="mb-6 text-gray-600 dark:text-gray-200 text-sm">
          Are you sure to delete <span className="font-bold">{domain}</span> from <span className="font-bold">{listType}</span>?
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DomainsTable({ token, onUnauthorized }: { token: string, onUnauthorized: () => void }) {
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState(["", "", "", ""]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ source: string, domain: string; listType: string } | null>(null);

  const handleDelete = (source: string, domain: string, list_type: string) => {
    setPendingDelete({ source, domain, listType: list_type });
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!pendingDelete) return;
    setConfirmOpen(false);
    try {
      await deleteDomain(token, pendingDelete.source, pendingDelete.domain, pendingDelete.listType);
      // Instead of calling refresh, trigger a custom event to notify DomainListSection to refetch
      const event = new CustomEvent('domain-list-section-refresh', {
        detail: {
          source: pendingDelete.source,
          listType: pendingDelete.listType
        }
      });
      window.dispatchEvent(event);
    } catch (e) {
      let msg = "";
      if (typeof e === "object" && e && "response" in e) {
        const err = e as AxiosErrorShape & { response?: { status?: number; data?: { detail?: string } } };
        const response = err.response;
        if (response && typeof response.status === 'number' && response.status === 401 && onUnauthorized) {
          onUnauthorized();
          return;
        }
        msg = response?.data?.detail || err.message || "";
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
      <div className="mb-3">
        {msg && <span className="text-rose-500">{msg}</span>}
        {/* Show unauthorized message if token is missing */}
        {!token && (
          <span className="text-rose-500 block mt-2">You are not authorized. Please log in again.</span>
        )}
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col min-h-[500px] p-6">
        {
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Whitelist */}
            <div className="flex flex-col h-full">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 text-lg">Whitelist</div>
              <DomainListSection
                title="Manual"
                searchValue={search[0]}
                setSearchValue={v => setSearch([v, search[1], search[2], search[3]])}
                onDelete={handleDelete}
                source="manual"
                listType="whitelist"
                token={token}
              />
              <DomainListSection
                title="LLM"
                searchValue={search[2]}
                setSearchValue={v => setSearch([search[0], search[1], v, search[3]])}
                onDelete={handleDelete}
                source="llm"
                listType="whitelist"
                token={token}
              />
            </div>
            {/* Right: Blacklist */}
            <div className="flex flex-col h-full">
              <div className="font-bold text-rose-600 dark:text-rose-400              ps aux | grep mtxrun mb-2 text-lg">Blacklist</div>
              <DomainListSection
                title="Manual"
                searchValue={search[1]}
                setSearchValue={v => setSearch([search[0], v, search[2], search[3]])}
                onDelete={handleDelete}
                source="manual"
                listType="blacklist"
                token={token}
              />
              <DomainListSection
                title="LLM"
                searchValue={search[3]}
                setSearchValue={v => setSearch([search[0], search[1], search[2], v])}
                onDelete={handleDelete}
                source="llm"
                listType="blacklist"
                token={token}
              />
            </div>
          </div>
        }
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
