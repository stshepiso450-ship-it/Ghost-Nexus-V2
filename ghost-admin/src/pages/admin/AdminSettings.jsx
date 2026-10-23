import {
  Save,
  Settings,
  Shield,
} from "lucide-react";

import "./AdminSettings.css";

export default function AdminSettings() {
  return (
    <div className="admin-settings-page">
      <section className="admin-page-heading">
        <div>
          <span>
            PLATFORM CONFIGURATION
          </span>

          <h1>
            System Settings
          </h1>

          <p>
            Configure the Ghost Nexus platform.
          </p>
        </div>

        <button className="admin-primary-button">
          <Save size={16} />

          SAVE SETTINGS
        </button>
      </section>

      <div className="admin-settings-grid">
        <section className="settings-card">
          <div className="settings-card-title">
            <Settings size={18} />

            <div>
              <span>
                GENERAL
              </span>

              <h2>
                Platform Settings
              </h2>
            </div>
          </div>

          <div className="settings-fields">
            <label>
              <span>
                PLATFORM NAME
              </span>

              <input
                defaultValue="Ghost Nexus"
              />
            </label>

            <label>
              <span>
                PLATFORM VERSION
              </span>

              <input
                defaultValue="2.0.0"
              />
            </label>

            <label>
              <span>
                SUPPORT EMAIL
              </span>

              <input
                placeholder="support@example.com"
              />
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <Shield size={18} />

            <div>
              <span>
                SECURITY
              </span>

              <h2>
                Access Control
              </h2>
            </div>
          </div>

          <div className="settings-toggle-list">
            <div>
              <div>
                <strong>
                  Registration
                </strong>

                <span>
                  Allow new user registration
                </span>
              </div>

              <input
                type="checkbox"
                defaultChecked
              />
            </div>

            <div>
              <div>
                <strong>
                  License Validation
                </strong>

                <span>
                  Require a valid license
                </span>
              </div>

              <input
                type="checkbox"
                defaultChecked
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}