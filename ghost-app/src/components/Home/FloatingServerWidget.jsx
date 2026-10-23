import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import "./FloatingServerWidget.css";
import { getStatus } from "../../services/ghostServer";

export default function FloatingServerWidget() {
  const [status, setStatus] = useState({
    server: false,
    mt5: false,
    scanner: false,
    balance: 0,
    profit: 0,
    trades: 0,
    ping: 0,
  });

  useEffect(() => {
    loadStatus();

    const timer = setInterval(loadStatus, 1000);

    return () => clearInterval(timer);
  }, []);

  async function loadStatus() {
    try {
      const data = await getStatus();

      setStatus({
        server: data.server,
        mt5: data.mt5,
        scanner: data.scanner,
        balance: data.balance,
        profit: data.profit,
        trades: data.trades,
        ping: data.ping,
      });
    } catch {
      setStatus((prev) => ({
        ...prev,
        server: false,
      }));
    }
  }

  return (
    <Draggable>

      <div className="floating-widget">

        <h3>Ghost Core</h3>

        <div className="widget-row">
          <span>Server</span>
          <span>{status.server ? "🟢" : "🔴"}</span>
        </div>

        <div className="widget-row">
          <span>MT5</span>
          <span>{status.mt5 ? "🟢" : "🔴"}</span>
        </div>

        <div className="widget-row">
          <span>Scanner</span>
          <span>{status.scanner ? "🟢" : "🔴"}</span>
        </div>

        <div className="widget-row">
          <span>Balance</span>
          <span>${status.balance}</span>
        </div>

        <div className="widget-row">
          <span>Profit</span>
          <span>${status.profit}</span>
        </div>

        <div className="widget-row">
          <span>Trades</span>
          <span>{status.trades}</span>
        </div>

        <div className="widget-row">
          <span>Ping</span>
          <span>{status.ping} ms</span>
        </div>

      </div>

    </Draggable>
  );
}