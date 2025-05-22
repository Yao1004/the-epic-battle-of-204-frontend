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

export async function fetchDomains(token: string) {
  const res = await axios.get(`${API_BASE}/api/domains`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
}

export async function addDomain(token: string, domain: string, list_type: string) {
  await axios.post(
    `${API_BASE}/api/lists`,
    { domain, list_type },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export async function deleteDomain(token: string, domain: string, list_type: string) {
  await axios.delete(`${API_BASE}/api/lists`, {
    headers: { Authorization: "Bearer " + token },
    data: { domain, list_type },
  });
}
