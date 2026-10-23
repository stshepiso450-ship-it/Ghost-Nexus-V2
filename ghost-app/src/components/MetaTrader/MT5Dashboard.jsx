import React from "react";
import "./MT5Dashboard.css";

import {
  FaWallet,
  FaChartLine,
  FaExchangeAlt,
  FaServer,
  FaRobot,
  FaSignal,
  FaClock,
  FaGlobe,
  FaCheckCircle
} from "react-icons/fa";

export default function MT5Dashboard({ account }) {

  if (!account) return null;

  return (

    <div className="dashboard-grid">

      {/* ACCOUNT */}

      <div className="dashboard-card">

        <h2>

          <FaWallet />

          Account

        </h2>

        <div className="row">
          <span>Name</span>
          <strong>{account.name}</strong>
        </div>

        <div className="row">
          <span>Login</span>
          <strong>{account.login}</strong>
        </div>

        <div className="row">
          <span>Broker</span>
          <strong>{account.broker}</strong>
        </div>

        <div className="row">
          <span>Server</span>
          <strong>{account.server}</strong>
        </div>

      </div>

      {/* MONEY */}

      <div className="dashboard-card">

        <h2>

          <FaChartLine />

          Account Summary

        </h2>

        <div className="row">
          <span>Balance</span>
          <strong>${account.balance}</strong>
        </div>

        <div className="row">
          <span>Equity</span>
          <strong>${account.equity}</strong>
        </div>

        <div className="row">
          <span>Margin</span>
          <strong>${account.margin}</strong>
        </div>

        <div className="row">
          <span>Free Margin</span>
          <strong>${account.free_margin}</strong>
        </div>

      </div>

      {/* TERMINAL */}

      <div className="dashboard-card">

        <h2>

          <FaServer />

          Terminal

        </h2>

        <div className="row">

          <span>Ghost Server</span>

          <strong className="green">

            ONLINE

          </strong>

        </div>

        <div className="row">

          <span>MT5</span>

          <strong className="green">

            CONNECTED

          </strong>

        </div>

        <div className="row">

          <span>EA</span>

          <strong className="green">

            RUNNING

          </strong>

        </div>

        <div className="row">

          <span>License</span>

          <strong className="green">

            VERIFIED

          </strong>

        </div>

      </div>

      {/* AI */}

      <div className="dashboard-card">

        <h2>

          <FaRobot />

          Ghost AI

        </h2>

        <div className="row">

          <span>Scanner</span>

          <strong className="green">

            READY

          </strong>

        </div>

        <div className="row">

          <span>Watching</span>

          <strong>

            XAUUSD

          </strong>

        </div>

        <div className="row">

          <span>Confidence</span>

          <strong>

            94%

          </strong>

        </div>

        <div className="row">

          <span>Last Signal</span>

          <strong className="green">

            BUY

          </strong>

        </div>

      </div>

      {/* TRADING */}

      <div className="dashboard-card">

        <h2>

          <FaExchangeAlt />

          Trading

        </h2>

        <div className="row">

          <span>Open Trades</span>

          <strong>

            2

          </strong>

        </div>

        <div className="row">

          <span>Today's Profit</span>

          <strong className="green">

            +$245.20

          </strong>

        </div>

        <div className="row">

          <span>Win Rate</span>

          <strong>

            92%

          </strong>

        </div>

      </div>

      {/* LIVE LOGS */}

      <div className="dashboard-card">

        <h2>

          <FaSignal />

          Live Logs

        </h2>

        <div className="logs">

          <p>

            <FaCheckCircle/>

            Connected to MT5

          </p>

          <p>

            <FaClock/>

            Waiting for Signal...

          </p>

          <p>

            <FaRobot/>

            Ghost AI Online

          </p>

          <p>

            <FaGlobe/>

            Broker Connected

          </p>

        </div>

      </div>

    </div>

  );

}