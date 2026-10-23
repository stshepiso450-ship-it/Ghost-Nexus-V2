import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.css";

export default function NotFound() {
  return (
    <main className="ghost-404-page">

      <div className="ghost-404-container">

        <div className="ghost-404-code">
          404
        </div>

        <span className="ghost-section-kicker">
          SIGNAL LOST
        </span>

        <h1>
          Page Not
          <span> Found.</span>
        </h1>

        <p>
          The Ghost Nexus system could not locate
          the page you requested.
        </p>

        <div className="ghost-404-actions">

          <Link
            to="/"
            className="ghost-primary-button"
          >
            BACK TO HOME
            <span>→</span>
          </Link>

          <Link
            to="/login"
            className="ghost-secondary-button"
          >
            MENTOR LOGIN
          </Link>

        </div>

        <div className="ghost-404-status">

          <span>
            <i />
            GHOST NEXUS ONLINE
          </span>

          <span>
            ERROR 404
          </span>

        </div>

      </div>

    </main>
  );
}