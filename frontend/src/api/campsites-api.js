const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
}

async function parseJsonResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export async function fetchCampsites(params = {}) {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}/campsites${query ? `?${query}` : ""}`);
  return parseJsonResponse(response);
}

export async function fetchCampsiteById(id) {
  const response = await fetch(`${API_BASE_URL}/campsites/${id}`);
  return parseJsonResponse(response);
}

export async function favoriteCampsite(id, token) {
  const response = await fetch(`${API_BASE_URL}/campsites/${id}/favorite`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 201) return;
  return parseJsonResponse(response);
}

export async function unfavoriteCampsite(id, token) {
  const response = await fetch(`${API_BASE_URL}/campsites/${id}/favorite`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 204) return;
  return parseJsonResponse(response);
}
