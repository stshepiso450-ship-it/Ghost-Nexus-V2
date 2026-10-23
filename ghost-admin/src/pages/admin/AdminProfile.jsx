import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Save,
} from "lucide-react";

import "./AdminProfile.css";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    mentorId: "",
    name: "",
    phone: "",
    email: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    setProfilePicture(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      // Backend API will be connected here.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-profile-page">

      <div className="admin-profile-header">
        <div>
          <div className="admin-profile-eyebrow">
            <ShieldCheck size={16} />
            ADMINISTRATOR PROFILE
          </div>

          <h1>Admin Profile</h1>

          <p>
            Manage the administrator identity and contact
            information for Ghost Nexus.
          </p>
        </div>
      </div>

      <form
        className="admin-profile-form"
        onSubmit={handleSubmit}
      >

        <section className="profile-card profile-picture-card">

          <div className="profile-card-header">
            <div>
              <h2>Profile Picture</h2>
              <p>
                Upload the image used for your administrator profile.
              </p>
            </div>
          </div>

          <div className="profile-picture-area">

            <div className="profile-avatar">

              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Admin profile"
                />
              ) : (
                <User size={42} />
              )}

            </div>

            <div className="profile-picture-actions">

              <label className="upload-button">
                <Camera size={17} />
                Upload Picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  hidden
                />
              </label>

              <span>
                JPG, PNG or WEBP
              </span>

            </div>

          </div>

        </section>

        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>Administrator Information</h2>
              <p>
                Your Ghost Nexus administrator account details.
              </p>
            </div>
          </div>

          <div className="profile-fields">

            <div className="profile-field">

              <label>
                Mentor ID
              </label>

              <div className="profile-input">

                <ShieldCheck size={17} />

                <input
                  type="text"
                  name="mentorId"
                  value={profile.mentorId}
                  onChange={handleChange}
                  placeholder="Enter mentor ID"
                />

              </div>

            </div>

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <div className="profile-input">

                <User size={17} />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter administrator name"
                />

              </div>

            </div>

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <div className="profile-input">

                <Phone size={17} />

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+27..."
                />

              </div>

            </div>

            <div className="profile-field">

              <label>
                Email Address
              </label>

              <div className="profile-input">

                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                />

              </div>

            </div>

          </div>

        </section>

        <div className="profile-form-footer">

          {message && (
            <div className="profile-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            <Save size={17} />

            {saving ? "Saving..." : "Save Profile"}
          </button>

        </div>

      </form>

    </div>
  );
}