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

const paymentApi = {
  adminList() {
    return request("/admin/payments");
  },

  get(id) {
    return request(`/payments/${id}`);
  },

  createCheckout(payload) {
    return request("/payments/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  verify(id) {
    return request(`/admin/payments/${id}/verify`, {
      method: "POST",
    });
  },
};

export default paymentApi;