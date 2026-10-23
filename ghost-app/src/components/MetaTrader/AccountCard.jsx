import React from "react";

const formatMoney = (value) => {
  if (value === undefined || value === null) return "0.00";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Stat = ({ label, value }) => (
  <div className="mt5-stat">
    <div className="mt5-stat-label">{label}</div>
    <div className="mt5-stat-value">{value}</div>
  </div>
);

const AccountCard = ({ account }) => {
  if (!account) {
    return (
      <div className="mt5-card">
        <h2 className="mt5-card-title">Account Information</h2>
        <p>No MT5 account connected.</p>
      </div>
    );
  }

  return (
    <div className="mt5-card">

      <h2 className="mt5-card-title">
        Account Overview
      </h2>

      <div className="mt5-grid">

        <Stat
          label="Account"
          value={account.login}
        />

        <Stat
          label="Broker"
          value={account.company}
        />

        <Stat
          label="Server"
          value={account.server}
        />

        <Stat
          label="Balance"
          value={`$${formatMoney(account.balance)}`}
        />

        <Stat
          label="Equity"
          value={`$${formatMoney(account.equity)}`}
        />

        <Stat
          label="Free Margin"
          value={`$${formatMoney(account.margin_free)}`}
        />

        <Stat
          label="Margin"
          value={`$${formatMoney(account.margin)}`}
        />

        <Stat
          label="Profit"
          value={`$${formatMoney(account.profit)}`}
        />

        <Stat
          label="Leverage"
          value={`1:${account.leverage}`}
        />

      </div>

    </div>
  );
};

export default AccountCard;