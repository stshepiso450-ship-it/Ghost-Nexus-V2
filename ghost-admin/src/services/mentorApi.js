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

const mentorApi = {
  getDashboard() {
    return request("/mentor/dashboard");
  },

  getProfile() {
    return request("/mentor/profile");
  },

  updateProfile(payload) {
    return request("/mentor/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getCredentials() {
    return request("/mentor/credentials");
  },

  rotateApiKey() {
    return request("/mentor/credentials/rotate", {
      method: "POST",
    });
  },

  getEAs() {
    return request("/mentor/eas");
  },

  getOrders() {
    return request("/mentor/orders");
  },

  getPayments() {
    return request("/mentor/payments");
  },
};

export default mentorApi;