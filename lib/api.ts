import axios from "axios";
const API_BASE = "http://localhost:8000";

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
  const res = await axios.get(`${API_BASE}/api/lists/${source}/${list_type}/domains`, {
    headers: { Authorization: "Bearer " + token },
    params,
  });
  return res.data;
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
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      throw new Error(`Failed to add domain: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    throw err;
  }
}

export async function deleteDomain(token: string, source: string, domain: string, list_type: string) {
  await axios.delete(`${API_BASE}/api/lists/${source}/${list_type}/domains/${domain}`, {
    headers: { Authorization: "Bearer " + token },
    data: { domain, list_type },
  });
}

export async function fetchDomainLogs(token: string, offset = 0, limit = 100, keyword?: string) {
  const params: Record<string, string | number> = { offset, limit };
  if (keyword && keyword.length > 0) params.keyword = keyword;
  const res = await axios.get(`${API_BASE}/api/domain-logs`, {
    headers: { Authorization: "Bearer " + token },
    params,
  });
  return res.data;
}

export async function fetchListStats(token: string) {
  const res = await axios.get(`${API_BASE}/api/lists/stats`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
}
