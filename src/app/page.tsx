"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      sessionStorage.setItem("redirectAfterLogin", "/");
      router.replace("/login");
    } else {
      router.replace("/view");
    }
  }, [router]);
  return null;
}
