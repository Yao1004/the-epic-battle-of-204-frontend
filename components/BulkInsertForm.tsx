"use client";
import { useState } from "react";
import { addDomain } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";

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
      } catch (e) {
        let msg = "";
        if (typeof e === "object" && e && "response" in e) {
          const err = e as AxiosErrorShape;
          msg = err.response?.data?.detail || err.message || "";
        } else if (e instanceof Error) {
          msg = e.message;
        }
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-5 text-lg font-semibold flex items-center space-x-2">
        <span className="material-symbols-outlined">upload_file</span>
        <span>Bulk Domain Upload</span>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4 h-full flex flex-col">
        <div>
          <label className="text-sm font-medium text-gray-700">Domain Names (one per line)</label>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all min-h-[100px]"
            placeholder={`example1.com\nexample2.com\nexample3.com`}
            required
            value={domains}
            onChange={e => setDomains(e.target.value)}
          ></textarea>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">List Type</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span className="material-symbols-outlined text-lg">list_alt</span>
            </span>
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              value={listType}
              onChange={e => setListType(e.target.value)}
              required
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
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 rounded-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 flex items-center justify-center space-x-2"
        >
          <span className="material-symbols-outlined">upload</span>
          <span>Upload</span>
        </button>
        <div className="mt-4 text-sm font-medium">{result}</div>
      </form>
    </div>
  );
}
