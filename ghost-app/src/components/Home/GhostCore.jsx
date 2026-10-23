import React from "react";
import "./GhostCore.css";

import { useDashboard } from "../../context/DashboardContext";

import defaultLogo from "../../assets/ghost-logo.png";

export default function GhostCore() {

    const { dashboard } = useDashboard();

    const interfaceImage =
        localStorage.getItem("ghostInterface") ||
        defaultLogo;

    const online =
        dashboard?.metaapi ||
        dashboard?.server ||
        dashboard?.connected;

    return (

        <div className="ghost-core">

            {/* Animated Rings */}

            <div className="ring ring1"></div>
            <div className="ring ring2"></div>
            <div className="ring ring3"></div>
            <div className="ring ring4"></div>

            {/* Glow */}

            <div className="core-glow"></div>

            {/* Image */}

            <div className="core-image">

                <img
                    src={interfaceImage}
                    alt="Ghost Nexus Core"
                />

            </div>

            {/* Status */}

            <div
                className={
                    online
                        ? "core-status online"
                        : "core-status offline"
                }
            >
                {online ? "🟢" : "🔴"}
            </div>

            {/* AI Badge */}

            <div className="ai-badge">

                GHOST AI

            </div>

            {/* Title */}

            <h3>

                Your Trading With

            </h3>

            <h1>

                Ghost Nexus

            </h1>

            <div className="powered">

                Powered By Ghost Nexus

            </div>

            {/* Live Info */}

            <div className="core-live">

                <div className="live-item">

                    <span>Status</span>

                    <strong>

                        {online
                            ? "ONLINE"
                            : "OFFLINE"}

                    </strong>

                </div>

                <div className="live-item">

                    <span>License</span>

                    <strong>

                        {dashboard?.license
                            || "ACTIVE"}

                    </strong>

                </div>

                <div className="live-item">

                    <span>Robot</span>

                    <strong>

                        {dashboard?.robot
                            || "Ghost Nexus EA"}

                    </strong>

                </div>

                <div className="live-item">

                    <span>Mode</span>

                    <strong>

                        {dashboard?.mode
                            || "Sniper"}

                    </strong>

                </div>

                <div className="live-item">

                    <span>Balance</span>

                    <strong>

                        ${dashboard?.balance || 0}

                    </strong>

                </div>

                <div className="live-item">

                    <span>Profit</span>

                    <strong
                        className={
                            dashboard?.profit >= 0
                                ? "profit-green"
                                : "profit-red"
                        }
                    >

                        ${dashboard?.profit || 0}

                    </strong>

                </div>

            </div>

            {/* Bottom Pulse */}

            <div className="pulse-line"></div>

        </div>

    );

}