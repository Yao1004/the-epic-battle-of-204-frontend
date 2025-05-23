"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { AxiosErrorShape } from "@/lib/types";

export default function LoginPanel({ setToken }: { setToken: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (e) {
      let msg = "";
      if (typeof e === "object" && e && "response" in e) {
        const err = e as AxiosErrorShape;
        msg = err.response?.data?.detail || err.message || "";
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setMsg("Login failed: " + msg);
    }
  }

  return (
    <div className="max-w-md mx-auto pt-16 px-4 transition-all duration-300 transform hover:scale-[1.01]">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-indigo-600 text-white py-4 px-6 text-xl font-semibold flex items-center space-x-2">
          <span className="material-symbols-outlined">shield</span>
          <span>Admin Login</span>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                <span className="material-symbols-outlined text-lg">person</span>
              </span>
              <input
                id="login-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-neutral-800"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                <span className="material-symbols-outlined text-lg">lock</span>
              </span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-neutral-800"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            id="login-btn"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md active:translate-y-0"
          >
            Login
          </button>
          <div id="login-result" className="text-rose-500 text-sm font-medium">{msg}</div>
        </form>
      </div>
    </div>
  );
}