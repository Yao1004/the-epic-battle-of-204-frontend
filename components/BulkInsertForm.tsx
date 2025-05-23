"use client";
import { useState } from "react";
import { addDomain } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";

export default function BulkInsertForm({ token, onUnauthorized }: { token: string, onUnauthorized?: () => void }) {
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
      setResult(<span className="text-rose-500">Please enter at least one domain.</span>);
      return;
    }

    let ok = 0, dup = 0, fail = 0;
    setResult(<span className="text-gray-600">Uploading...</span>);
    for (const domain of domainList) {
      try {
        await addDomain(token, domain, listType);
        ok++;
      } catch (e) {
        let code = 0;
        let msg = "";
        if (typeof e === "object" && e && "response" in e) {
          const err = e as AxiosErrorShape & { response?: { status?: number } };
          code = err.response?.status || 0;
          msg = err.response?.data?.detail || err.message || "";
        }
        if (code === 404) {
          dup++;
        } else if (code === 422) {
          fail++;
          if (fail === 1) setResult(<span className="text-rose-500">Validation error: {msg}</span>);
        } else if (code === 401) {
          if (onUnauthorized) onUnauthorized();
          setResult(<span className="text-rose-500">Unauthorized. Please log in again.</span>);
          return;
        } else {
          fail++;
          console.error("Error adding domain:", domain, e);
          if (fail === 1) setResult(<span className="text-rose-500">Internal error: {msg}</span>);
        }
      }
    }
    let summary = <span className="text-emerald-600 font-bold">{ok} domains added ({listType === "blacklist" ? "Blacklist" : "Whitelist"})</span>;
    if (dup) summary = <>{summary}, <span className="text-yellow-600 font-bold">{dup} duplicated</span></>;
    if (fail) summary = <>{summary}, <span className="text-rose-500 font-bold">{fail} failed</span></>;
    setResult(summary);
    setDomains("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/plain") {
      setResult(<span className="text-rose-500">Only .txt files are supported.</span>);
      return;
    }
    try {
      const text = await file.text();
      setDomains((prev) => prev + (prev && !prev.endsWith("\n") ? "\n" : "") + text.trim());
      setResult("");
    } catch {
      setResult(<span className="text-rose-500">Failed to read file.</span>);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col min-h-[500px]">
      {/* <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-5 text-lg font-semibold flex items-center space-x-2">
        <span className="material-symbols-outlined">upload_file</span>
        <span>Bulk Domain Upload</span>
      </div> */}
      <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col h-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Domain Names (one per line)</label>
          <label className="inline-flex items-center cursor-pointer text-indigo-700 hover:text-indigo-900 text-sm font-medium ml-auto">
            <span className="material-symbols-outlined mr-1 text-base">attach_file</span>
            <span>Upload a .txt File</span>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <textarea
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg  focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all min-h-[100px]"
          placeholder={`example1.com\nexample2.com\nexample3.com`}
          required
          value={domains}
          onChange={e => setDomains(e.target.value)}
        ></textarea>
        <div className="flex flex-col mt-auto gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400 mt-4 mb-2">List Type</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <span className="material-symbols-outlined text-lg">list_alt</span>
              </span>
              <select
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-gray-100 dark:bg-gray-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
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
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined">playlist_add</span>
              <span>Add</span>
            </button>
            <div className="mt-4 text-sm font-medium">{result}</div>
          </div>
        </div>
      </form>
    </div>
  );
}
