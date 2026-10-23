import React from "react";

const PositionsTable = ({ positions = [] }) => {
  const formatMoney = (value) => {
    if (value === undefined || value === null) return "0.00";
    return Number(value).toFixed(2);
  };

  if (!positions.length) {
    return (
      <div className="mt5-card">
        <h2 className="mt5-card-title">
          Open Positions
        </h2>

        <p>No open positions.</p>
      </div>
    );
  }

  return (
    <div className="mt5-card">

      <h2 className="mt5-card-title">
        Open Positions ({positions.length})
      </h2>

      <table className="positions-table">

        <thead>

          <tr>
            <th>Ticket</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Lot</th>
            <th>Open</th>
            <th>Current</th>
            <th>Profit</th>
          </tr>

        </thead>

        <tbody>

          {positions.map((trade) => (
            <tr key={trade.ticket}>

              <td>{trade.ticket}</td>

              <td>{trade.symbol}</td>

              <td
                className={
                  trade.type === 0
                    ? "buy-color"
                    : "sell-color"
                }
              >
                {trade.type === 0 ? "BUY" : "SELL"}
              </td>

              <td>{trade.volume}</td>

              <td>{formatMoney(trade.price_open)}</td>

              <td>{formatMoney(trade.price_current)}</td>

              <td
                className={
                  trade.profit >= 0
                    ? "buy-color"
                    : "sell-color"
                }
              >
                {formatMoney(trade.profit)}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PositionsTable;