
import React, { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle,
  XCircle,
  Package,
  KeyRound,
  Copy,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import mentorApi from "../../services/mentorApi";
import "./MentorEAs.css";

function asList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function MentorEAs() {
  const [eas, setEAs] = useState([]);
  const [licenseCounts, setLicenseCounts] = useState({});
  const [counts, setCounts] = useState({});
  const [generatedKeys, setGeneratedKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingId, setGeneratingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadEAs(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [eaResult, licenseResult] = await Promise.all([
        mentorApi.getEAs(),
        mentorApi.getLicenses(),
      ]);

      const eaList = asList(eaResult, "eas");
      const licenses = asList(licenseResult, "licenses");
      const countMap = {};

      for (const license of licenses) {
        if (String(license.status || "").toUpperCase() === "REVOKED") {
          continue;
        }

        const eaId = license.ea_id;
        if (!eaId) continue;

        countMap[eaId] = (countMap[eaId] || 0) + 1;
      }

      setEAs(eaList);
      setLicenseCounts(countMap);
    } catch (err) {
      setError(
        err.message ||
        "Could not load your EAs. Check your mentor session and backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEAs();
  }, []);

  function setEAcount(eaId, value) {
    setCounts((current) => ({
      ...current,
      [eaId]: value,
    }));
  }

  async function generateForEA(ea) {
    const eaId = ea.ea_id || ea.id;
    const used = licenseCounts[eaId] || 0;
    const limit = Math.min(Number(ea.max_licenses || 500), 500);
    const remaining = Math.max(0, limit - used);
    const count = Number(counts[eaId] ?? remaining);

    setError("");
    setMessage("");

    if (!eaId) {
      setError("This EA does not have an EA ID.");
      return;
    }

    if (!Number.isInteger(count) || count < 1 || count > remaining) {
      setError(`Enter a whole number between 1 and ${remaining}.`);
      return;
    }

    const approved =
      ea.admin_approved === true &&
      String(ea.status || "").toUpperCase() === "ACTIVE";

    if (!approved) {
      setError("Admin must approve and activate this EA first.");
      return;
    }

    const confirmed = window.confirm(
      `Generate ${count} licence key(s) for ${ea.ea_name || ea.name || eaId}? ` +
      "These keys will be saved to the Ghost Nexus database."
    );

    if (!confirmed) return;

    setGeneratingId(eaId);

    try {
      const result = await mentorApi.generateLicenses(eaId, count);
      const keys = Array.isArray(result.licenses)
        ? result.licenses
        : [];

      setGeneratedKeys((current) => ({
        ...current,
        [eaId]: keys,
      }));

      setLicenseCounts((current) => ({
        ...current,
        [eaId]: (current[eaId] || 0) + Number(result.total_generated || keys.length),
      }));

      setMessage(
        result.message ||
        `${keys.length} licence key(s) generated successfully.`
      );
    } catch (err) {
      setError(err.message || "Could not generate licence keys.");
    } finally {
      setGeneratingId("");
    }
  }

  async function copyKey(value) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Licence key copied.");
    } catch {
      setError("Copy failed. Select and copy the licence key manually.");
    }
  }

  return (
    <section className="mentor-page mentor-eas-page">
      <div className="mentor-page-header">
        <div>
          <div className="mentor-eyebrow">EA MANAGEMENT</div>
          <h1>My EAs</h1>
          <p>
            View EAs assigned to your mentor ID and generate client
            licence keys after Admin approval.
          </p>
        </div>

        <button
          type="button"
          className="mentor-eas-refresh"
          onClick={() => loadEAs(true)}
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <LoaderCircle size={16} className="mentor-eas-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mentor-eas-notice mentor-eas-error" role="alert">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="mentor-eas-notice mentor-eas-success" role="status">
          <CheckCircle size={17} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="mentor-ea-loading">
          <LoaderCircle size={22} className="mentor-eas-spin" />
          Loading your EAs...
        </div>
      ) : eas.length === 0 ? (
        <div className="mentor-empty">
          <Package size={35} />
          <h2>No EAs assigned</h2>
          <p>
            An EA will appear here once Admin has uploaded and released
            the paid order to your mentor account.
          </p>
        </div>
      ) : (
        <div className="mentor-ea-grid">
          {eas.map((ea) => {
            const eaId = ea.ea_id || ea.id;
            const used = licenseCounts[eaId] || 0;
            const max = Math.min(Number(ea.max_licenses || 500), 500);
            const remaining = Math.max(0, max - used);
            const active =
              String(ea.status || "").toUpperCase() === "ACTIVE";
            const approved = ea.admin_approved === true;
            const ready = active && approved;
            const keys = generatedKeys[eaId] || [];

            return (
              <article className="mentor-ea-card" key={eaId}>
                <div className="mentor-ea-top">
                  <div className="mentor-ea-icon">
                    <Bot size={22} />
                  </div>

                  <span
                    className={`mentor-ea-status ${
                      ready ? "active" : "pending"
                    }`}
                  >
                    {ready ? (
                      <CheckCircle size={13} />
                    ) : (
                      <XCircle size={13} />
                    )}
                    {ready ? "Active" : ea.status || "Pending approval"}
                  </span>
                </div>

                <h2>{ea.ea_name || ea.name || "Ghost Nexus EA"}</h2>

                <p>
                  {ea.description ||
                    "Ghost Nexus automated trading system."}
                </p>

                <div className="mentor-ea-meta">
                  <span>
                    EA ID
                    <strong>{eaId}</strong>
                  </span>
                  <span>
                    Version
                    <strong>{ea.version || "1.0.0"}</strong>
                  </span>
                  <span>
                    Platform
                    <strong>{ea.platform || "MT5"}</strong>
                  </span>
                </div>

                <div className="mentor-ea-license-summary">
                  <div>
                    <span>Licences used</span>
                    <strong>{used} / {max}</strong>
                  </div>
                  <div>
                    <span>Remaining</span>
                    <strong>{remaining}</strong>
                  </div>
                </div>

                {ready ? (
                  <div className="mentor-ea-license-tools">
                    <h3>
                      <KeyRound size={16} />
                      Generate licence keys
                    </h3>

                    <p>
                      Keys are stored against this EA and your mentor
                      ID. You can generate up to the remaining limit.
                    </p>

                    <label className="mentor-ea-count-field">
                      <span>Number of keys</span>
                      <input
                        type="number"
                        min="1"
                        max={remaining}
                        value={counts[eaId] ?? remaining}
                        disabled={remaining < 1 || generatingId === eaId}
                        onChange={(event) =>
                          setEAcount(eaId, event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="mentor-ea-generate-button"
                      disabled={remaining < 1 || generatingId === eaId}
                      onClick={() => generateForEA(ea)}
                    >
                      {generatingId === eaId ? (
                        <LoaderCircle size={16} className="mentor-eas-spin" />
                      ) : (
                        <KeyRound size={16} />
                      )}
                      {generatingId === eaId
                        ? "Generating..."
                        : remaining < 1
                          ? "Licence limit reached"
                          : "Generate Keys"}
                    </button>

                    {keys.length > 0 && (
                      <div className="mentor-ea-generated-keys">
                        <h4>
                          Generated keys ({keys.length})
                        </h4>
                        <p>
                          Save these keys securely and provide them to
                          the intended clients.
                        </p>

                        <div className="mentor-ea-key-list">
                          {keys.map((item) => (
                            <div
                              className="mentor-ea-key-row"
                              key={item.id || item.license_key}
                            >
                              <code>{item.license_key}</code>
                              <button
                                type="button"
                                title="Copy licence key"
                                onClick={() => copyKey(item.license_key)}
                              >
                                <Copy size={14} />
                                Copy
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mentor-ea-awaiting">
                    <ClockIcon />
                    <span>
                      Waiting for Admin to approve and activate this EA.
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ClockIcon() {
  return <Package size={16} aria-hidden="true" />;
}
