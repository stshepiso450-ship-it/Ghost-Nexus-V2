import React, { useState, useEffect } from "react";
import "./RobotList.css";

export default function RobotList() {
  const [license, setLicense] = useState(false);
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    const savedLicense = localStorage.getItem("ghost_license");

    if (savedLicense) {
      setLicense(true);

      setRobots([
        {
          name: "Ghost Nexus EA",
          status: "Ready",
        },
      ]);
    }
  }, []);

  if (!license) {
    return null;
  }

  return (
    <div className="robot-list">
      <h3>🤖 Robot List</h3>

      {robots.map((robot, index) => (
        <div className="robot-card" key={index}>
          <h4>{robot.name}</h4>

          <p>Status: {robot.status}</p>

          <button>ON / OFF</button>

          <button>Remove</button>

          <button>Quotes</button>
        </div>
      ))}
    </div>
  );
}