
const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const TOKEN_KEY = "ghost_nexus_mentor_token";

async function request(path, options = {}) {
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("mentor_token");

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.body && !isFormData
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
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
        : `API request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

const mentorApi = {
  login(credentials) {
    return request("/api/mentor/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }).then((data) => {
      if (data?.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
      } else {
        throw new Error(
          "The server did not return a mentor access token."
        );
      }

      return data;
    });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("mentor_token");
    localStorage.removeItem("ghost_nexus_mentor");
    localStorage.removeItem("ghost_nexus_mentor_logged_in");
    sessionStorage.removeItem("ghost_nexus_mentor_logged_in");
  },

  getProfile() {
    return request("/api/mentor/me");
  },

  updateProfile(profile) {
    return request("/api/mentor/me", {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
  },

  uploadProfilePicture(file) {
    if (!(file instanceof File)) {
      return Promise.reject(
        new Error("Please select an image file.")
      );
    }

    const body = new FormData();
    body.append("file", file);

    return request("/api/mentor/profile/picture", {
      method: "POST",
      body,
    });
  },

  removeProfilePicture() {
    return request("/api/mentor/profile/picture", {
      method: "DELETE",
    });
  },

  getDashboard() {
    return request("/api/mentor/dashboard");
  },

  getEAs() {
    return request("/api/mentor/eas");
  },

  getLicenses() {
    return request("/api/mentor/licenses");
  },

  getClients() {
    return request("/api/mentor/clients");
  },

  getOrders() {
    return request("/api/mentor/orders");
  },

  getPayments() {
    return request("/api/mentor/payments");
  },
};

export default mentorApi;
