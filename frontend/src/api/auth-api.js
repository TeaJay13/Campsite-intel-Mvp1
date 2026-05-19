const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.code = data.error;
    throw error;
  }

  return data;
}

export async function registerUser({ email, displayName, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, displayName, password }),
  });
}

export async function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(accessToken) {
  return request("/auth/logout", {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
}

export async function fetchProfile(accessToken) {
  return request("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function fetchSavedTrails(accessToken) {
  return request("/auth/me/saved-trails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
