
const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const TOKEN_KEY = "ghost_nexus_mentor_token";
const MENTOR_KEY = "ghost_nexus_mentor";

function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("mentor_token") ||
    ""
  );
}

function saveMentor(data) {
  const mentor = data?.mentor || data?.profile || data;

  if (!mentor || typeof mentor !== "object") return;

  const previous = (() => {
    try {
      return JSON.parse(localStorage.getItem(MENTOR_KEY) || "{}");
    } catch {
      return {};
    }
  })();

  const merged = {
    ...previous,
    mentor_id: mentor.mentor_id || previous.mentor_id || "",
    name:
      mentor.name ||
      mentor.mentor_name ||
      mentor.full_name ||
      previous.name ||
      "",
    mentor_name:
      mentor.mentor_name ||
      mentor.name ||
      mentor.full_name ||
      previous.mentor_name ||
      "",
    email: mentor.email || previous.email || "",
    phone: mentor.phone ?? previous.phone ?? "",
    bio: mentor.bio ?? previous.bio ?? "",
    status: mentor.status || previous.status || "",
    profile_image_url:
      mentor.profile_image_url ||
      mentor.mentor_profile_image_url ||
      mentor.profile_picture ||
      mentor.avatar_url ||
      previous.profile_image_url ||
      "",
  };

  localStorage.setItem(MENTOR_KEY, JSON.stringify(merged));

  if (merged.profile_image_url) {
    localStorage.setItem(
      "ghost_nexus_mentor_avatar",
      merged.profile_image_url
    );
  }
}

async function request(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(options.body && !isFormData
      ? { "Content-Type": "application/json" }
      : {}),
    ...(getToken()
      ? { Authorization: `Bearer ${getToken()}` }
      : {}),
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
  async login(credentials) {
    const data = await request("/api/mentor/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (!data?.access_token) {
      throw new Error(
        "The server did not return a mentor access token."
      );
    }

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.removeItem("mentor_token");

    saveMentor(data);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("mentor_token");
    localStorage.removeItem(MENTOR_KEY);
    localStorage.removeItem("ghost_nexus_mentor_avatar");
    localStorage.removeItem("ghost_nexus_mentor_logged_in");
    sessionStorage.removeItem("ghost_nexus_mentor_logged_in");
  },

  async getProfile() {
    const data = await request("/api/mentor/me");
    saveMentor(data);
    return data;
  },

  async updateProfile(profile) {
    const data = await request("/api/mentor/me", {
      method: "PATCH",
      body: JSON.stringify(profile),
    });

    saveMentor(data);
    return data;
  },

  async uploadProfilePicture(file) {
    if (!(file instanceof File)) {
      throw new Error("Please select an image file.");
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      throw new Error("Choose a JPG, PNG, or WebP image.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("The picture must be 5 MB or smaller.");
    }

    const form = new FormData();
    form.append("file", file);

    const data = await request("/api/mentor/profile/picture", {
      method: "POST",
      body: form,
    });

    saveMentor(data.mentor || data);
    return data;
  },

  async removeProfilePicture() {
    const data = await request("/api/mentor/profile/picture", {
      method: "DELETE",
    });

    saveMentor(data.mentor || data);

    localStorage.removeItem("ghost_nexus_mentor_avatar");
    return data;
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

  generateLicenses(eaId, count = 500, clientId = null, clientEmail = null) {
    return request(
      `/api/mentor/eas/${encodeURIComponent(eaId)}/licenses/generate`,
      {
        method: "POST",
        body: JSON.stringify({
          count,
          client_id: clientId,
          client_email: clientEmail,
        }),
      }
    );
  },
  getPayments() {
    return request("/api/mentor/payments");
  },
};

export default mentorApi;
