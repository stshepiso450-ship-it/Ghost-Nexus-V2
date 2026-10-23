// ============================================================
// GHOST NEXUS - REAL METATRADER PAGE
// ============================================================

import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import api from "../config/api";

import "./MetaTrader.css";


// ============================================================
// HELPERS
// ============================================================

function money(value) {

  const number = Number(value || 0);

  return `$${number.toFixed(2)}`;
}


function normalizePositions(positions) {

  if (!Array.isArray(positions)) {
    return [];
  }

  return positions;
}


// ============================================================
// COMPONENT
// ============================================================

export default function MetaTrader() {

  const [login, setLogin] = useState("");

  const [password, setPassword] = useState("");

  const [server, setServer] = useState("");

  const [name, setName] = useState(
    "Ghost Nexus"
  );

  const [connected, setConnected] = useState(false);

  const [connecting, setConnecting] = useState(false);

  const [disconnecting, setDisconnecting] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [account, setAccount] = useState(null);

  const [positions, setPositions] = useState([]);

  const [lastUpdated, setLastUpdated] = useState(null);


  // ==========================================================
  // LOAD STATUS
  // ==========================================================

  const loadStatus = useCallback(
    async () => {

      try {

        const status =
          await api.getMT5Status();

        const isConnected =
          status?.connected === true;

        setConnected(
          isConnected
        );

        if (
          status?.login &&
          !login
        ) {

          setLogin(
            String(status.login)
          );
        }

        if (
          status?.server &&
          !server
        ) {

          setServer(
            status.server
          );
        }

      } catch (err) {

        console.error(
          "MT5 status error:",
          err
        );

      } finally {

        setLoading(false);
      }
    },
    [login, server]
  );


  // ==========================================================
  // LOAD ACCOUNT
  // ==========================================================

  const loadAccount = useCallback(
    async () => {

      try {

        const result =
          await api.getMT5Account();

        if (
          result?.success &&
          result?.account
        ) {

          setAccount(
            result.account
          );

          setConnected(
            true
          );

          setLastUpdated(
            new Date()
          );
        }

      } catch (err) {

        console.error(
          "MT5 account error:",
          err
        );

      }
    },
    []
  );


  // ==========================================================
  // LOAD POSITIONS
  // ==========================================================

  const loadPositions = useCallback(
    async () => {

      try {

        const result =
          await api.getMT5Positions();

        if (
          result?.success
        ) {

          setPositions(
            normalizePositions(
              result.positions
            )
          );

          setLastUpdated(
            new Date()
          );
        }

      } catch (err) {

        console.error(
          "MT5 positions error:",
          err
        );

      }
    },
    []
  );


  // ==========================================================
  // REFRESH
  // ==========================================================

  const refresh = useCallback(
    async () => {

      await loadStatus();

      const status =
        await api.getMT5Status();

      if (
        status?.connected
      ) {

        await Promise.all([
          loadAccount(),
          loadPositions()
        ]);
      }

    },
    [
      loadStatus,
      loadAccount,
      loadPositions
    ]
  );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    refresh();

  }, [refresh]);


  // ==========================================================
  // LIVE REFRESH
  // ==========================================================

  useEffect(() => {

    if (!connected) {
      return undefined;
    }

    const interval =
      setInterval(
        () => {

          loadAccount();
          loadPositions();

        },
        5000
      );

    return () => {
      clearInterval(interval);
    };

  }, [
    connected,
    loadAccount,
    loadPositions
  ]);


  // ==========================================================
  // CONNECT
  // ==========================================================

  async function handleConnect(event) {

    event.preventDefault();

    setError("");

    setMessage("");

    if (!login) {

      setError(
        "MT5 login is required."
      );

      return;
    }

    if (!password) {

      setError(
        "MT5 password is required."
      );

      return;
    }

    if (!server) {

      setError(
        "MT5 server is required."
      );

      return;
    }

    setConnecting(true);

    try {

      const result =
        await api.connectMT5(
          login,
          password,
          server,
          name
        );

      if (
        result?.success &&
        result?.connected
      ) {

        setConnected(true);

        setAccount(
          result.account || null
        );

        setMessage(
          "REAL MT5 ACCOUNT CONNECTED"
        );

        setPassword("");

        await Promise.all([
          loadAccount(),
          loadPositions()
        ]);

      } else {

        setConnected(false);

        setError(
          result?.error ||
          result?.message ||
          "MT5 connection failed."
        );
      }

    } catch (err) {

      setConnected(false);

      setError(
        err.message ||
        "Unable to connect to MT5."
      );

    } finally {

      setConnecting(false);
    }
  }


  // ==========================================================
  // DISCONNECT
  // ==========================================================

  async function handleDisconnect() {

    setDisconnecting(true);

    setError("");

    setMessage("");

    try {

      const result =
        await api.disconnectMT5();

      if (
        result?.success
      ) {

        setConnected(false);

        setAccount(null);

        setPositions([]);

        setMessage(
          "MT5 ACCOUNT DISCONNECTED"
        );

      } else {

        setError(
          result?.message ||
          "Disconnect failed."
        );
      }

    } catch (err) {

      setError(
        err.message ||
        "Unable to disconnect MT5."
      );

    } finally {

      setDisconnecting(false);
    }
  }


  // ==========================================================
  // ACCOUNT VALUES
  // ==========================================================

  const balance =
    account?.balance ?? 0;

  const equity =
    account?.equity ?? 0;

  const margin =
    account?.margin ?? 0;

  const freeMargin =
    account?.freeMargin ??
    account?.free_margin ??
    0;

  const leverage =
    account?.leverage ?? 0;

  const currency =
    account?.currency || "USD";

  const tradeAllowed =
    account?.tradeAllowed ??
    account?.trade_allowed ??
    false;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="metatrader-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="account-toolbar">

        <div>

          <span className="live-label">
            ● LIVE ACCOUNT
          </span>

          <h2>
            {account?.broker ||
              account?.name ||
              "MetaTrader Account"}
          </h2>

          <p>

            Login:{" "}

            {account?.login ||
              login ||
              "Not connected"}

            {" • "}

            {account?.server ||
              server ||
              "No server"}

          </p>

        </div>


        {connected && (

          <button
            className="disconnect-button"
            onClick={handleDisconnect}
            disabled={disconnecting}
          >

            {disconnecting
              ? "DISCONNECTING..."
              : "DISCONNECT"}

          </button>

        )}

      </div>


      {/* ======================================================
          CONNECTION FORM
      ====================================================== */}

      {!connected && (

        <div className="glass-card">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                REAL MT5
              </span>

              <h2>
                Connect Trading Account
              </h2>

            </div>

          </div>


          <form
            className="mt5-connect-form"
            onSubmit={handleConnect}
          >

            <label>

              MT5 Login

              <input
                type="number"
                value={login}
                onChange={(e) =>
                  setLogin(e.target.value)
                }
                placeholder="MT5 Login"
              />

            </label>


            <label>

              MT5 Password

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="MT5 Password"
              />

            </label>


            <label>

              MT5 Server

              <input
                type="text"
                value={server}
                onChange={(e) =>
                  setServer(e.target.value)
                }
                placeholder="Broker-MT5Server"
              />

            </label>


            <label>

              Account Name

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Ghost Nexus"
              />

            </label>


            <button
              type="submit"
              className="connect-button"
              disabled={connecting}
            >

              {connecting
                ? "CONNECTING TO MT5..."
                : "CONNECT REAL MT5"}

            </button>

          </form>

        </div>

      )}


      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (

        <div className="error-card">

          {error}

        </div>

      )}


      {message && (

        <div className="success-card">

          {message}

        </div>

      )}


      {/* ======================================================
          ACCOUNT
      ====================================================== */}

      {connected && (

        <>

          <div className="account-grid">

            <div className="glass-card stat-card">

              <span>
                Balance
              </span>

              <strong>
                {money(balance)}
              </strong>

            </div>


            <div className="glass-card stat-card">

              <span>
                Equity
              </span>

              <strong>
                {money(equity)}
              </strong>

            </div>


            <div className="glass-card stat-card">

              <span>
                Free Margin
              </span>

              <strong>
                {money(freeMargin)}
              </strong>

            </div>


            <div className="glass-card stat-card">

              <span>
                Leverage
              </span>

              <strong>
                1:{leverage || 0}
              </strong>

            </div>

          </div>


          {/* ==================================================
              ACCOUNT STATUS
          ================================================== */}

          <div className="glass-card">

            <div className="section-heading">

              <div>

                <span className="eyebrow">
                  REAL MT5
                </span>

                <h2>
                  Account Status
                </h2>

              </div>

              <span className="ai-live">
                LIVE
              </span>

            </div>


            <div className="signal-grid">

              <div>

                <span>
                  Currency
                </span>

                <strong>
                  {currency}
                </strong>

              </div>


              <div>

                <span>
                  Margin
                </span>

                <strong>
                  {money(margin)}
                </strong>

              </div>


              <div>

                <span>
                  Trading
                </span>

                <strong
                  className={
                    tradeAllowed
                      ? "buy"
                      : "sell"
                  }
                >

                  {tradeAllowed
                    ? "ALLOWED"
                    : "DISABLED"}

                </strong>

              </div>


              <div>

                <span>
                  Provider
                </span>

                <strong>
                  MetaAPI
                </strong>

              </div>


              <div>

                <span>
                  Execution
                </span>

                <strong>
                  REAL
                </strong>

              </div>


              <div>

                <span>
                  Account ID
                </span>

                <strong>
                  {account?.id || "-"}
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              POSITIONS
          ================================================== */}

          <div className="glass-card positions-card">

            <div className="section-heading">

              <div>

                <span className="eyebrow">
                  REAL MT5
                </span>

                <h2>
                  Open Positions
                </h2>

              </div>

              <span>
                {positions.length}
              </span>

            </div>


            {positions.length === 0 ? (

              <div className="empty-trade">

                No open positions.

              </div>

            ) : (

              <div className="positions-list">

                {positions.map(
                  (position, index) => {

                    const profit =
                      Number(
                        position.profit ||
                        0
                      );

                    return (

                      <div
                        className="position-row"
                        key={
                          position.id ||
                          position.ticket ||
                          index
                        }
                      >

                        <div>

                          <strong>
                            {position.symbol ||
                              "-"}
                          </strong>

                          <span>
                            {position.type ||
                              "-"}
                          </span>

                        </div>


                        <div>

                          <span>
                            Volume
                          </span>

                          <strong>
                            {position.volume ||
                              "-"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Entry
                          </span>

                          <strong>
                            {position.openPrice ??
                              position.open_price ??
                              "-"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Profit
                          </span>

                          <strong
                            className={
                              profit >= 0
                                ? "buy"
                                : "sell"
                            }
                          >

                            {money(profit)}

                          </strong>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              EA
          ================================================== */}

          <div className="glass-card ea-card">

            <div>

              <span className="eyebrow">
                GHOST NEXUS EA
              </span>

              <h2>
                EA Connection
              </h2>

              <p>
                Your real MT5 account is connected
                through MetaAPI and is ready for
                Ghost Nexus integration.
              </p>

            </div>


            <div className="ea-status">

              <span className="status-dot" />

              MT5 CONNECTED

            </div>

          </div>


          {/* ==================================================
              UPDATED
          ================================================== */}

          {lastUpdated && (

            <div className="last-updated">

              Last updated:{" "}

              {lastUpdated.toLocaleTimeString()}

            </div>

          )}

        </>

      )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div className="loading-state">

          Checking MT5 connection...

        </div>

      )}

    </div>
  );
}