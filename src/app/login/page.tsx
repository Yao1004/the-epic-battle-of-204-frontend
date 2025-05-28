"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginPanel from "@/components/LoginPanel";

export default function LoginPage() {
  const router = useRouter();
  const [, setToken] = useState<string | null>(null);

  // On successful login, save token and redirect to last intended page (if any)
  const handleSetToken = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    // Check for a stored redirect path
    const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
    sessionStorage.removeItem("redirectAfterLogin");
    router.replace(redirectPath);
  };

  return <LoginPanel setToken={handleSetToken} />;
}
