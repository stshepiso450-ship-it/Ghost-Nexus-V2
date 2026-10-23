import React, { useEffect, useState } from "react";
import {
  KeyRound,
  Copy,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorCredentials.css";

export default function MentorCredentials() {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState("");

  async function loadCredentials() {
    try {
      setLoading(true);

      const data = await mentorApi.getCredentials();

      setCredentials(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  async function copyValue(value, type) {
    if (!value) return;

    await navigator.clipboard.writeText(value);

    setCopied(type);

    setTimeout(() => {
      setCopied("");
    }, 1800);
  }

  async function rotateKey() {
    const confirmed = window.confirm(
      "Rotate your API key? Existing EA connections using the old key will stop working."
    );

    if (!confirmed) return;

    try {
      setRotating(true);

      const data = await mentorApi.rotateApiKey();

      setCredentials((current) => ({
        ...current,
        api_key: data.api_key,
      }));
    } catch (error) {
      window.alert(error.message);
    } finally {
      setRotating(false);
    }
  }

  if (loading) {
    return (
      <section className="mentor-page">
        <div className="mentor-loading">
          Loading credentials...
        </div>
      </section>
    );
  }

  return (
    <section className="mentor-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">
            MENTOR ACCOUNT
          </div>

          <h1>Mentor Credentials</h1>

          <p>
            These credentials authenticate your Ghost Nexus
            MQL5 EA.
          </p>
        </div>
      </div>

      <div className="credentials-warning">
        <ShieldCheck size={21} />

        <div>
          <strong>Keep your API key private</strong>

          <span>
            Never publish your API key or send it to another
            person.
          </span>
        </div>
      </div>

      <div className="credentials-card">
        <div className="credentials-icon">
          <KeyRound size={25} />
        </div>

        <div className="credential-row">
          <div>
            <span className="credential-label">
              Mentor ID
            </span>

            <strong>
              {credentials?.mentor_id || "—"}
            </strong>
          </div>

          <button
            className="copy-button"
            onClick={() =>
              copyValue(
                credentials?.mentor_id,
                "mentor"
              )
            }
          >
            {copied === "mentor" ? (
              <CheckCircle size={16} />
            ) : (
              <Copy size={16} />
            )}

            {copied === "mentor" ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="credential-divider" />

        <div className="credential-row">
          <div>
            <span className="credential-label">
              API Key
            </span>

            <strong className="api-key-value">
              {credentials?.api_key || "Hidden"}
            </strong>
          </div>

          <button
            className="copy-button"
            onClick={() =>
              copyValue(
                credentials?.api_key,
                "api"
              )
            }
          >
            {copied === "api" ? (
              <CheckCircle size={16} />
            ) : (
              <Copy size={16} />
            )}

            {copied === "api" ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="credential-divider" />

        <div className="credential-status">
          <span>Status</span>

          <strong>
            <i />
            {credentials?.status || "ACTIVE"}
          </strong>
        </div>

        <button
          className="rotate-key-button"
          onClick={rotateKey}
          disabled={rotating}
        >
          <RefreshCw
            size={17}
            className={rotating ? "spin" : ""}
          />

          {rotating
            ? "Rotating..."
            : "Rotate API Key"}
        </button>
      </div>

      <div className="credentials-info">
        <h2>How authentication works</h2>

        <div className="credentials-flow">
          <span>Mentor ID</span>
          <b>+</b>
          <span>API Key</span>
          <b>→</b>
          <span>Ghost Nexus API</span>
          <b>→</b>
          <span>MT5 EA</span>
        </div>
      </div>
    </section>
  );
}