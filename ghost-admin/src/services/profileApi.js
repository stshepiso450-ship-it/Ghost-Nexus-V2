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
      `License API error: ${response.status}`
    );
  }

  return data;
}

const licenseApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params);

    return request(
      `/admin/licenses?${query.toString()}`
    );
  },

  async generate(payload) {
    return request(
      "/admin/licenses/generate",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  async get(id) {
    return request(
      `/admin/licenses/${id}`
    );
  },

  async activate(id) {
    return request(
      `/admin/licenses/${id}/activate`,
      {
        method: "POST",
      }
    );
  },

  async revoke(id) {
    return request(
      `/admin/licenses/${id}/revoke`,
      {
        method: "POST",
      }
    );
  },

  async verify(payload) {
    return request(
      "/api/license/verify",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },
};

export default licenseApi;