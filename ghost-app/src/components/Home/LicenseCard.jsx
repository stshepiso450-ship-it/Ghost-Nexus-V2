import React, { useEffect, useState } from "react";
import "./LicenseCard.css";

// IMPORTANT:
// This must be your PC's current LAN IPv4 address.
// Your PC must be running the Ghost Nexus backend on port 8000.
const API = "http://192.168.68.156:8000";

export default function LicenseCard() {
    const [license, setLicense] = useState("");
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("info");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("ghost_license");

            if (saved) {
                setLicense(saved);
                setStatus("Saved license found. Verify it by activating.");
                setStatusType("info");
            }
        } catch (error) {
            console.error("Unable to read saved license:", error);
        }
    }, []);

    function showStatus(message, type = "info") {
        setStatus(message);
        setStatusType(type);
    }

    async function activate() {
        const key = license.trim().toUpperCase();

        if (!key) {
            showStatus("Enter your Ghost Nexus license key.", "error");
            return;
        }

        if (loading) return;

        setLoading(true);
        showStatus("Connecting to Ghost Nexus...", "info");

        try {
            const response = await fetch(`${API}/license/activate`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key,
                    client_id: "ghost-nexus-android",
                    client_email: null,
                    device: /Android/i.test(navigator.userAgent)
                        ? "Android"
                        : /iPhone|iPad|iPod/i.test(navigator.userAgent)
                          ? "iOS"
                          : "PC",
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                let message = data.message || data.detail;

                if (Array.isArray(message)) {
                    message = message
                        .map((item) => item.msg || JSON.stringify(item))
                        .join(", ");
                }

                if (typeof message !== "string") {
                    message = `Activation failed (HTTP ${response.status}).`;
                }

                throw new Error(message);
            }

            if (data.success !== true || !data.license) {
                throw new Error(
                    data.message || "The server did not confirm activation."
                );
            }

            const licenseData = data.license;

            // Save only after the server confirms activation.
            localStorage.setItem("ghost_license", licenseData.license_key || key);
            localStorage.setItem(
                "ghost_robot",
                licenseData.ea_id || "Ghost Nexus EA"
            );

            if (licenseData.mentor_id) {
                localStorage.setItem(
                    "ghost_mentor_id",
                    String(licenseData.mentor_id)
                );
            }

            if (licenseData.mentor_name) {
                localStorage.setItem(
                    "ghost_mentor_name",
                    licenseData.mentor_name
                );
            } else {
                localStorage.removeItem("ghost_mentor_name");
            }

            if (licenseData.ea_id) {
                localStorage.setItem("ghost_ea_id", licenseData.ea_id);
            }

            if (licenseData.expires_at) {
                localStorage.setItem(
                    "ghost_license_expires",
                    String(licenseData.expires_at)
                );
            } else {
                localStorage.removeItem("ghost_license_expires");
            }

            if (data.settings) {
                localStorage.setItem(
                    "ghost_trading_settings",
                    JSON.stringify(data.settings)
                );
            }

            setLicense(licenseData.license_key || key);

            showStatus(
                `License activated successfully. EA: ${
                    licenseData.ea_id || "Ghost Nexus EA"
                }.`,
                "success"
            );

        } catch (error) {
            console.error("Ghost Nexus license activation error:", error);

            if (error instanceof TypeError) {
                showStatus(
                    `Cannot reach Ghost Nexus at ${API}. Check your PC IP, backend, network, and firewall.`,
                    "error"
                );
            } else {
                showStatus(
                    error.message || "Unable to activate the license.",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="license-card">
            <h2>Add EA / License</h2>

            <p>
                Enter your license key to activate your Ghost Nexus EA.
            </p>

            <input
                type="text"
                aria-label="Ghost Nexus license key"
                placeholder="GNX-XXXX-XXXX-XXXX"
                value={license}
                onChange={(event) => {
                    setLicense(event.target.value.toUpperCase());

                    if (status) {
                        setStatus("");
                        setStatusType("info");
                    }
                }}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                disabled={loading}
            />

            <button
                type="button"
                onClick={activate}
                disabled={loading}
            >
                {loading ? "Activating..." : "Activate License"}
            </button>

            {status && (
                <p
                    className={`license-status license-status--${statusType}`}
                    role="status"
                    aria-live="polite"
                >
                    {status}
                </p>
            )}
        </section>
    );
}