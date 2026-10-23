import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SEO from "../components/SEO";

import "../styles/app.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    experience: "",
    specialty: "",
    bio: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.experience ||
      !form.specialty
    ) {
      setError(
        "Please complete all required mentor registration fields."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/mentors/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            name:
              form.name.trim(),

            email:
              form.email.trim(),

            phone:
              form.phone.trim(),

            password:
              form.password,

            experience:
              form.experience,

            specialty:
              form.specialty,

            bio:
              form.bio.trim(),

            role: "mentor",
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
            "Mentor registration failed."
        );
      }

      localStorage.removeItem(
        "ghost_admin_token"
      );

      setSuccess(
        "Your mentor application has been submitted successfully and is awaiting approval."
      );

      if (data.mentor) {
        localStorage.setItem(
          "ghost_mentor",
          JSON.stringify(
            data.mentor
          )
        );
      }

      setTimeout(() => {
        navigate("/");
      }, 2500);

    } catch (registrationError) {
      setError(
        registrationError.message ||
          "Unable to submit mentor application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Become a Ghost Nexus Mentor"
        description="Apply to become a Ghost Nexus mentor."
        path="/register"
        noIndex={true}
      />

      <main className="ghost-auth-page">

        <div className="ghost-auth-container">

          <div className="ghost-auth-brand">

            <Link
              to="/"
              className="ghost-auth-logo"
            >
              <div>G</div>

              <span>
                GHOST NEXUS
              </span>
            </Link>

            <span className="ghost-auth-system">
              MENTOR REGISTRATION
            </span>

          </div>

          <section className="ghost-auth-card ghost-mentor-register-card">

            <div className="ghost-auth-header">

              <span className="ghost-section-kicker">
                BECOME A GHOST NEXUS MENTOR
              </span>

              <h1>
                Join The
                <span> Mentor Network.</span>
              </h1>

              <p>
                Submit your mentor application
                for Ghost Nexus approval.
              </p>

            </div>

            <form
              className="ghost-auth-form"
              onSubmit={handleSubmit}
            >

              <label>
                FULL NAME

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                EMAIL ADDRESS

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                PHONE NUMBER

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+27 ..."
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                TRADING EXPERIENCE

                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select experience
                  </option>

                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>

                  <option value="professional">
                    Professional
                  </option>
                </select>
              </label>

              <label>
                TRADING SPECIALTY

                <select
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select specialty
                  </option>

                  <option value="forex">
                    Forex
                  </option>

                  <option value="gold">
                    Gold / XAUUSD
                  </option>

                  <option value="indices">
                    Indices
                  </option>

                  <option value="crypto">
                    Cryptocurrency
                  </option>

                  <option value="technical-analysis">
                    Technical Analysis
                  </option>

                  <option value="fundamental-analysis">
                    Fundamental Analysis
                  </option>

                  <option value="multiple">
                    Multiple Markets
                  </option>
                </select>
              </label>

              <label>
                PASSWORD

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                />
              </label>

              <label>
                CONFIRM PASSWORD

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />
              </label>

              <label>
                MENTOR BIO

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your trading experience and what you would teach..."
                  rows="6"
                />
              </label>

              {error && (
                <div className="ghost-auth-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="ghost-auth-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="ghost-auth-submit"
                disabled={loading}
              >
                {loading
                  ? "SUBMITTING..."
                  : "REGISTER AS MENTOR"}

                <span>→</span>
              </button>

            </form>

            <div className="ghost-mentor-notice">

              <strong>
                APPLICATION REVIEW
              </strong>

              <p>
                Registration does not grant
                administrator access. Your mentor
                account must be approved before you
                can enter the mentor portal.
              </p>

            </div>

            <div className="ghost-auth-register">

              <span>
                Already registered?
              </span>

              <Link to="/login">
                MENTOR LOGIN
              </Link>

            </div>

          </section>

          <div className="ghost-auth-footer">

            <span>
              <i />
              GHOST NEXUS SYSTEM
            </span>

            <span>
              MENTOR APPLICATION
            </span>

          </div>

        </div>

      </main>
    </>
  );
}