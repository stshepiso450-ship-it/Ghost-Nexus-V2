
const API_BASE_URL = (
  import.meta.env.VITE_MQL5_API_URL || "http://127.0.0.1:8010"
).replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData || !options.body
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(
      `Cannot connect to the Ghost Nexus API at ${API_BASE_URL}. ` +
      `Check that the backend on port 8010 is running. ${error.message || ""}`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : { detail: await response.text().catch(() => "") };

  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : typeof data.message === "string"
          ? data.message
          : `HTTP ${response.status}`;

    throw new Error(`API error (${response.status}): ${detail}`);
  }

  return data;
}

const mql5Api = {
  adminList() {
    return request("/admin/mql5/orders");
  },

  adminGet(orderId) {
    return request(`/admin/mql5/orders/${orderId}`);
  },

  uploadEA(orderId, file) {
    if (!(file instanceof File)) {
      return Promise.reject(new Error("Select an EA file first."));
    }

    if (!file.name.toLowerCase().endsWith(".ex5")) {
      return Promise.reject(
        new Error("Upload the compiled MetaTrader 5 .ex5 file, not the .mq5 source.")
      );
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    // Do not manually set Content-Type. The browser supplies the multipart boundary.
    return request(`/admin/mql5/orders/${orderId}/upload`, {
      method: "POST",
      body: formData,
    });
  },

  release(orderId) {
    return request(`/admin/mql5/orders/${orderId}/release`, {
      method: "POST",
    });
  },

  simulateTestPayment(orderId) {
    return request(`/admin/mql5/orders/${orderId}/test-payment-local`, {
      method: "POST",
    });
  },

  download(orderId) {
    return `${API_BASE_URL}/mentor/mql5/orders/${orderId}/download`;
  },

  mentorOrders() {
    return request("/mentor/mql5/orders");
  },
};

export default mql5Api;
