import React from "react";
import { Download as DownloadIcon, Smartphone, Monitor, Apple, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/download.css";

const platforms = [
  {
    name: "Mobile",
    price: "R1,500",
    icon: Smartphone,
    description:
      "Ghost Nexus optimized for mobile devices.",
    status: "AVAILABLE",
  },
  {
    name: "iOS",
    price: "R2,000",
    icon: Apple,
    description:
      "Ghost Nexus designed for the Apple ecosystem.",
    status: "AVAILABLE",
  },
  {
    name: "PC",
    price: "R2,500",
    icon: Monitor,
    description:
      "The full Ghost Nexus desktop experience.",
    status: "AVAILABLE",
  },
];

export default function Download() {
  return (
    <>
      <SEO
        title="Download Ghost Nexus"
        description="Download and explore the Ghost Nexus experience for Mobile, iOS and PC."
        path="/download"
      />

      <Navbar />

      <main className="gn-download">

        <section className="gn-download-hero">

          <div className="gn-download-hero-glow" />

          <span className="gn-section-kicker">
            GHOST NEXUS DOWNLOAD
          </span>

          <h1>
            Your market
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Choose your preferred Ghost Nexus
            platform and enter the ecosystem.
          </p>

        </section>


        <section className="gn-download-grid">

          {platforms.map((platform) => {

            const Icon = platform.icon;

            return (
              <article
                className="gn-download-card"
                key={platform.name}
              >

                <div className="gn-download-card-top">

                  <div className="gn-download-icon">
                    <Icon size={25} />
                  </div>

                  <span className="gn-download-status">
                    <span />
                    {platform.status}
                  </span>

                </div>

                <h2>
                  {platform.name}
                </h2>

                <p>
                  {platform.description}
                </p>

                <div className="gn-download-price">
                  {platform.price}
                </div>

                <Link
                  to="/contact"
                  className="gn-download-button"
                >
                  <DownloadIcon size={17} />
                  GET ACCESS
                </Link>

              </article>
            );
          })}

        </section>


        <section className="gn-download-info">

          <div className="gn-download-info-icon">
            <DownloadIcon size={25} />
          </div>

          <div>

            <span className="gn-section-kicker">
              IMPORTANT
            </span>

            <h2>
              Get the correct
              <span> platform.</span>
            </h2>

            <p>
              Choose the platform that matches your
              device. For access questions or product
              support, contact the Ghost Nexus team.
            </p>

          </div>

          <Link
            to="/contact"
            className="gn-btn gn-btn-primary"
          >
            CONTACT SUPPORT
            <ArrowRight size={17} />
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}