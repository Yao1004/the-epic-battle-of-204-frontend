"use client";
import { useState, useEffect } from "react";
import LoginPanel from "@/components/LoginPanel";
import AdminPanel from "@/components/AdminPanel";

export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div>
      {token ? (
        <AdminPanel token={token} setToken={setToken} />
      ) : (
        <LoginPanel setToken={setToken} />
      )}
    </div>
  );
}
