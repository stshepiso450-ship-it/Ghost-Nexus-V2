import {
  Palette,
  Save,
} from "lucide-react";

import "./AdminBranding.css";

export default function AdminBranding() {
  return (
    <div className="admin-branding-page">
      <section className="admin-page-heading">
        <div>
          <span>
            BRAND MANAGEMENT
          </span>

          <h1>
            Branding
          </h1>

          <p>
            Customize your Ghost Nexus identity.
          </p>
        </div>

        <button className="admin-primary-button">
          <Save size={16} />

          SAVE BRANDING
        </button>
      </section>

      <div className="branding-grid">
        <section className="branding-card">
          <div className="branding-card-header">
            <Palette size={19} />

            <h2>
              Brand Identity
            </h2>
          </div>

          <label>
            PLATFORM NAME

            <input
              defaultValue="Ghost Nexus"
            />
          </label>

          <label>
            TAGLINE

            <input
              defaultValue="Intelligent Trading Systems"
            />
          </label>

          <label>
            PRIMARY ACCENT

            <div className="branding-color-row">
              <input
                type="color"
                defaultValue="#ff3155"
              />

              <input
                type="text"
                defaultValue="#ff3155"
              />
            </div>
          </label>
        </section>

        <section className="branding-preview">
          <span>
            LIVE PREVIEW
          </span>

          <div className="preview-logo">
            GN
          </div>

          <h2>
            GHOST NEXUS
          </h2>

          <p>
            Intelligent Trading Systems
          </p>
        </section>
      </div>
    </div>
  );
}