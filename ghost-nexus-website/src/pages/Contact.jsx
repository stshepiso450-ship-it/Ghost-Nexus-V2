import React, { useState } from "react";
import SEO from "../components/SEO";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * Backend endpoint can be connected here:
     *
     * POST /contact
     */

    setStatus(
      "Your message is ready to be connected to the Ghost Nexus support system."
    );
  };

  return (
    <>
      <SEO
        title="Contact Ghost Nexus"
        description="Contact Ghost Nexus for platform information, mentor opportunities, support and business enquiries."
        path="/contact"
      />

      <Navbar />

      <main className="ghost-page ghost-contact-page">

        <section className="ghost-page-hero">

          <span className="ghost-section-kicker">
            CONTACT GHOST NEXUS
          </span>

          <h1>
            Connect With
            <span> Ghost Nexus.</span>
          </h1>

          <p>
            Have a question about Ghost Nexus,
            becoming a mentor, the platform or
            business opportunities?
          </p>

        </section>

        <section className="ghost-contact-grid">

          <div className="ghost-contact-info">

            <span className="ghost-section-kicker">
              GET IN TOUCH
            </span>

            <h2>
              Let's talk.
            </h2>

            <p>
              Send us a message and the Ghost Nexus
              team can respond through the connected
              support system.
            </p>

            <div className="ghost-contact-item">
              <span>MENTOR</span>
              <strong>
                Mentor applications
              </strong>
            </div>

            <div className="ghost-contact-item">
              <span>SUPPORT</span>
              <strong>
                Platform assistance
              </strong>
            </div>

            <div className="ghost-contact-item">
              <span>BUSINESS</span>
              <strong>
                Partnerships and enquiries
              </strong>
            </div>

          </div>

          <form
            className="ghost-contact-form"
            onSubmit={handleSubmit}
          >

            <label>
              NAME

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>

            <label>
              EMAIL

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              SUBJECT

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </label>

            <label>
              MESSAGE

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows="7"
                required
              />
            </label>

            {status && (
              <div className="ghost-auth-success">
                {status}
              </div>
            )}

            <button
              type="submit"
              className="ghost-primary-button"
            >
              SEND MESSAGE
              <span>→</span>
            </button>

          </form>

        </section>

      </main>

      <Footer />
    </>
  );
}