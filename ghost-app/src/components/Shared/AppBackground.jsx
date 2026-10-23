import React, { useEffect, useState } from "react";
import "./AppBackground.css";

export default function AppBackground() {

  const [background, setBackground] = useState(
    localStorage.getItem("ghostBackground") || ""
  );

  const [backgroundType, setBackgroundType] = useState(
    localStorage.getItem("ghostBackgroundType") || ""
  );

  useEffect(() => {

    function updateBackground() {

      setBackground(
        localStorage.getItem("ghostBackground") || ""
      );

      setBackgroundType(
        localStorage.getItem("ghostBackgroundType") || ""
      );

    }

    updateBackground();

    window.addEventListener(
      "backgroundChanged",
      updateBackground
    );

    return () => {

      window.removeEventListener(
        "backgroundChanged",
        updateBackground
      );

    };

  }, []);

  if (!background) return null;

  if (backgroundType.startsWith("video")) {

    return (

      <video
        className="app-background"
        autoPlay
        muted
        loop
        playsInline
      >

        <source
          src={background}
          type={backgroundType}
        />

      </video>

    );

  }

  return (

    <img
      src={background}
      alt="Ghost Nexus Background"
      className="app-background"
    />

  );

}