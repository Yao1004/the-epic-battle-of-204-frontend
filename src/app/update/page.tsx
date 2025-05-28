"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BulkInsertForm from "@/components/BulkInsertForm";
import AdminPanel from "@/components/AdminPanel";

export default function UpdatePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      sessionStorage.setItem("redirectAfterLogin", "/update");
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
        <BulkInsertForm
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
