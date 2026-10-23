import React from "react";
import { Check, Smartphone, Monitor, Apple, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/pricing.css";

const plans = [
  {
    name: "Mobile",
    price: "R1,500",
    icon: Smartphone,
    description:
      "Ghost Nexus access designed for mobile users.",
    features: [
      "Ghost Nexus mobile experience",
      "Market information",
      "Public dashboard",
      "Platform updates",
      "Mobile optimized interface",
    ],
  },
  {
    name: "iOS",
    price: "R2,000",
    icon: Apple,
    featured: true,
    description:
      "A premium Ghost Nexus experience for Apple users.",
    features: [
      "Ghost Nexus iOS experience",
      "Market information",
      "Public dashboard",
      "Premium interface",
      "Platform updates",
    ],
  },
  {
    name: "PC",
    price: "R2,500",
    icon: Monitor,
    description:
      "The full desktop Ghost Nexus experience.",
    features: [
      "Ghost Nexus PC experience",
      "Market information",
      "Public dashboard",
      "Desktop optimized interface",
      "Platform updates",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <SEO
        title="Ghost Nexus Pricing"
        description="Explore Ghost Nexus pricing for Mobile, iOS and PC platforms."
        path="/pricing"
      />

      <Navbar />

      <main className="gn-pricing">

        <section className="gn-pricing-hero">

          <span className="gn-section-kicker">
            GHOST NEXUS PRICING
          </span>

          <h1>
            Choose your
            <span> platform.</span>
          </h1>

          <p>
            Select the Ghost Nexus experience that
            fits the way you use technology.
          </p>

        </section>


        <section className="gn-pricing-grid">

          {plans.map((plan) => {

            const Icon = plan.icon;

            return (
              <article
                className={`gn-price-card ${
                  plan.featured
                    ? "featured"
                    : ""
                }`}
                key={plan.name}
              >

                {plan.featured && (
                  <div className="gn-price-badge">
                    POPULAR
                  </div>
                )}

                <div className="gn-price-icon">
                  <Icon size={25} />
                </div>

                <h2>
                  {plan.name}
                </h2>

                <p className="gn-price-description">
                  {plan.description}
                </p>

                <div className="gn-price-value">
                  {plan.price}
                </div>

                <span className="gn-price-once">
                  ONE-TIME PRICE
                </span>

                <div className="gn-price-divider" />

                <ul>

                  {plan.features.map(
                    (feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    )
                  )}

                </ul>

                <Link
                  to="/download"
                  className={
                    plan.featured
                      ? "gn-price-button featured-button"
                      : "gn-price-button"
                  }
                >
                  GET STARTED
                  <ArrowRight size={17} />
                </Link>

              </article>
            );
          })}

        </section>


        <section className="gn-pricing-note">

          <span className="gn-section-kicker">
            NEED HELP?
          </span>

          <h2>
            Not sure which platform
            <span> is right for you?</span>
          </h2>

          <p>
            Contact Ghost Nexus and we'll help you
            choose the appropriate platform.
          </p>

          <Link
            to="/contact"
            className="gn-btn gn-btn-primary"
          >
            CONTACT US
            <ArrowRight size={17} />
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}