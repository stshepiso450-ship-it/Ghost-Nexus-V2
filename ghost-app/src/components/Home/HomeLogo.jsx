import React from "react";
import "./HomeLogo.css";

// Later this will come from your App Context / Settings
// const { settings } = useApp();

export default function HomeLogo() {

  // Temporary default logo
  const logo = "/assets/logo/ghost-logo.png";

  return (
    <div className="home-logo-container">

      <div className="logo-ring"></div>

      <div className="logo-glow"></div>

      <img
        src={logo}
        alt="Ghost Nexus"
        className="home-logo"
      />

    </div>
  );
}