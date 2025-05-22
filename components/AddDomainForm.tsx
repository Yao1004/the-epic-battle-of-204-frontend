"use client";
import { useState } from "react";
import { addDomain } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";

export default function AddDomainForm({ token }: { token: string }) {
  const [domain, setDomain] = useState("");
  const [listType, setListType] = useState("blacklist");
  const [msg, setMsg] = useState<React.ReactNode>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await addDomain(token, domain, listType);
      if (res.status === 201) {
        setMsg(
          <span className="text-green-600">
            Added: {domain} ({listType === "blacklist" ? "Blacklist" : "Whitelist"})
          </span>
        );
        setDomain("");
      } else if (res.status === 409) {
        setMsg(<span className="text-yellow-600">This domain is already in the list.</span>);
      } else if (res.status === 422) {
        setMsg(<span className="text-red-500">Validation error: {res.data?.detail || "Invalid domain"}</span>);
      } else {
        setMsg(<span className="text-red-500">Internal error: {res.data?.detail || res.statusText}</span>);
      }
    } catch (e) {
      let msg = "";
      if (typeof e === "object" && e && "response" in e) {
        const err = e as AxiosErrorShape;
        msg = err.response?.data?.detail || err.message || "";
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setMsg(<span className="text-red-500">Add failed: {msg}</span>);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-5 text-lg font-semibold flex items-center space-x-2">
        <span className="material-symbols-outlined">playlist_add</span>
        <span>Add to List</span>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Domain Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span className="material-symbols-outlined text-lg">public</span>
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="example.com"
              required
              value={domain}
              onChange={e => setDomain(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">List Type</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span className="material-symbols-outlined text-lg">list_alt</span>
            </span>
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              required
              value={listType}
              onChange={e => setListType(e.target.value)}
            >
              <option value="blacklist">Blacklist</option>
              <option value="whitelist">Whitelist</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 flex items-center justify-center space-x-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Add Domain</span>
        </button>
        <div className="mt-4 text-sm font-medium">{msg}</div>
      </form>
    </div>
  );
}
