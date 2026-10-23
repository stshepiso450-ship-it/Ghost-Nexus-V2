import React, { useState } from "react";
import mt5Bridge from "../../src/services/mt5Bridge";

const TradePanel = () => {
  const [symbol, setSymbol] = useState("XAUUSD");
  const [volume, setVolume] = useState(0.01);
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");

  const [loading, setLoading] = useState(false);

  const execute = async (type) => {
    setLoading(true);

    try {
      const result =
        type === "BUY"
          ? await mt5Bridge.buy({
              symbol,
              volume,
              sl,
              tp,
            })
          : await mt5Bridge.sell({
              symbol,
              volume,
              sl,
              tp,
            });

      if (result.success) {
        alert(`${type} order placed successfully.`);
      } else {
        alert(result.error || "Trade failed.");
      }
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="mt5-card">

      <h2 className="mt5-card-title">
        Trade Panel
      </h2>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />

      <input
        type="number"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        placeholder="Lot Size"
      />

      <input
        type="number"
        value={sl}
        onChange={(e) => setSl(e.target.value)}
        placeholder="Stop Loss"
      />

      <input
        type="number"
        value={tp}
        onChange={(e) => setTp(e.target.value)}
        placeholder="Take Profit"
      />

      <div className="mt5-actions">

        <button
          className="connect-btn"
          disabled={loading}
          onClick={() => execute("BUY")}
        >
          BUY
        </button>

        <button
          className="disconnect-btn"
          disabled={loading}
          onClick={() => execute("SELL")}
        >
          SELL
        </button>

      </div>

    </div>
  );
};

export default TradePanel;