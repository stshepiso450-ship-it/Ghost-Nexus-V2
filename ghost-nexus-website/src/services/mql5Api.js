
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const TOKEN_KEY = "ghost_nexus_mentor_token";

function readMentor() {
  try {
    return JSON.parse(
      localStorage.getItem("ghost_nexus_mentor") || "{}"
    );
  } catch {
    return {};
  }
}

function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("mentor_token") ||
    ""
  );
}

function getMentorId() {
  const mentor = readMentor();

  return (
    mentor.mentor_id ||
    localStorage.getItem("ghost_mentor_id") ||
    localStorage.getItem("mentor_id") ||
    ""
  );
}

function buildHeaders(extra = {}) {
  const headers = {
    Accept: "application/json",
    ...extra,
  };

  const token = getToken();
  const mentorId = getMentorId();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (mentorId) {
    headers["X-Mentor-ID"] = mentorId;
  }

  // Retain support for mentors who already have a separate API key.
  const mentor = readMentor();
  const apiKey =
    localStorage.getItem("ghost_nexus_mentor_api_key") ||
    localStorage.getItem("mentor_api_key") ||
    mentor.api_key ||
    "";

  if (apiKey) {
    headers["X-Mentor-API-Key"] = apiKey;
  }

  return headers;
}

async function request(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = buildHeaders({
    ...(!isFormData && options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const detail =
      data && typeof data === "object"
        ? data.detail || data.message
        : data;

    throw new Error(
      typeof detail === "string" && detail
        ? detail
        : `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

const mql5Api = {
  mentorOrders() {
    return request("/mentor/mql5/orders");
  },

  getOrders() {
    return this.mentorOrders();
  },

  createOrder(payload) {
    const mentorId = getMentorId();

    if (!mentorId) {
      return Promise.reject(
        new Error(
          "Your mentor ID is missing. Log out and log back in before ordering."
        )
      );
    }

    const eaName = String(payload?.ea_name || "").trim();

    if (!eaName) {
      return Promise.reject(new Error("Enter an EA name."));
    }

    const price = Number(payload.price);

    if (!Number.isFinite(price) || price < 0) {
      return Promise.reject(new Error("Enter a valid order price."));
    }

    return request("/mentor/mql5/orders", {
      method: "POST",
      body: JSON.stringify({
        mentor_id: mentorId,
        ea_name: eaName,
        price,
        currency: String(payload.currency || "USD").toUpperCase(),
      }),
    });
  },

  async download(orderId) {
    if (!orderId) {
      throw new Error("The order ID is missing.");
    }

    const response = await fetch(
      `${API_BASE_URL}/mentor/mql5/orders/${encodeURIComponent(
        orderId
      )}/download`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      let message = `Download failed with HTTP ${response.status}.`;

      try {
        const data = await response.json();
        message = data.detail || data.message || message;
      } catch {
        // Retain the HTTP status message when the response isn't JSON.
      }

      throw new Error(message);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const disposition = response.headers.get("content-disposition") || "";
    const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
    const filename = filenameMatch?.[1] || `Ghost-Nexus-EA-${orderId}.ex5`;

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  },
};

export default mql5Api;
