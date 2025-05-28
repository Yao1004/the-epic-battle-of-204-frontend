import axios from "axios";

export function getApiBase() {
  if (typeof window === 'undefined') {
    // SSR fallback, use env or hardcoded
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  }
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

const API_BASE = getApiBase();;

export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);
  const res = await axios.post(`${API_BASE}/api/auth/login`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data.access_token || res.data.token;
}

export async function fetchDomains(token: string, source: string, list_type: string,
  offset: number, limit: number, keyword?: string) {
  const params: Record<string, string | number> = { offset, limit };
  if (keyword && keyword.length > 0) params.keyword = keyword;
  try {
    const res = await axios.get(`${API_BASE}/api/lists/${source}/${list_type}/domains`, {
      headers: { Authorization: "Bearer " + token },
      params,
    });
    return res.data;
  } catch (err) {
    if (typeof window !== 'undefined' && axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }
    throw err;
  }
}

export async function addDomain(token: string, domain: string, list_type: string) {
  try {
    const res = await axios.post(
      `${API_BASE}/api/lists/manual/${list_type}/domains`,
      { domain },
      {
        headers: { Authorization: "Bearer " + token },
        validateStatus: () => true, // Always resolve, handle status manually
      }
    );
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
      return;
    }
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      throw new Error(`Failed to add domain: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    if (typeof window !== 'undefined' && axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }
    throw err;
  }
}

export async function deleteDomain(token: string, source: string, domain: string, list_type: string) {
  try {
    const res = await axios.delete(`${API_BASE}/api/lists/${source}/${list_type}/domains/${domain}`, {
      headers: { Authorization: "Bearer " + token },
      data: { domain, list_type },
      validateStatus: () => true,
    });
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
      return;
    }
    return res;
  } catch (err) {
    if (typeof window !== 'undefined' && axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }
    throw err;
  }
}

export async function fetchDomainLogs(token: string, offset = 0, limit = 100, keyword?: string) {
  const params: Record<string, string | number> = { offset, limit };
  if (keyword && keyword.length > 0) params.keyword = keyword;
  try {
    const res = await axios.get(`${API_BASE}/api/domain-logs`, {
      headers: { Authorization: "Bearer " + token },
      params,
    });
    return res.data;
  } catch (err) {
    if (typeof window !== 'undefined' && axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }
    throw err;
  }
}

export async function fetchListStats(token: string) {
  try {
    const res = await axios.get(`${API_BASE}/api/lists/stats`, {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data;
  } catch (err) {
    if (typeof window !== 'undefined' && axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }
    throw err;
  }
}
