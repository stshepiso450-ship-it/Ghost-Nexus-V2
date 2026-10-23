import React, { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorEAs.css";

export default function MentorEAs() {
  const [eas, setEas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await mentorApi.getEAs();

        setEAs(
          Array.isArray(data)
            ? data
            : data.eas || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="mentor-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">
            EA MANAGEMENT
          </div>

          <h1>My EAs</h1>

          <p>
            Manage the Expert Advisors assigned to your
            mentor account.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mentor-ea-loading">
          Loading EAs...
        </div>
      ) : eas.length === 0 ? (
        <div className="mentor-empty">
          <Package size={35} />

          <h2>No EAs assigned</h2>

          <p>
            Purchased and released EAs will appear here.
          </p>
        </div>
      ) : (
        <div className="mentor-ea-grid">
          {eas.map((ea) => (
            <article
              className="mentor-ea-card"
              key={ea.id}
            >
              <div className="mentor-ea-top">
                <div className="mentor-ea-icon">
                  <Bot size={22} />
                </div>

                <span
                  className={`mentor-ea-status ${
                    ea.status || "inactive"
                  }`}
                >
                  {ea.status === "active" ? (
                    <CheckCircle size={13} />
                  ) : (
                    <XCircle size={13} />
                  )}

                  {ea.status || "inactive"}
                </span>
              </div>

              <h2>
                {ea.name || "Ghost Nexus EA"}
              </h2>

              <p>
                {ea.description ||
                  "Ghost Nexus automated trading system."}
              </p>

              <div className="mentor-ea-meta">
                <span>
                  Version
                  <strong>
                    {ea.version || "1.0.0"}
                  </strong>
                </span>

                <span>
                  Type
                  <strong>
                    MQL5
                  </strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}