import adminApi from "./adminApi";

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

  const data = await response.json().catch(
    () => null
  );

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `EA API error: ${response.status}`
    );
  }

  return data;
}

const eaApi = {
  async list() {
    return request("/admin/eas");
  },

  async create(payload) {
    return request("/admin/eas", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async get(id) {
    return request(`/admin/eas/${id}`);
  },

  async update(id, payload) {
    return request(`/admin/eas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async toggle(id, enabled) {
    return request(
      `/admin/eas/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          enabled,
        }),
      }
    );
  },

  async rotateApiKey(id) {
    return request(
      `/admin/eas/${id}/rotate-key`,
      {
        method: "POST",
      }
    );
  },
};

export default eaApi;