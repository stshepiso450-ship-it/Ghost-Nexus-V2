import React from "react";
import "./Settings.css";

import AISettings from "../components/Settings/AISettings";
import TradingSettings from "../components/Settings/TradingSettings";
import ProfileSettings from "../components/Settings/ProfileSettings";
import AppearanceSettings from "../components/Settings/AppearanceSettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import LicenseSettings from "../components/Settings/LicenseSettings";
import AboutSettings from "../components/Settings/AboutSettings";

import { FaCog } from "react-icons/fa";

export default function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-container">

        <header className="settings-header">
          <h1>
            <FaCog />
            Ghost Nexus Settings
          </h1>

          <p>
            AI Trading Control Center
          </p>
        </header>

        <AISettings />

        <TradingSettings />

        <ProfileSettings />

        <AppearanceSettings />

        <NotificationSettings />

        <LicenseSettings />

        <AboutSettings />

      </div>
    </div>
  );
}