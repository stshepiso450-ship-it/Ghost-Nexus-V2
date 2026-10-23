
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/MentorLogin.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PROFILE_KEY = "ghost_nexus_mentor";
const LOGIN_KEY = "ghost_nexus_mentor_logged_in";
const TOKEN_KEY = "ghost_nexus_mentor_token";

export default function MentorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Enter your mentor email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/mentor/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          result?.detail ||
          result?.message ||
          `Login failed with HTTP ${response.status}.`;

        throw new Error(
          typeof detail === "string" ? detail : JSON.stringify(detail)
        );
      }

      if (result?.success !== true || !result?.mentor_id) {
        throw new Error(
          result?.message || "The backend did not verify this mentor account."
        );
      }

      const status = String(result.status || "").toLowerCase();

      if (status !== "active") {
        throw new Error(
          "Your mentor account is not active. Contact the Ghost Nexus administrator."
        );
      }

      const profile = {
        mentor_id: result.mentor_id,
        mentor_name: result.mentor_name || "Mentor",
        email: result.email || email,
        status,
        api_key_prefix: result.api_key_prefix || "",
        last_login_at: result.last_login_at || null,
        logged_in: true,
        logged_in_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        localStorage.setItem(LOGIN_KEY, "true");
        sessionStorage.setItem(LOGIN_KEY, "true");

        // The current backend response does not provide a JWT.
        // Store a token only if the API actually returns one.
        if (
          typeof result.access_token === "string" &&
          result.access_token.length > 0
        ) {
          localStorage.setItem(TOKEN_KEY, result.access_token);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        throw new Error(
          "Your browser could not save the login information. Check browser storage settings."
        );
      }

      setSuccess("Mentor verified. Opening your dashboard...");

      navigate("/mentor/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          `Cannot connect to Ghost Nexus API at ${API_URL}. Check that the backend is running.`
        );
      } else {
        setError(err?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Mentor Login | Ghost Nexus"
        description="Secure access to your Ghost Nexus mentor account."
      />

      <Navbar />

      <main className="mentor-login-page">
        <div className="mentor-login-background" aria-hidden="true">
          <div className="mentor-login-grid" />
          <div className="mentor-login-orb mentor-login-orb-one" />
          <div className="mentor-login-orb mentor-login-orb-two" />
          <div className="mentor-login-orb mentor-login-orb-three" />
          <div className="mentor-login-glow" />
        </div>

        <div className="mentor-login-container">
          <div className="mentor-login-top-badge">
            <span className="mentor-login-live-dot" />
            GHOST NEXUS SYSTEM
            <span> / </span>
            MENTOR ACCESS
          </div>

          <section className="mentor-login-card">
            <div className="mentor-login-card-line" />

            <span
              className="mentor-login-corner mentor-login-corner-tl"
              aria-hidden="true"
            />
            <span
              className="mentor-login-corner mentor-login-corner-tr"
              aria-hidden="true"
            />
            <span
              className="mentor-login-corner mentor-login-corner-bl"
              aria-hidden="true"
            />
            <span
              className="mentor-login-corner mentor-login-corner-br"
              aria-hidden="true"
            />

            <header className="mentor-login-header">
              <div className="mentor-login-logo-wrap">
                <span className="mentor-login-logo-ring mentor-login-logo-ring-one" />
                <span className="mentor-login-logo-ring mentor-login-logo-ring-two" />

                <div className="mentor-login-logo">
                  <ShieldCheck size={34} />
                </div>
              </div>

              <div className="mentor-login-eyebrow">
                <Fingerprint size={14} />
                AUTHORIZED MENTORS ONLY
              </div>

              <h1>
                MENTOR <span>PORTAL</span>
              </h1>

              <p>
                Sign in to access your approved Ghost Nexus mentor
                environment.
              </p>
            </header>

            <div className="mentor-login-security">
              <div className="mentor-login-security-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <strong>Secure mentor authentication</strong>
                <span>
                  Your credentials are verified by the Ghost Nexus API.
                </span>
              </div>
            </div>

            {error && (
              <div
                className="mentor-login-error"
                role="alert"
                aria-live="assertive"
              >
                <div className="mentor-login-error-icon">
                  <AlertCircle size={18} />
                </div>

                <div>
                  <strong>Unable to sign in</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div
                className="mentor-login-success"
                role="status"
                aria-live="polite"
              >
                <ShieldCheck size={19} />
                <span>{success}</span>
              </div>
            )}

            <form
              className="mentor-login-form"
              onSubmit={handleSubmit}
            >
              <div className="mentor-login-field">
                <label htmlFor="mentor-email">Mentor Email</label>

                <div className="mentor-login-input-wrap">
                  <Mail
                    className="mentor-login-input-icon"
                    size={19}
                  />

                  <input
                    className="mentor-login-input mentor-login-input-with-icon"
                    id="mentor-email"
                    name="email"
                    type="email"
                    placeholder="Enter your mentor email"
                    autoComplete="username"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mentor-login-field">
                <label htmlFor="mentor-password">Password</label>

                <div className="mentor-login-password">
                  <LockKeyhole
                    className="mentor-login-input-icon"
                    size={19}
                  />

                  <input
                    className="mentor-login-input mentor-login-input-with-icon"
                    id="mentor-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="mentor-login-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mentor-login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="mentor-login-spinner"
                    />
                    VERIFYING CREDENTIALS...
                  </>
                ) : (
                  <>
                    MENTOR LOGIN
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mentor-login-divider">
              <span />
              <span>GHOST NEXUS</span>
              <span />
            </div>

            <div className="mentor-login-footer">
              <span>Not registered?</span>

              <Link to="/mentor/apply">
                APPLY AS MENTOR <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mentor-login-footer" style={{ marginTop: 13 }}>
              <span>Administrator?</span>

              <Link to="/admin/login">
                ADMIN LOGIN <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          <div className="mentor-login-bottom">
            <span className="mentor-login-bottom-dot" />
            GHOST NEXUS SYSTEM
            <span className="mentor-login-bottom-separator">/</span>
            MENTOR AUTHENTICATION
            <span className="mentor-login-bottom-separator">/</span>
            SECURE ACCESS
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
