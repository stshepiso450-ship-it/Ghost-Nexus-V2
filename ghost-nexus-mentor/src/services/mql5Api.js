
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const getMentor = () => {
  try {
    return JSON.parse(
      localStorage.getItem("ghost_nexus_mentor") || "{}"
    );
  } catch {
    return {};
  }
};

const request = async (path, options = {}) => {
  const mentor = getMentor();
  const token =
    localStorage.getItem("ghost_nexus_mentor_token") ||
    localStorage.getItem("mentor_token") ||
    "";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(mentor.mentor_id
        ? { "X-Mentor-ID": mentor.mentor_id }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data || `Request failed (${response.status})`
        : data.detail || data.message || `Request failed (${response.status})`
    );
  }

  return data;
};

const mql5Api = {
  getOrders() {
    return request("/api/mql5/orders");
  },

  getOrder(orderId) {
    return request(`/api/mql5/orders/${encodeURIComponent(orderId)}`);
  },

  createOrder(payload) {
    return request("/api/mql5/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export default mql5Api;
