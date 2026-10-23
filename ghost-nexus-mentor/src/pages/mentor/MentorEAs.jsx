import React, { useCallback, useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_MQL5_API_URL || "http://127.0.0.1:8010"
).replace(/\/+$/, "");

function savedMentor() {
  for (const key of ["ghost_nexus_mentor", "mentor_profile", "mentor"]) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "null");
      if (data) return data.mentor || data.profile || data;
    } catch {}
  }
  return {};
}

function getToken() {
  for (const key of [
    "ghost_nexus_mentor_token",
    "mentor_token",
    "ghost_nexus_token",
  ]) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }

  const saved = savedMentor();
  return saved.access_token || saved.token || "";
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    Accept: "application/json",
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Cannot connect to Ghost Nexus at ${API_BASE}. Check that the API is running.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : { detail: await response.text().catch(() => "") };

  if (!response.ok) {
    throw new Error(
      result.detail || result.message || `Request failed (${response.status})`
    );
  }
  return result;
}

function unwrapArray(value) {
  if (Array.isArray(value)) return value;
  for (const key of ["eas", "mentor_eas", "items", "results", "data"]) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  if (Array.isArray(value?.data?.eas)) return value.data.eas;
  return [];
}

const css = `
.gn-mentor-eas{color:#f4f3f7;width:100%;min-width:0}
.gn-me-head{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:22px}
.gn-me-kicker{color:#ff5267;font-weight:850;letter-spacing:2px;font-size:11px}
.gn-me-head h1{font-size:clamp(25px,4vw,34px);margin:8px 0}
.gn-me-muted{color:#a9a7b2;font-size:13px;line-height:1.6}
.gn-me-panel,.gn-me-card{border:1px solid #38323d;border-radius:15px;background:linear-gradient(145deg,#19171e,#101014);padding:18px;margin-bottom:20px;min-width:0}
.gn-me-panel h2{margin:0 0 7px;font-size:18px}
.gn-me-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.gn-me-field{display:flex;flex-direction:column;gap:7px;min-width:0}
.gn-me-field label{font-size:12px;color:#c5c1cc;font-weight:750}
.gn-me-field input,.gn-me-field select{width:100%;box-sizing:border-box;background:#0b0a0e;color:#fff;border:1px solid #48404a;border-radius:9px;padding:11px}
.gn-me-btn{border:1px solid #68323e;background:#28151b;color:#fff;border-radius:10px;padding:11px 15px;font-weight:800;cursor:pointer}
.gn-me-btn-primary{background:linear-gradient(100deg,#a70e28,#f02f48);border:0}
.gn-me-btn:disabled{opacity:.55;cursor:not-allowed}
.gn-me-msg{border:1px solid #59404a;background:#1b141a;color:#f6dbe3;border-radius:10px;padding:12px;margin-bottom:15px;overflow-wrap:anywhere}
.gn-me-ok{border-color:#326346;background:#12241b;color:#c0f3cf}
.gn-me-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:15px}
.gn-me-card{margin:0;padding:17px}
.gn-me-card-head{display:flex;justify-content:space-between;gap:12px}
.gn-me-card h3{margin:0 0 6px;font-size:17px;overflow-wrap:anywhere}
.gn-me-id{color:#aaa5b1;font:12px ui-monospace,Consolas,monospace;overflow-wrap:anywhere}
.gn-me-badge{background:#14241b;color:#9cf0b6;border:1px solid #315b40;border-radius:99px;padding:5px 8px;font-size:10px;height:max-content}
.gn-me-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:16px 0}
.gn-me-meta div{background:#ffffff06;border:1px solid #ffffff0c;border-radius:9px;padding:10px;min-width:0}
.gn-me-meta span{display:block;color:#a6a2ae;font-size:11px;margin-bottom:5px}
.gn-me-meta strong{font-size:13px;overflow-wrap:anywhere}
.gn-me-keys{font:12px ui-monospace,Consolas,monospace;overflow-wrap:anywhere;background:#09090c;padding:9px;border:1px solid #39313c;border-radius:8px;margin-top:7px}
@media(max-width:480px){.gn-me-grid{grid-template-columns:minmax(0,1fr)}.gn-me-panel,.gn-me-card{padding:14px}}
`;

