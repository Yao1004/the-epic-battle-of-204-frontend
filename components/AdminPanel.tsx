"use client";
import { useState } from "react";
import Image from "next/image";
import Tabs from "./Tabs";
import DomainsTable from "./DomainsTable";
import BulkInsertForm from "./BulkInsertForm";
import StatsPanel from "./StatsPanel";

export default function AdminPanel({
  token,
  setToken,
}: {
  token: string;
  setToken: (token: string | null) => void;
}) {
  const [tab, setTab] = useState("domains");
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image
            src="/favicon.ico"
            width={48}
            height={48}
            alt="Admin Icon"
          />
          <span className="text-xl font-bold text-white">THE EPIC BATTLE - Admin Panel</span>
        </div>
        <button
          className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-800 text-white border-3 border-purple-300 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:shadow-sm"
          onClick={() => {
            setToken(null);
            localStorage.removeItem("token");
          }}
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Logout</span>
        </button>
      </nav>
      <Tabs
        tabs={[
          {
            label: (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">list_alt</span>
                View Domain Lists
              </span>
            ),
            value: "view",
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">playlist_add</span>
                Add to Domain Lists
              </span>
            ),
            value: "update",
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">bar_chart</span>
                Statistics
              </span>
            ),
            value: "stats",
          },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="my-8">
        {tab === "view" && <DomainsTable token={token} onUnauthorized={() => { setToken(null); localStorage.removeItem("token"); }} />}
        {tab === "update" && <BulkInsertForm token={token} onUnauthorized={() => { setToken(null); localStorage.removeItem("token"); }}/>}
        {tab === "stats" && <StatsPanel token={token} onUnauthorized={() => { setToken(null); localStorage.removeItem("token"); }}/>}
      </div>
    </div>
  );
}
