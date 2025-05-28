"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import DomainsTable from "@/components/DomainsTable";

export default function ViewPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      sessionStorage.setItem("redirectAfterLogin", "/view");
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
        <DomainsTable
          token={token}
          onUnauthorized={() => {
            setToken(null);
            localStorage.removeItem("token");
            window.location.replace("/");
          }}
        />
      </div>
    </>
  );
}