export default function MentorEAs() {
  const [mentor, setMentor] = useState(savedMentor());
  const [eas, setEas] = useState([]);
  const [eaName, setEaName] = useState("");
  const [symbol, setSymbol] = useState("XAUUSD");
  const [version, setVersion] = useState("1.0.0");
  const [file, setFile] = useState(null);
  const [quantity, setQuantity] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [returnedKeys, setReturnedKeys] = useState(null);

  const mentorId =
    mentor.mentor_id || mentor.mentor?.mentor_id ||
    mentor.profile?.mentor_id || mentor.data?.mentor_id || "";

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      try {
        const profileResponse = await api("/api/mentor/me");
        const profile =
          profileResponse.mentor ||
          profileResponse.profile ||
          profileResponse.data ||
          profileResponse;
        if (profile && (profile.mentor_id || profile.email)) {
          setMentor(profile);
        }
      } catch {
        // Use saved mentor profile if the /me response is unavailable.
      }

      let list;
      try {
        list = await api("/api/mentor/eas");
      } catch {
        list = await api("/api/mentor/dashboard");
      }

      setEas(unwrapArray(list));
    } catch (err) {
      setError(err.message || "Unable to sync assigned EAs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  async function submitEA(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setReturnedKeys(null);

    if (!getToken()) {
      setError("Your mentor session is missing or expired. Sign in again.");
      return;
    }
    if (!mentorId) {
      setError("Your Mentor ID could not be loaded. Sign in again and confirm your mentor profile.");
      return;
    }
    if (!eaName.trim()) {
      setError("Enter an EA name.");
      return;
    }
    if (!file || !file.name.toLowerCase().endsWith(".ex5")) {
      setError("Choose the compiled .ex5 file. Compile your .mq5 source in MetaEditor using F7 first.");
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("ea_name", eaName.trim());
      body.append("mentor_id", mentorId);
      body.append("symbol", symbol.trim() || "XAUUSD");
      body.append("version", version.trim() || "1.0.0");
      body.append("file", file, file.name);

      const result = await api("/mentor/mql5/submit-ea", {
        method: "POST",
        body,
      });

      const order = result.order || {};
      setNotice(
        `${result.message || "EA submitted to Admin."} ` +
        `Order: ${order.order_number || "created"}; ` +
        `Mentor: ${order.mentor_id || mentorId}; ` +
        `asset status: ${order.asset_status || "READY"}.`
      );
      setEaName("");
      setFile(null);
      const input = document.getElementById("gn-mentor-ea-file");
      if (input) input.value = "";
      await loadPage();
    } catch (err) {
      setError(err.message || "EA submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function generateLicenses(ea) {
    const id = ea.ea_id;
    const count = Number(quantity[id] || 1);

    if (!id) {
      setError("This EA has no EA ID. Contact Admin.");
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 500) {
      setError("Choose between 1 and 500 licence keys.");
      return;
    }

    setWorkingId(id);
    setError("");
    setNotice("");
    setReturnedKeys(null);

    try {
      const result = await api(
        `/api/mentor/eas/${encodeURIComponent(id)}/licenses/generate`,
        {
          method: "POST",
          body: JSON.stringify({ count }),
        }
      );

      const raw = result.licenses || result.keys || result.generated_keys || [];
      const keys = (Array.isArray(raw) ? raw : [])
        .map((item) => typeof item === "string"
          ? item
          : item?.license_key || item?.key || "")
        .filter(Boolean);

      setReturnedKeys({ eaId: id, keys });
      setNotice(
        result.message ||
        (keys.length ? `Generated ${keys.length} licence key(s).` :
          "Request completed. Check the Licences page to confirm saved keys.")
      );
    } catch (err) {
      setError(err.message || "Licence generation failed.");
    } finally {
      setWorkingId("");
    }
  }

  return (
    <main className="gn-mentor-eas">
      <style>{css}</style>

      <header className="gn-me-head">
        <div>
          <div className="gn-me-kicker">GHOST NEXUS / MENTOR WORKSPACE</div>
          <h1>My Expert Advisors</h1>
          <p className="gn-me-muted">
            Submit a compiled EA to Admin, track assignments, and generate client licences after approval.
          </p>
          <p className="gn-me-muted">
            Mentor ID: <strong>{mentorId || "Loading profile..."}</strong>
          </p>
        </div>
        <button className="gn-me-btn" type="button" onClick={loadPage} disabled={loading}>
          {loading ? "Syncing..." : "↻ Sync EAs"}
        </button>
      </header>

      {error && <div className="gn-me-msg" role="alert">{error}</div>}
      {notice && <div className="gn-me-msg gn-me-ok" role="status">{notice}</div>}

      <section className="gn-me-panel">
        <h2>Submit EA for Admin Release</h2>
        <p className="gn-me-muted">
          Your EA will be saved with your authenticated Mentor ID and email and appear in Admin → MQL5 Orders.
          Admin must release it before it becomes an assigned EA in your workspace.
          This is an EA submission, not a payment.
        </p>

        <form onSubmit={submitEA}>
          <div className="gn-me-grid">
            <div className="gn-me-field">
              <label htmlFor="gn-mentor-ea-name">EA name</label>
              <input
                id="gn-mentor-ea-name"
                value={eaName}
                onChange={(e) => setEaName(e.target.value)}
                placeholder="e.g. Ghost Nexus Gold EA"
                maxLength={255}
                required
              />
            </div>
            <div className="gn-me-field">
              <label htmlFor="gn-mentor-ea-symbol">Symbol</label>
              <input
                id="gn-mentor-ea-symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="XAUUSD"
              />
            </div>
            <div className="gn-me-field">
              <label htmlFor="gn-mentor-ea-version">Version</label>
              <input
                id="gn-mentor-ea-version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
              />
            </div>
            <div className="gn-me-field">
              <label htmlFor="gn-mentor-ea-file">Compiled EA file (.ex5)</label>
              <input
                id="gn-mentor-ea-file"
                type="file"
                accept=".ex5,application/octet-stream"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <button className="gn-me-btn gn-me-btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting EA..." : "Submit EA to Admin"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2>Assigned EAs</h2>
        <p className="gn-me-muted">
          EAs appear here after Admin releases them to your Mentor ID.
        </p>

        {loading ? (
          <div className="gn-me-msg">Syncing assigned EAs...</div>
        ) : eas.length === 0 ? (
          <div className="gn-me-msg">
            No EAs assigned yet. Submit an EA above or wait for Admin to release one, then click Sync EAs.
          </div>
        ) : (
          <div className="gn-me-list">
            {eas.map((ea, index) => {
              const id = ea.ea_id || ea.id || `ea-${index}`;
              const status = String(ea.status || "ASSIGNED").toUpperCase();
              const active = status === "ACTIVE" || ea.admin_approved === true;

              return (
                <article className="gn-me-card" key={id}>
                  <div className="gn-me-card-head">
                    <div>
                      <h3>{ea.ea_name || ea.name || "Ghost Nexus EA"}</h3>
                      <div className="gn-me-id">{ea.ea_id || "EA ID missing"}</div>
                    </div>
                    <span className="gn-me-badge">{status}</span>
                  </div>

                  <div className="gn-me-meta">
                    <div><span>Symbol</span><strong>{ea.symbol || "Not specified"}</strong></div>
                    <div><span>Platform</span><strong>{ea.platform || "MT5"}</strong></div>
                    <div><span>Version</span><strong>{ea.script_version || ea.version || "1.0.0"}</strong></div>
                    <div><span>Licence limit</span><strong>{ea.max_licenses ?? 500}</strong></div>
                  </div>

                  <div className="gn-me-field">
                    <label htmlFor={`gn-license-count-${id}`}>Licence keys to generate</label>
                    <input
                      id={`gn-license-count-${id}`}
                      type="number"
                      min="1"
                      max="500"
                      step="1"
                      value={quantity[id] ?? 1}
                      onChange={(e) => setQuantity((old) => ({ ...old, [id]: e.target.value }))}
                    />
                  </div>

                  <button
                    className="gn-me-btn gn-me-btn-primary"
                    style={{ width: "100%", marginTop: 12 }}
                    type="button"
                    disabled={!active || !ea.ea_id || workingId === id}
                    onClick={() => generateLicenses(ea)}
                  >
                    {workingId === id
                      ? "Generating..."
                      : !active
                        ? "Waiting for Admin approval"
                        : "Generate Licence Keys"}
                  </button>

                  {returnedKeys?.eaId === id && returnedKeys.keys.map((key) => (
                    <div className="gn-me-keys" key={key}>{key}</div>
                  ))}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
