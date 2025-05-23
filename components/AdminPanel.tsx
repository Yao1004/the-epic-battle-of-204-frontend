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
  const [tab, setTab] = useState("view");
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <nav className="bg-gradient-to-r from-indigo-700 to-purple-500 rounded-xl shadow-md p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
          <span className="text-xl font-bold text-white">THE EPIC BATTLE - Admin Panel</span>
        </div>
        <button
          className="flex items-center space-x-1 bg-white dark:bg-purple-600 hover:bg-purple-50 dark:hover:bg-purple-800 text-purple-600 dark:text-white border-3 border-purple-300 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:shadow-sm"
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
          { label: "View Domain List", value: "view" },
          { label: "Update Domain List", value: "update" },
          { label: "Domain Statistics", value: "stats" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="my-8">
        {tab === "view" && <DomainsTable token={token} />}
        {tab === "update" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="min-h-[520px] w-full">
              <AddDomainForm token={token} />
            </div>
            <div className="min-h-[520px] w-full">
              <BulkInsertForm token={token} />
            </div>
          </div>
        )}  
        {tab === "stats" && <StatsPanel token={token} />}
      </div>
    </div>
  );
}
