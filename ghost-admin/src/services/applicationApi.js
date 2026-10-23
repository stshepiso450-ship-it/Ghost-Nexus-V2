const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

const applicationApi = {
  list() {
    return request("/admin/mentor-applications");
  },

  get(id) {
    return request(`/admin/mentor-applications/${id}`);
  },

  approve(id) {
    return request(`/admin/mentor-applications/${id}/approve`, {
      method: "POST",
    });
  },

  reject(id, reason = "") {
    return request(`/admin/mentor-applications/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({
        reason,
      }),
    });
  },
};

export default applicationApi;