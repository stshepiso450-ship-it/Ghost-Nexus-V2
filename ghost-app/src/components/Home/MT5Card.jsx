import React from "react";
import "./MT5Card.css";
import { FaServer } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

export default function MT5Card() {

  const { dashboard } = useDashboard();

  return (

    <div className="mt5-card">

      <div className="mt5-header">

        <FaServer />

        <div>

          <h3>MT5 Connection</h3>

          <span>

            {dashboard.metaapi
              ? "🟢 Connected"
              : "🔴 Disconnected"}

          </span>

        </div>

      </div>

      <div className="mt5-grid">

        <div className="mt5-box">
          <small>Balance</small>
          <h2>${dashboard.balance}</h2>
        </div>

        <div className="mt5-box">
          <small>Equity</small>
          <h2>${dashboard.equity}</h2>
        </div>

        <div className="mt5-box">
          <small>Profit</small>
          <h2>${dashboard.profit}</h2>
        </div>

        <div className="mt5-box">
          <small>Positions</small>
          <h2>{dashboard.positions}</h2>
        </div>

      </div>

    </div>

  );

}