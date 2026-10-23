import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/BecomeAMentor.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function BecomeAMentor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "South Africa",
    trading_experience: "",
    trading_style: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    type: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setResult({
      type: "",
      message: "",
    });

    if (!form.full_name.trim()) {
      setResult({
        type: "error",
        message: "Please enter your full name.",
      });
      return;
    }

    if (!form.email.trim()) {
      setResult({
        type: "error",
        message: "Please enter your email address.",
      });
      return;
    }

    if (!form.trading_experience) {
      setResult({
        type: "error",
        message: "Please select your trading experience.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/mentor-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to submit your application."
        );
      }

      setResult({
        type: "success",
        message:
          data.message ||
          "Your mentor application has been submitted successfully.",
      });

      setForm({
        full_name: "",
        email: "",
        phone: "",
        country: "South Africa",
        trading_experience: "",
        trading_style: "",
        message: "",
      });

    } catch (error) {
      setResult({
        type: "error",
        message:
          error.message ||
          "Something went wrong while submitting your application.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mentor-application-page">

      <section className="mentor-application-wrapper">

        <div className="mentor-application-intro">

          <Link to="/" className="mentor-back-home">
            ← Back to Ghost Nexus
          </Link>

          <span className="mentor-application-label">
            GHOST NEXUS MENTOR PROGRAM
          </span>

          <h1>
            Become a
            <br />
            <span>Ghost Nexus Mentor.</span>
          </h1>

          <p>
            Build your presence inside the Ghost Nexus ecosystem.
            Submit your application and the administration team will
            review your information.
          </p>

          <div className="mentor-benefits">

            <div className="mentor-benefit">
              <span>01</span>
              <div>
                <strong>Apply</strong>
                <p>Submit your mentor application.</p>
              </div>
            </div>

            <div className="mentor-benefit">
              <span>02</span>
              <div>
                <strong>Review</strong>
                <p>Your application is reviewed by the admin team.</p>
              </div>
            </div>

            <div className="mentor-benefit">
              <span>03</span>
              <div>
                <strong>Approval</strong>
                <p>Approved mentors receive their mentor credentials.</p>
              </div>
            </div>

          </div>

        </div>

        <div className="mentor-application-card">

          <div className="mentor-card-header">
            <div>
              <span>APPLICATION</span>
              <h2>Mentor Registration</h2>
            </div>

            <div className="mentor-card-status">
              <span></span>
              OPEN
            </div>
          </div>

          {result.message && (
            <div
              className={`mentor-form-message ${
                result.type === "success"
                  ? "success"
                  : "error"
              }`}
            >
              {result.message}
            </div>
          )}

          <form
            className="mentor-application-form"
            onSubmit={handleSubmit}
          >

            <div className="mentor-form-grid">

              <div className="mentor-field">
                <label htmlFor="full_name">
                  Full Name
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mentor-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mentor-field">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+27..."
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mentor-field">
                <label htmlFor="country">
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>

              <div className="mentor-field">
                <label htmlFor="trading_experience">
                  Trading Experience
                </label>

                <select
                  id="trading_experience"
                  name="trading_experience"
                  value={form.trading_experience}
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
              </div>

              <div className="mentor-field">
                <label htmlFor="trading_style">
                  Trading Style
                </label>

                <select
                  id="trading_style"
                  name="trading_style"
                  value={form.trading_style}
                  onChange={handleChange}
                >
                  <option value="">
                    Select style
                  </option>

                  <option value="scalping">
                    Scalping
                  </option>

                  <option value="day_trading">
                    Day Trading
                  </option>

                  <option value="swing">
                    Swing Trading
                  </option>

                  <option value="forex">
                    Forex
                  </option>

                  <option value="indices">
                    Indices
                  </option>

                  <option value="crypto">
                    Crypto
                  </option>

                  <option value="multi_asset">
                    Multi Asset
                  </option>
                </select>
              </div>

            </div>

            <div className="mentor-field">
              <label htmlFor="message">
                Tell us about yourself
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell us about your trading experience, audience or community, and why you want to become a Ghost Nexus Mentor."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <div className="mentor-form-footer">

              <p>
                By submitting this application, you agree that the
                information provided can be reviewed by the Ghost
                Nexus administration team.
              </p>

              <button
                type="submit"
                className="mentor-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application →"}
              </button>

            </div>

          </form>

          <div className="mentor-login-link">
            Already approved?
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Mentor Login
            </button>
          </div>

        </div>

      </section>

    </main>
  );
}