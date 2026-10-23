import React, { useState } from "react";
import {
  Bot,
  Plus,
  KeyRound,
  Power,
  RefreshCw,
  Copy,
  CheckCircle,
} from "lucide-react";

import "./AdminEAs.css";

export default function AdminEAs() {
  const [showCreate, setShowCreate] = useState(false);

  const [eas, setEas] = useState([]);

  const [form, setForm] = useState({
    name: "",
    version: "",
    description: "",
  });

  const [generatedKey, setGeneratedKey] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const generateApiKey = () => {
    const random = crypto.randomUUID().replaceAll("-", "");

    return `GHNX-EA-${random.toUpperCase()}`;
  };

  const createEA = (event) => {
    event.preventDefault();

    if (!form.name || !form.version) {
      return;
    }

    const apiKey = generateApiKey();

    const newEA = {
      id: crypto.randomUUID(),
      name: form.name,
      version: form.version,
      description: form.description,
      apiKey,
      status: "active",
      licenses: 0,
    };

    setEas((current) => [
      ...current,
      newEA,
    ]);

    setGeneratedKey(apiKey);

    setForm({
      name: "",
      version: "",
      description: "",
    });
  };

  const toggleEA = (id) => {
    setEas((current) =>
      current.map((ea) =>
        ea.id === id
          ? {
              ...ea,
              status:
                ea.status === "active"
                  ? "disabled"
                  : "active",
            }
          : ea
      )
    );
  };

  const regenerateKey = (id) => {
    setEas((current) =>
      current.map((ea) =>
        ea.id === id
          ? {
              ...ea,
              apiKey: generateApiKey(),
            }
          : ea
      )
    );
  };

  const copyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-eas-page">

      <div className="admin-eas-header">

        <div>
          <div className="admin-eas-eyebrow">
            <Bot size={16} />
            EXPERT ADVISOR MANAGEMENT
          </div>

          <h1>EA Management</h1>

          <p>
            Create and manage Ghost Nexus Expert Advisors,
            versions and API access keys.
          </p>
        </div>

        <button
          className="create-ea-button"
          onClick={() => {
            setShowCreate((current) => !current);
            setGeneratedKey("");
          }}
        >
          <Plus size={17} />
          Create EA
        </button>

      </div>

      {showCreate && (
        <section className="ea-create-card">

          <div className="ea-section-header">

            <div>
              <h2>Create Expert Advisor</h2>

              <p>
                Register a new EA version with Ghost Nexus.
              </p>
            </div>

          </div>

          <form onSubmit={createEA}>

            <div className="ea-form-grid">

              <div className="ea-field">

                <label>EA Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ghost Nexus EA"
                />

              </div>

              <div className="ea-field">

                <label>Version</label>

                <input
                  name="version"
                  value={form.version}
                  onChange={handleChange}
                  placeholder="5.0.0"
                />

              </div>

              <div className="ea-field ea-field-full">

                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="EA description..."
                  rows="4"
                />

              </div>

            </div>

            <button
              type="submit"
              className="generate-ea-button"
            >
              <KeyRound size={17} />
              Create EA & Generate API Key
            </button>

          </form>

          {generatedKey && (
            <div className="generated-key">

              <div>
                <CheckCircle size={18} />

                <div>
                  <strong>EA API Key Generated</strong>

                  <span>
                    Store this securely. API keys should
                    ultimately be generated and stored by
                    the backend.
                  </span>
                </div>
              </div>

              <code>
                {generatedKey}
              </code>

              <button
                onClick={() => copyKey(generatedKey)}
              >
                <Copy size={15} />
                Copy
              </button>

            </div>
          )}

        </section>
      )}

      <section className="ea-list">

        {eas.length === 0 ? (
          <div className="ea-empty">

            <Bot size={38} />

            <h3>No EAs registered</h3>

            <p>
              Create your first Ghost Nexus EA to begin
              managing versions and licenses.
            </p>

          </div>
        ) : (
          eas.map((ea) => (
            <article
              className="ea-card"
              key={ea.id}
            >

              <div className="ea-card-top">

                <div className="ea-icon">
                  <Bot size={23} />
                </div>

                <div className="ea-main-info">

                  <h2>{ea.name}</h2>

                  <span>
                    Version {ea.version}
                  </span>

                </div>

                <div
                  className={`ea-status ${
                    ea.status
                  }`}
                >
                  <span />
                  {ea.status.toUpperCase()}
                </div>

              </div>

              <p className="ea-description">
                {ea.description ||
                  "No description provided."}
              </p>

              <div className="ea-meta">

                <div>
                  <span>LICENSES</span>
                  <strong>{ea.licenses}</strong>
                </div>

                <div>
                  <span>API KEY</span>
                  <code>{ea.apiKey}</code>
                </div>

              </div>

              <div className="ea-actions">

                <button
                  onClick={() => toggleEA(ea.id)}
                >
                  <Power size={15} />
                  {ea.status === "active"
                    ? "Disable"
                    : "Enable"}
                </button>

                <button
                  onClick={() => regenerateKey(ea.id)}
                >
                  <RefreshCw size={15} />
                  Rotate API Key
                </button>

                <button
                  onClick={() => copyKey(ea.apiKey)}
                >
                  <Copy size={15} />
                  Copy Key
                </button>

              </div>

            </article>
          ))
        )}

      </section>

    </div>
  );
}