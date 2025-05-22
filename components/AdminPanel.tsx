"use client";
import { useState } from "react";
import Tabs from "./Tabs";
import DomainsTable from "./DomainsTable";
import AddDomainForm from "./AddDomainForm";
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
      <nav className="bg-neutral-300 dark:bg-neutral-600 rounded-xl shadow-md p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-indigo-600 text-2xl">admin_panel_settings</span>
          <span className="text-xl font-bold text-gray-800 dark:text-white">THE EPIC BATTLE - Admin Panel</span>
        </div>
        <button
          className="flex items-center space-x-1 bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:shadow-sm"
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
          { label: "Domain Management", value: "domains" },
          { label: "Bulk Upload", value: "bulk" },
          { label: "Domain Statistics", value: "stats" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="my-8">
        {tab === "domains" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DomainsTable token={token} />
            </div>
            <div className="md:col-span-1">
              <AddDomainForm token={token} />
            </div>
          </div>
        )}
        {tab === "bulk" && <BulkInsertForm token={token} />}
        {tab === "stats" && <StatsPanel />}
      </div>
    </div>
  );
}
