const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

async function request(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `API request failed: ${response.status}`
    );
  }

  return data;
}

export const adminApi = {
  getStatus() {
    return request("/health");
  },

  getDashboard() {
    return request("/admin/dashboard");
  },

  getLogs() {
    return request("/admin/logs");
  },
};

export default adminApi;