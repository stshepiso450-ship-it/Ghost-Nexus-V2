import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.css";

const plans = [
  {
    id: "mobile",
    name: "MOBILE",
    price: "1,500",
    currency: "R",
    description:
      "Ghost Nexus mobile trading experience for traders who want market intelligence on the move.",
    features: [
      "Ghost Nexus Mobile App",
      "Live Market Dashboard",
      "Ghost AI Market Intelligence",
      "Live Forex Monitoring",
      "Economic Calendar",
      "Market Sessions",
      "Market News",
      "Fear & Greed",
    ],
    featured: false,
  },
  {
    id: "pc",
    name: "PC",
    price: "2,500",
    currency: "R",
    description:
      "Full Ghost Nexus desktop experience with advanced market monitoring and trading tools.",
    features: [
      "Ghost Nexus PC Platform",
      "Advanced Market Dashboard",
      "Ghost AI Scanner",
      "Live Trading Charts",
      "Forex & Gold Monitoring",
      "Economic Calendar",
      "Market Heat Map",
      "Live Financial News",
      "Trading Workspace",
    ],
    featured: true,
  },
  {
    id: "ios",
    name: "iOS",
    price: "2,000",
    currency: "R",
    description:
      "Ghost Nexus for iPhone and iPad with access to your market intelligence tools.",
    features: [
      "Ghost Nexus iOS App",
      "Live Market Dashboard",
      "Ghost AI Intelligence",
      "Forex Monitoring",
      "Economic Calendar",
      "Market Sessions",
      "Financial News",
      "Fear & Greed",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      className="ghost-pricing-section"
      id="pricing"
      aria-labelledby="ghost-pricing-title"
    >
      <div className="ghost-pricing-container">

        <div className="ghost-pricing-header">
          <span className="ghost-section-kicker">
            GHOST NEXUS ACCESS
          </span>

          <h2 id="ghost-pricing-title">
            Choose Your Platform
          </h2>

          <p>
            Select the Ghost Nexus platform that
            fits the way you trade and monitor the
            financial markets.
          </p>
        </div>

        <div className="ghost-pricing-grid">

          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`ghost-pricing-card ${
                plan.featured ? "featured" : ""
              }`}
            >

              {plan.featured && (
                <div className="ghost-pricing-badge">
                  MOST POPULAR
                </div>
              )}

              <div className="ghost-pricing-platform">
                {plan.name}
              </div>

              <h3>
                Ghost Nexus {plan.name}
              </h3>

              <p className="ghost-pricing-description">
                {plan.description}
              </p>

              <div className="ghost-pricing-price">
                <span>
                  {plan.currency}
                </span>

                <strong>
                  {plan.price}
                </strong>
              </div>

              <span className="ghost-pricing-period">
                ONE-TIME ACCESS
              </span>

              <div className="ghost-pricing-divider" />

              <ul className="ghost-pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="ghost-pricing-button"
              >
                GET {plan.name}
                <span>→</span>
              </Link>

            </article>
          ))}

        </div>

        <div className="ghost-pricing-note">
          <strong>
            GHOST NEXUS
          </strong>

          <span>
            Platform availability and supported
            features may vary by device and
            operating system.
          </span>
        </div>

      </div>
    </section>
  );
}