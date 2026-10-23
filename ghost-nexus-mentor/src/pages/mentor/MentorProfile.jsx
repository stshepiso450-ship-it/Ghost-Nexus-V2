
import React, { useCallback, useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  LoaderCircle,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import "./MentorProfile.css";

const API = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function getToken() {
  return (
    localStorage.getItem("ghost_nexus_mentor_token") ||
    localStorage.getItem("mentor_token") ||
    ""
  );
}

function getPhotoUrl(path) {
  if (!path) return "";

  const value = String(path).trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(
    value.startsWith("/") ? value : `/${value}`,
    `${API}/`
  ).href;
}

function normaliseProfile(data = {}) {
  const p = data.mentor || data.profile || data;

  return {
    name: p.name || p.mentor_name || p.full_name || "",
    email: p.email || "",
    phone: p.phone || "",
    bio: p.bio || "",
    image:
      p.profile_image_url ||
      p.mentor_profile_image_url ||
      p.profile_picture ||
      p.avatar_url ||
      "",
    mentor_id: p.mentor_id || "",
    status: p.status || "",
  };
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Your mentor session is missing. Log out and log in again through the mentor portal."
    );
  }

  const isForm = options.body instanceof FormData;

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body && !isForm
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    const detail =
      typeof data === "object"
        ? data.detail || data.message
        : data;

    throw new Error(
      detail ||
        `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

export default function MentorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
    mentor_id: "",
    status: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/mentor/me");
      const next = normaliseProfile(data);

      setProfile(next);
      setImageFailed(false);
      setPreview("");
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "Could not load your mentor profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function updateField(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  function choosePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your picture must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setImageFailed(false);
    setError("");
    setMessage("Picture selected. Click Save Profile to upload it.");
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Save the text fields first.
      const saved = await apiRequest("/api/mentor/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          bio: profile.bio.trim(),
        }),
      });

      setProfile((current) => ({
        ...current,
        ...normaliseProfile(saved),
      }));

      // Upload the chosen photo and save its URL.
      if (selectedFile) {
        setUploading(true);

        const form = new FormData();
        form.append("file", selectedFile);

        const uploaded = await apiRequest(
          "/api/mentor/profile/picture",
          {
            method: "POST",
            body: form,
          }
        );

        const next = normaliseProfile(
          uploaded.mentor || uploaded
        );

        setProfile((current) => ({
          ...current,
          ...next,
          image: next.image || uploaded.profile_image_url || current.image,
        }));

        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
        setSelectedFile(null);
        setImageFailed(false);
      }

      // Fetch the authoritative saved profile from the API.
      const latest = await apiRequest("/api/mentor/me");
      setProfile(normaliseProfile(latest));
      setImageFailed(false);

      setMessage("Your mentor profile has been saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save your profile.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function removePhoto() {
    if (!profile.image && !selectedFile) return;

    setRemoving(true);
    setError("");
    setMessage("");

    try {
      if (selectedFile) {
        setSelectedFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
      } else {
        await apiRequest("/api/mentor/profile/picture", {
          method: "DELETE",
        });

        const latest = await apiRequest("/api/mentor/me");
        setProfile(normaliseProfile(latest));
      }

      setImageFailed(false);
      setMessage("Profile picture removed.");
    } catch (err) {
      setError(err.message || "Could not remove your picture.");
    } finally {
      setRemoving(false);
    }
  }

  const displayedImage = preview || getPhotoUrl(profile.image);
  const showImage = Boolean(displayedImage) && !imageFailed;

  return (
    <main className="gn-profile-page">
      <header className="gn-profile-heading">
        <div>
          <p className="gn-profile-eyebrow">GHOST NEXUS · MENTOR PORTAL</p>
          <h1>My Profile</h1>
          <p className="gn-profile-subtitle">
            Manage your mentor identity and profile picture.
          </p>
        </div>

        <div className="gn-profile-status">
          <span className="gn-profile-status-dot" />
          {profile.status || "Mentor"}
        </div>
      </header>

      {error && (
        <div className="gn-profile-notice gn-profile-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="gn-profile-notice gn-profile-success" role="status">
          <CheckCircle2 size={17} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="gn-profile-loading">
          <LoaderCircle className="gn-profile-spinner" size={28} />
          <span>Loading your saved profile...</span>
        </div>
      ) : (
        <form className="gn-profile-layout" onSubmit={saveProfile}>
          <section className="gn-profile-card gn-profile-photo-card">
            <p className="gn-profile-section-label">PROFILE PICTURE</p>

            <div className="gn-profile-avatar-ring">
              {showImage ? (
                <img
                  key={displayedImage}
                  src={displayedImage}
                  alt={`${profile.name || "Mentor"} profile`}
                  className="gn-profile-avatar"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="gn-profile-avatar-placeholder">
                  <UserRound size={48} />
                </div>
              )}
            </div>

            <h2 className="gn-profile-display-name">
              {profile.name || "Your name"}
            </h2>

            <p className="gn-profile-display-email">
              {profile.email || "Your mentor email"}
            </p>

            <label className="gn-profile-upload-button">
              <Camera size={17} />
              <span>{uploading ? "Uploading..." : "Choose Picture"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePhoto}
                disabled={saving || removing}
              />
            </label>

            <p className="gn-profile-hint">
              JPG, PNG or WebP · Maximum 5 MB
            </p>

            {(profile.image || selectedFile) && (
              <button
                type="button"
                className="gn-profile-remove-button"
                onClick={removePhoto}
                disabled={saving || removing}
              >
                <Trash2 size={15} />
                {removing ? "Removing..." : "Remove Picture"}
              </button>
            )}

            {profile.mentor_id && (
              <div className="gn-profile-id">
                <span>MENTOR ID</span>
                <strong>{profile.mentor_id}</strong>
              </div>
            )}
          </section>

          <section className="gn-profile-card gn-profile-details-card">
            <div className="gn-profile-section-heading">
              <div>
                <p className="gn-profile-section-label">ACCOUNT INFORMATION</p>
                <h2>Personal Details</h2>
              </div>
            </div>

            <label className="gn-profile-field">
              <span>Full Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                maxLength={150}
                required
              />
            </label>

            <label className="gn-profile-field">
              <span>Email Address</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="gn-profile-field">
              <span>Phone Number</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter your phone number"
                maxLength={50}
              />
            </label>

            <label className="gn-profile-field">
              <span>Mentor Bio</span>
              <textarea
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Tell clients about your trading experience..."
                rows={5}
                maxLength={2000}
              />
              <small>{profile.bio.length}/2000 characters</small>
            </label>

            <div className="gn-profile-actions">
              <button
                className="gn-profile-save-button"
                type="submit"
                disabled={saving || uploading || removing}
              >
                {saving ? (
                  <LoaderCircle className="gn-profile-spinner" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving
                  ? uploading
                    ? "Uploading picture..."
                    : "Saving profile..."
                  : "Save Profile"}
              </button>

              <button
                className="gn-profile-refresh-button"
                type="button"
                onClick={loadProfile}
                disabled={saving || loading}
              >
                Reload Saved Profile
              </button>
            </div>
          </section>
        </form>
      )}
    </main>
  );
}
