"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import StatsPanel from "@/components/StatsPanel";

export default function StatsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      sessionStorage.setItem("redirectAfterLogin", "/stats");
      router.replace("/login");
    } else {
      setToken(t);
    }
  }, [router]);
  if (!token) return null;
  return (
    <>
      <AdminPanel token={token} setToken={setToken} />
      <div className="container mx-auto max-w-5xl px-4">
        <StatsPanel
          token={token}
          onUnauthorized={() => {
            setToken(null);
            localStorage.removeItem("token");
            router.replace("/login");
          }}
        />
      </div>
    </>
  );
}
