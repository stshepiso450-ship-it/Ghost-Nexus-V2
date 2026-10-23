import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SEO from "../components/SEO";

import "../styles/app.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.password
    ) {
      setError(
        "Enter your administrator credentials."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            email:
              form.email.trim(),
            password:
              form.password,
          }),
        }
      );

      const data =
        await response.json().catch(
          () => ({})
        );

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Administrator authentication failed."
        );
      }

      /*
       * SECURITY:
       * Admin login must be verified by the
       * backend. Never rely on frontend role
       * checks alone.
       */

      if (
        data.role &&
        data.role !== "admin"
      ) {
        throw new Error(
          "Administrator access required."
        );
      }

      if (data.access_token) {
        localStorage.setItem(
          "ghost_admin_token",
          data.access_token
        );
      }

      if (data.admin) {
        localStorage.setItem(
          "ghost_admin",
          JSON.stringify(
            data.admin
          )
        );
      }

      localStorage.removeItem(
        "ghost_mentor_token"
      );

      localStorage.removeItem(
        "ghost_mentor"
      );

      navigate("/admin");

    } catch (loginError) {
      setError(
        loginError.message ||
          "Unable to connect to the admin server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Administrator Login"
        description="Ghost Nexus administrator portal."
        path="/admin/login"
        noIndex={true}
      />

      <main className="ghost-admin-login-page">

        <div className="ghost-admin-login-container">

          <div className="ghost-admin-brand">

            <Link
              to="/"
              className="ghost-admin-logo"
            >
              <div className="ghost-admin-logo-mark">
                G
              </div>

              <div>
                <strong>
                  GHOST NEXUS
                </strong>

                <span>
                  ADMINISTRATION
                </span>
              </div>
            </Link>

          </div>

          <section className="ghost-admin-login-card">

            <div className="ghost-admin-login-header">

              <div className="ghost-admin-security-icon">
                🔐
              </div>

              <span className="ghost-section-kicker">
                RESTRICTED ACCESS
              </span>

              <h1>
                Administrator
                <span> Portal.</span>
              </h1>

              <p>
                Authorized Ghost Nexus administrator
                access only.
              </p>

            </div>

            <form
              className="ghost-admin-login-form"
              onSubmit={handleSubmit}
            >

              <label>
                ADMIN EMAIL

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Administrator email"
                  autoComplete="username"
                  required
                />
              </label>

              <label>
                PASSWORD

                <div className="ghost-admin-password">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Secure password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                  >
                    {showPassword
                      ? "HIDE"
                      : "SHOW"}
                  </button>

                </div>
              </label>

              {error && (
                <div className="ghost-admin-login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="ghost-admin-login-button"
                disabled={loading}
              >
                {loading
                  ? "AUTHENTICATING..."
                  : "ENTER ADMIN PORTAL"}

                <span>→</span>
              </button>

            </form>

            <div className="ghost-admin-security">

              <div>
                <span />
                SECURE ADMIN CONNECTION
              </div>

              <p>
                Administrator access is separate
                from mentor registration and mentor
                login.
              </p>

            </div>

          </section>

          <Link
            to="/"
            className="ghost-admin-back"
          >
            ← BACK TO GHOST NEXUS
          </Link>

        </div>

      </main>
    </>
  );
}