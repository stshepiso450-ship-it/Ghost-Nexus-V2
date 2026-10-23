
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
} from "lucide-react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/MentorLogin.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

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
      setError("Please enter your mentor email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/mentor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          result?.detail ||
          result?.message ||
          (response.status === 404
            ? "Mentor login endpoint not found."
            : response.status === 401
              ? "Incorrect email or password."
              : `Login failed with HTTP ${response.status}.`);

        throw new Error(
          typeof detail === "string" ? detail : JSON.stringify(detail)
        );
      }

      if (
        result?.success !== true ||
        result?.status?.toLowerCase() === "rejected" ||
        result?.status?.toLowerCase() === "inactive"
      ) {
        throw new Error(
          result?.message || "Your mentor account is not active."
        );
      }

      if (!result?.mentor_id) {
        throw new Error(
          "The backend did not return a mentor ID. Please contact the administrator."
        );
      }

      const mentorProfile = {
        ...result,
        email: result.email || email,
        mentor_id: result.mentor_id,
        mentor_name: result.mentor_name || "Mentor",
        logged_in: true,
        logged_in_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          "ghost_nexus_mentor",
          JSON.stringify(mentorProfile)
        );

        localStorage.setItem("ghost_nexus_mentor_logged_in", "true");

        sessionStorage.setItem(
          "ghost_nexus_mentor_logged_in",
          "true"
        );
      } catch {
        throw new Error(
          "Unable to save your login session. Check browser storage settings."
        );
      }

      setSuccess("Login successful. Opening your mentor dashboard...");

      navigate("/mentor/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          `Cannot connect to the Ghost Nexus backend at ${API_URL}. ` +
            "Check that the backend is running and the API address is correct."
        );
      } else {
        setError(err?.message || "Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Mentor Login | Ghost Nexus"
        description="Sign in to your Ghost Nexus mentor portal."
      />

      <Navbar />

      <main className="mentor-login-page">
        <div className="mentor-login-container">
          <section className="mentor-login-card">
            <div className="mentor-login-brand">
              <div className="mentor-login-logo">
                <ShieldCheck size={32} />
              </div>

              <p className="mentor-login-eyebrow">GHOST NEXUS</p>

              <h1>MENTOR PORTAL</h1>

              <p className="mentor-login-subtitle">
                Secure access to your mentor account
              </p>
            </div>

            <div className="mentor-login-heading">
              <h2>Welcome Mentor</h2>

              <p>
                Sign in to manage your EAs, clients, and licenses.
              </p>
            </div>

            {error && (
              <div
                className="mentor-login-message mentor-login-error"
                role="alert"
              >
                <AlertCircle size={19} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                className="mentor-login-message mentor-login-success"
                role="status"
              >
                <ShieldCheck size={19} />
                <span>{success}</span>
              </div>
            )}

            <form
              className="mentor-login-form"
              onSubmit={handleSubmit}
            >
              <label htmlFor="mentor-email">Mentor Email</label>

              <div className="mentor-login-input-wrap">
                <Mail size={19} />

                <input
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

              <label htmlFor="mentor-password">Password</label>

              <div className="mentor-login-input-wrap">
                <LockKeyhole size={19} />

                <input
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

              <button
                type="submit"
                className="mentor-login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="mentor-login-spinner"
                    />
                    VERIFYING LOGIN...
                  </>
                ) : (
                  "MENTOR LOGIN"
                )}
              </button>
            </form>

            <div className="mentor-login-footer">
              <p>
                Not a mentor yet?{" "}
                <Link to="/mentor/apply">
                  Apply to become a mentor
                </Link>
              </p>

              <p className="mentor-login-admin-link">
                <Link to="/admin/login">
                  Administrator login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
