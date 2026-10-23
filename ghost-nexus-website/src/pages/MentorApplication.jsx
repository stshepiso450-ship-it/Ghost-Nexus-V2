import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/MentorApplication.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  password: "",
  confirm_password: "",
  skills: "",
  experience: "",
  trading_experience: "",
  mentorship_category: "",
  motivation: "",
  availability: "",
  profile_link: "",
};

export default function MentorApplication() {
  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (form.password.length < 8) {
        throw new Error(
          "Your password must contain at least 8 characters."
        );
      }

      if (form.password !== form.confirm_password) {
        throw new Error(
          "Your password and confirmation password do not match."
        );
      }

      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        country: form.country.trim(),

        password: form.password,

        skills: form.skills.trim(),
        experience: form.experience.trim(),
        trading_experience: form.trading_experience.trim(),
        mentorship_category: form.mentorship_category,
        motivation: form.motivation.trim(),
        availability: form.availability,
        profile_link: form.profile_link.trim(),
      };

      const response = await fetch(
        `${API_URL}/api/mentor-applications/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let message =
          "Unable to submit your mentor application.";

        if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data?.detail)) {
          message = data.detail
            .map(
              (item) =>
                item?.msg || "Invalid form data."
            )
            .join(", ");
        } else if (data?.message) {
          message = data.message;
        }

        throw new Error(message);
      }

      setResult(data);

      setForm({
        ...EMPTY_FORM,
      });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the Ghost Nexus server. Make sure the FastAPI backend is running."
        );
      } else {
        setError(
          err?.message ||
            "Something went wrong while submitting your application."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Become a Mentor | Ghost Nexus"
        description="Apply to become a Ghost Nexus mentor and share your skills, experience and knowledge with the Ghost Nexus community."
      />

      <Navbar />

      <main className="mentor-page">
        <div className="mentor-page-glow mentor-page-glow-one" />
        <div className="mentor-page-glow mentor-page-glow-two" />

        <div className="mentor-container">
          <Link to="/" className="mentor-back-link">
            <ArrowLeft size={16} />
            Back to Ghost Nexus
          </Link>

          <section className="mentor-hero">
            <div className="mentor-badge">
              <UserPlus size={14} />
              GHOST NEXUS MENTOR PROGRAM
            </div>

            <h1 className="mentor-title">
              Become a <span>Mentor</span>
            </h1>

            <p className="mentor-description">
              Share your knowledge, experience and skills
              with the Ghost Nexus community. Submit your
              application and our team will review it before
              your mentor account is approved.
            </p>
          </section>

          <section className="mentor-program-grid">
            <div className="mentor-program-card">
              <div className="mentor-program-icon">
                <FileText size={21} />
              </div>

              <div>
                <strong>1. Apply</strong>

                <span>
                  Complete the mentor application with your
                  experience and areas of expertise.
                </span>
              </div>
            </div>

            <div className="mentor-program-card">
              <div className="mentor-program-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <strong>2. Review</strong>

                <span>
                  Ghost Nexus reviews your application and
                  verifies the information provided.
                </span>
              </div>
            </div>

            <div className="mentor-program-card">
              <div className="mentor-program-icon">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <strong>3. Approval</strong>

                <span>
                  Approved mentors receive access to the
                  mentor system and mentor credentials.
                </span>
              </div>
            </div>

            <div className="mentor-program-card">
              <div className="mentor-program-icon">
                <GraduationCap size={21} />
              </div>

              <div>
                <strong>4. Mentor</strong>

                <span>
                  Build your mentor profile and work with the
                  Ghost Nexus community.
                </span>
              </div>
            </div>
          </section>

          {result && (
            <section className="mentor-success">
              <div className="mentor-success-icon">
                <CheckCircle2 size={34} />
              </div>

              <div className="mentor-success-content">
                <span className="mentor-success-label">
                  APPLICATION RECEIVED
                </span>

                <h2>Application Submitted</h2>

                <p>
                  Your Ghost Nexus mentor application has
                  been successfully submitted.
                </p>

                {result.application?.id && (
                  <div className="application-number">
                    <span>Application ID</span>

                    <strong>
                      #{result.application.id}
                    </strong>
                  </div>
                )}

                <div className="pending-status">
                  <Clock3 size={15} />
                  STATUS: PENDING REVIEW
                </div>

                <p className="mentor-success-note">
                  Our team will review your application and
                  update your mentor status after the review
                  process. Your password will remain private
                  and will be used for Mentor Portal login
                  after approval.
                </p>

                <div className="mentor-success-actions">
                  <Link
                    to="/"
                    className="mentor-success-button"
                  >
                    Return Home
                  </Link>

                  <Link
                    to="/mentor/login"
                    className="mentor-success-button secondary"
                  >
                    Mentor Login
                  </Link>
                </div>
              </div>
            </section>
          )}

          {error && (
            <div className="mentor-error" role="alert">
              <strong>Application Error</strong>

              <span>{error}</span>
            </div>
          )}

          {!result && (
            <form
              className="mentor-form"
              onSubmit={handleSubmit}
            >
              <div className="form-section">
                <div className="form-section-heading">
                  <div className="form-section-number">
                    01
                  </div>

                  <div>
                    <h2>Personal Information</h2>

                    <p>
                      Tell us who you are and how we can
                      contact you.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="full_name">
                      Full Name
                    </label>

                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+27..."
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">
                      Country
                    </label>

                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="South Africa"
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD SECTION */}

              <div className="form-section mentor-password-section">
                <div className="form-section-heading">
                  <div className="form-section-number">
                    02
                  </div>

                  <div>
                    <h2>Mentor Login Security</h2>

                    <p>
                      Create the password you will use to
                      access the Mentor Portal after approval.
                    </p>
                  </div>
                </div>

                <div className="mentor-security-box">
                  <ShieldCheck size={22} />

                  <div>
                    <strong>
                      Your password stays private
                    </strong>

                    <span>
                      Ghost Nexus will securely hash your
                      password. Administrators will not see
                      your password.
                    </span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="password">
                      Create Password
                    </label>

                    <div className="mentor-password-input">
                      <LockKeyhole size={17} />

                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    <small>
                      Minimum 8 characters.
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password">
                      Confirm Password
                    </label>

                    <div className="mentor-password-input">
                      <LockKeyhole size={17} />

                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={form.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    <small>
                      Enter the same password again.
                    </small>
                  </div>
                </div>

                {form.password &&
                  form.confirm_password &&
                  form.password !==
                    form.confirm_password && (
                    <div className="mentor-password-warning">
                      Passwords do not match.
                    </div>
                  )}

                {form.password &&
                  form.password.length >= 8 &&
                  form.confirm_password &&
                  form.password ===
                    form.confirm_password && (
                    <div className="mentor-password-valid">
                      <CheckCircle2 size={15} />
                      Passwords match.
                    </div>
                  )}
              </div>

              {/* EXPERIENCE */}

              <div className="form-section">
                <div className="form-section-heading">
                  <div className="form-section-number">
                    03
                  </div>

                  <div>
                    <h2>Experience</h2>

                    <p>
                      Tell us about your professional and
                      technical experience.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="skills">
                    Skills
                  </label>

                  <textarea
                    id="skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Describe your main skills..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">
                    Professional Experience
                  </label>

                  <textarea
                    id="experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Tell us about your professional experience..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="trading_experience">
                    Trading Experience
                  </label>

                  <textarea
                    id="trading_experience"
                    name="trading_experience"
                    value={form.trading_experience}
                    onChange={handleChange}
                    placeholder="Describe your trading experience, strategies or markets you work with..."
                  />
                </div>
              </div>

              {/* MENTORSHIP */}

              <div className="form-section">
                <div className="form-section-heading">
                  <div className="form-section-number">
                    04
                  </div>

                  <div>
                    <h2>Mentorship</h2>

                    <p>
                      Choose your mentorship area and tell
                      us why you want to join.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="mentorship_category">
                    Mentorship Category
                  </label>

                  <select
                    id="mentorship_category"
                    name="mentorship_category"
                    value={form.mentorship_category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a category
                    </option>

                    <option value="Trading">
                      Trading
                    </option>

                    <option value="Forex">
                      Forex
                    </option>

                    <option value="Technology">
                      Technology
                    </option>

                    <option value="ICT">
                      ICT
                    </option>

                    <option value="Programming">
                      Programming
                    </option>

                    <option value="Business">
                      Business
                    </option>

                    <option value="Career">
                      Career Development
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="motivation">
                    Why do you want to become a mentor?
                  </label>

                  <textarea
                    id="motivation"
                    name="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    placeholder="Tell us why you want to mentor and what you can offer the community..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availability">
                    Availability
                  </label>

                  <select
                    id="availability"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select availability
                    </option>

                    <option value="Weekdays">
                      Weekdays
                    </option>

                    <option value="Weekends">
                      Weekends
                    </option>

                    <option value="Evenings">
                      Evenings
                    </option>

                    <option value="Flexible">
                      Flexible
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="profile_link">
                    Profile / Portfolio Link
                  </label>

                  <input
                    id="profile_link"
                    type="url"
                    name="profile_link"
                    value={form.profile_link}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mentor-form-footer">
                <div className="mentor-form-security">
                  <ShieldCheck size={18} />

                  <span>
                    Your application is submitted securely.
                    Your password is protected and is never
                    displayed to administrators.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    form.password.length < 8 ||
                    form.password !==
                      form.confirm_password
                  }
                  className="mentor-submit"
                >
                  {loading ? (
                    <>
                      <span className="mentor-spinner" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Mentor Application

                      <ArrowLeft
                        size={18}
                        className="mentor-submit-arrow"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mentor-bottom-login">
            <span>
              Already have a mentor account?
            </span>

            <Link to="/mentor/login">
              Mentor Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
