import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.css";

export default function Download() {
  return (
    <section
      className="ghost-download-section"
      aria-labelledby="ghost-download-title"
    >
      <div className="ghost-download-container">

        <div className="ghost-download-content">

          <span className="ghost-section-kicker">
            GHOST NEXUS PLATFORMS
          </span>

          <h2 id="ghost-download-title">
            Take Ghost Nexus
            <span> Everywhere.</span>
          </h2>

          <p>
            Access your market intelligence
            experience across your preferred
            platform.
          </p>

          <div className="ghost-download-options">

            <div className="ghost-download-card">

              <div className="ghost-download-icon">
                PC
              </div>

              <div>
                <strong>
                  Windows PC
                </strong>

                <span>
                  Desktop trading experience
                </span>
              </div>

              <Link to="/download">
                DOWNLOAD
              </Link>

            </div>

            <div className="ghost-download-card">

              <div className="ghost-download-icon">
                AND
              </div>

              <div>
                <strong>
                  Android
                </strong>

                <span>
                  Mobile market intelligence
                </span>
              </div>

              <Link to="/download">
                DOWNLOAD
              </Link>

            </div>

            <div className="ghost-download-card">

              <div className="ghost-download-icon">
                iOS
              </div>

              <div>
                <strong>
                  iPhone / iPad
                </strong>

                <span>
                  iOS market intelligence
                </span>
              </div>

              <Link to="/download">
                COMING SOON
              </Link>

            </div>

          </div>

          <div className="ghost-download-cta">
            <Link
              to="/download"
              className="ghost-download-main-button"
            >
              VIEW ALL DOWNLOADS
              <span>→</span>
            </Link>
          </div>

        </div>

        <div className="ghost-download-visual">

          <div className="ghost-download-device">

            <div className="ghost-device-screen">

              <div className="ghost-device-header">
                GHOST NEXUS
              </div>

              <div className="ghost-device-chart">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="ghost-device-status">
                <strong>
                  AI ENGINE
                </strong>

                <span>
                  ONLINE
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}