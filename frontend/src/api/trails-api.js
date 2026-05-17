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

export async function fetchTrails(params = {}) {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}/trails${query ? `?${query}` : ""}`);
  return parseJsonResponse(response);
}

export async function fetchTrailById(id) {
  const response = await fetch(`${API_BASE_URL}/trails/${id}`);
  return parseJsonResponse(response);
}
