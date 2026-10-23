import React, { useRef, useState } from "react";
import "./SaveSettings.css";
import { useApp } from "../../context/AppContext";

export default function SaveSettings() {
  const { settings, updateSettings, resetSettings } = useApp();

  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");

  function saveSettings() {
    try {
      localStorage.setItem(
        "ghostNexusSettings",
        JSON.stringify(settings)
      );

      setMessage("✅ Settings saved successfully.");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to save settings.");
    }
  }

  function resetAll() {
    if (!window.confirm("Reset all Ghost Nexus settings?")) return;

    resetSettings();

    setMessage("✅ Settings reset.");

    setTimeout(() => setMessage(""), 3000);
  }

  function exportSettings() {
    const blob = new Blob(
      [JSON.stringify(settings, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ghost-nexus-settings.json";

    link.click();

    URL.revokeObjectURL(url);
  }

  function importSettings(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        updateSettings(imported);

        localStorage.setItem(
          "ghostNexusSettings",
          JSON.stringify(imported)
        );

        setMessage("✅ Settings imported.");

        setTimeout(() => setMessage(""), 3000);
      } catch {
        setMessage("❌ Invalid settings file.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="settings-card">

      <h2>💾 Save Ghost Nexus Settings</h2>

      <p>
        Save, reset, export or import your Ghost Nexus configuration.
      </p>

      <div className="save-buttons">

        <button
          className="save-btn"
          onClick={saveSettings}
        >
          Save Settings
        </button>

        <button
          className="reset-btn"
          onClick={resetAll}
        >
          Reset
        </button>

        <button
          className="export-btn"
          onClick={exportSettings}
        >
          Export
        </button>

        <button
          className="import-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Import
        </button>

      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={importSettings}
      />

      {message && (
        <div className="save-message">
          {message}
        </div>
      )}

    </div>
  );
}