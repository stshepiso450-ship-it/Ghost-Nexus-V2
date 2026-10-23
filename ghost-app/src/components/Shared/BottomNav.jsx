import React from "react";
import { NavLink } from "react-router-dom";
import { Ghost, BrainCircuit, ChartCandlestick } from "lucide-react";

import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Ghost className="nav-icon" size={22} strokeWidth={2} />
        <span className="nav-label">HOME</span>
      </NavLink>

      <NavLink
        to="/ai-scanner"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <BrainCircuit className="nav-icon" size={22} strokeWidth={2} />
        <span className="nav-label">AI SCANNER</span>
      </NavLink>

      <NavLink
        to="/mt5"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <ChartCandlestick
          className="nav-icon"
          size={22}
          strokeWidth={2}
        />
        <span className="nav-label">METATRADER</span>
      </NavLink>
    </nav>
  );
}
