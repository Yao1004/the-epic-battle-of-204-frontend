"use client";
import { useState } from "react";
import { addDomain } from "@/lib/api";

export default function BulkInsertForm({ token }: { token: string }) {
  const [domains, setDomains] = useState("");
  const [listType, setListType] = useState("blacklist");
  const [result, setResult] = useState<React.ReactNode>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("");
    const domainList = domains
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (!domainList.length) {
      setResult(<span className="text-red-500">Please enter at least one domain.</span>);
      return;
    }

    let ok = 0, dup = 0, fail = 0;
    setResult(<span className="text-gray-600">Uploading...</span>);
    for (const domain of domainList) {
      try {
        await addDomain(token, domain, listType);
        ok++;
      } catch (e: any) {
        const msg = e?.response?.data?.detail || e.message || "";
        if (msg.includes("already in the list") || msg.includes("UNIQUE constraint")) {
          dup++;
        } else {
          fail++;
        }
      }
    }
    let summary = <span className="text-green-600 font-bold">{ok} added</span>;
    if (dup) summary = <>{summary}, <span className="text-yellow-600 font-bold">{dup} duplicated</span></>;
    if (fail) summary = <>{summary}, <span className="text-red-500 font-bold">{fail} failed</span></>;
    setResult(summary);
    setDomains("");
    setListType("blacklist");
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-8 transition-all duration-300 hover:shadow-lg max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-5 text-lg font-semibold flex items-center space-x-2">
        <span className="material-symbols-outlined">upload_file</span>
        <span>Bulk Domain Upload</span>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Domains (one per line)</label>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all min-h-[100px]"
            placeholder="example1.com&#10;example2.com&#10;example3.com"
            required
            value={domains}
            onChange={e => setDomains(e.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">List Type</label>
          <select
            className="flex-1 py-2 px-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            value={listType}
            onChange={e => setListType(e.target.value)}
          >
            <option value="blacklist">Blacklist</option>
            <option value="whitelist">Whitelist</option>
          </select>
          <button
            type="submit"
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transform transition-all duration-200 hover:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-1"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            <span>Upload</span>
          </button>
        </div>
        <div className="text-sm font-medium mt-2">{result}</div>
      </form>
    </div>
  );
}
