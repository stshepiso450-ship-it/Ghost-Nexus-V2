import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CirclePlus,
  Database,
  Gauge,
  Link2,
  Power,
  Radio,
  RefreshCw,
  Server,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import "./Home.css";

const API = (
  import.meta.env.VITE_API_URL || "http://192.168.68.106:8000"
).replace(/\/$/, "");

const MENTOR_STORAGE_KEY = "ghost_nexus_mentor";
const MENTOR_AVATAR_STORAGE_KEY = "ghost_nexus_mentor_avatar";
const LICENSE_STORAGE_KEY = "ghost_nexus_license";
const EA_CONFIG_STORAGE_KEY = "ghost_nexus_ea_config";

const DEFAULT_SYMBOL = "XAUUSD";
const DEFAULT_LOT = "0.01";
const DEFAULT_TRADES = "5";

const FOREX_SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "USDCAD",
  "AUDUSD",
  "NZDUSD",
  "EURGBP",
  "EURJPY",
  "EURCHF",
  "EURAUD",
  "EURNZD",
  "EURCAD",
  "GBPJPY",
  "GBPCHF",
  "GBPAUD",
  "GBPCAD",
  "GBPNZD",
  "AUDJPY",
  "AUDCAD",
  "AUDCHF",
  "AUDNZD",
  "NZDJPY",
  "NZDCAD",
  "NZDCHF",
  "CADJPY",
  "CADCHF",
  "CHFJPY",
  "USDZAR",
  "USDMXN",
  "USDTRY",
  "USDSEK",
  "USDNOK",
  "USDSGD",
  "USDHKD",
];

const METALS_SYMBOLS = [
  "XAUUSD",
  "XAGUSD",
  "XPTUSD",
  "XPDUSD",
];

const CRYPTO_SYMBOLS = [
  "BTCUSD",
  "ETHUSD",
  "XRPUSD",
  "LTCUSD",
  "BCHUSD",
  "SOLUSD",
  "ADAUSD",
  "DOGEUSD",
  "DOTUSD",
  "AVAXUSD",
  "LINKUSD",
  "MATICUSD",
];

function ConnectionItem({ icon, label, online }) {
  return (
    <div className="connection-item">
      <div className="connection-icon">{icon}</div>

      <div className="connection-info">
        <strong>{label}</strong>
        <span>{online ? "CONNECTED" : "OFFLINE"}</span>
      </div>

      <span
        className={`connection-dot ${
          online
            ? "connection-online"
            : "connection-offline"
        }`}
      />
    </div>
  );
}

const Home = () => {
  const [eaEnabled, setEaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [robots, setRobots] = useState([]);

  const [mentorName, setMentorName] = useState("");
  const [mentorAvatar, setMentorAvatar] = useState("");

  const [showAddEA, setShowAddEA] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseError, setLicenseError] = useState("");
  const [licenseMessage, setLicenseMessage] = useState("");

  const [serverOnline, setServerOnline] = useState(false);
  const [serverPanelOpen, setServerPanelOpen] = useState(false);

  const [serverDetails, setServerDetails] = useState({
    ea: false,
    metatrader: false,
    backend: false,
    metaapi: false,
    signals: false,
  });

  const [signal, setSignal] = useState(null);
  const [signalVisible, setSignalVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [tradeTriggered, setTradeTriggered] = useState(false);

  const [error, setError] = useState("");

  const [quotesOpen, setQuotesOpen] = useState(false);
  const [quoteMarket, setQuoteMarket] = useState("METALS");
  const [quoteSymbol, setQuoteSymbol] =
    useState(DEFAULT_SYMBOL);
  const [quoteSearch, setQuoteSearch] = useState("");
  const [quoteTrades, setQuoteTrades] =
    useState(DEFAULT_TRADES);
  const [quoteLot, setQuoteLot] =
    useState(DEFAULT_LOT);
  const [quoteDirection, setQuoteDirection] =
    useState("BOTH");
  const [quoteSaving, setQuoteSaving] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteError, setQuoteError] = useState("");

  const [orbPosition, setOrbPosition] = useState({
    x: null,
    y: null,
  });

  const [dragging, setDragging] = useState(false);

  const dragRef = useRef({
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const countdownTimerRef = useRef(null);

  const quoteSymbols = useMemo(() => {
    if (quoteMarket === "FOREX") {
      return FOREX_SYMBOLS;
    }

    if (quoteMarket === "METALS") {
      return METALS_SYMBOLS;
    }

    return CRYPTO_SYMBOLS;
  }, [quoteMarket]);

  const filteredQuoteSymbols = useMemo(() => {
    const search = quoteSearch
      .trim()
      .toUpperCase();

    if (!search) {
      return quoteSymbols;
    }

    return quoteSymbols.filter((symbol) =>
      symbol.includes(search)
    );
  }, [quoteSearch, quoteSymbols]);

  useEffect(() => {
    try {
      const savedMentor =
        localStorage.getItem(
          MENTOR_STORAGE_KEY
        );

      const savedAvatar =
        localStorage.getItem(
          MENTOR_AVATAR_STORAGE_KEY
        );

      const savedLicense =
        localStorage.getItem(
          LICENSE_STORAGE_KEY
        );

      const savedConfig =
        localStorage.getItem(
          EA_CONFIG_STORAGE_KEY
        );

      if (savedMentor) {
        setMentorName(savedMentor);
      }

      if (savedAvatar) {
        setMentorAvatar(savedAvatar);
      }

      if (savedLicense) {
        setLicenseKey(savedLicense);
      }

      if (savedConfig) {
        const config = JSON.parse(savedConfig);

        if (config?.symbol) {
          setQuoteSymbol(config.symbol);
        }

        if (config?.trades) {
          setQuoteTrades(
            String(config.trades)
          );
        }

        if (
          config?.lot_size !== undefined
        ) {
          setQuoteLot(
            String(config.lot_size)
          );
        }

        if (config?.direction) {
          setQuoteDirection(
            config.direction
          );
        }

        if (config?.symbol) {
          if (
            METALS_SYMBOLS.includes(
              config.symbol
            )
          ) {
            setQuoteMarket("METALS");
          } else if (
            CRYPTO_SYMBOLS.includes(
              config.symbol
            )
          ) {
            setQuoteMarket("CRYPTO");
          } else {
            setQuoteMarket("FOREX");
          }
        }
      }
    } catch {
      // Ignore local storage errors.
    }
  }, []);

  useEffect(() => {
    const positionOrb = () => {
      const size =
        window.innerWidth <= 380
          ? 56
          : 60;

      setOrbPosition((current) => {
        if (
          current.x !== null &&
          current.y !== null
        ) {
          return current;
        }

        return {
          x: Math.round(
            window.innerWidth / 2 -
              size / 2
          ),
          y: Math.round(
            window.innerHeight * 0.42
          ),
        };
      });
    };

    positionOrb();

    window.addEventListener(
      "resize",
      positionOrb
    );

    return () =>
      window.removeEventListener(
        "resize",
        positionOrb
      );
  }, []);

  const fetchJSON = useCallback(
    async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Request failed: ${response.status}`
        );
      }

      return data;
    },
    []
  );

  const loadEA = useCallback(async () => {
    try {
      const data = await fetchJSON(
        `${API}/ea/status`
      );

      const running =
        data?.running === true ||
        data?.active === true ||
        String(
          data?.status || ""
        ).toUpperCase() === "RUNNING";

      const backendConnected =
        data?.connected === true ||
        data?.server_online === true ||
        data?.backend_connected ===
          true;

      const mtConnected =
        data?.mt5_connected === true ||
        data?.metatrader_connected ===
          true ||
        data?.mt5?.connected === true;

      const metaApiConnected =
        data?.metaapi_connected === true ||
        data?.metaapi?.connected === true;

      const signalConnected =
        data?.signals_connected === true ||
        data?.signal_engine === true ||
        String(
          data?.signal_status || ""
        ).toUpperCase() === "ONLINE";

      setEaEnabled(running);

      setServerOnline(
        backendConnected ||
          mtConnected ||
          metaApiConnected
      );

      setServerDetails({
        ea: running,
        metatrader: mtConnected,
        backend: backendConnected,
        metaapi: metaApiConnected,
        signals: signalConnected,
      });

      const returnedMentorName =
        data?.mentor_name ||
        data?.mentor?.name ||
        data?.mentor?.mentor_name ||
        "";

      const returnedAvatar =
        data?.mentor_avatar ||
        data?.mentor?.avatar ||
        data?.mentor?.profile_image ||
        data?.mentor?.profile_picture ||
        "";

      if (returnedMentorName) {
        setMentorName(
          returnedMentorName
        );

        localStorage.setItem(
          MENTOR_STORAGE_KEY,
          returnedMentorName
        );
      }

      if (returnedAvatar) {
        setMentorAvatar(returnedAvatar);

        localStorage.setItem(
          MENTOR_AVATAR_STORAGE_KEY,
          returnedAvatar
        );
      }

      if (
        data?.id ||
        data?.ea_id ||
        data?.name ||
        data?.ea_name
      ) {
        const robot = {
          id:
            data?.id ||
            data?.ea_id ||
            "ghost-nexus-ea",

          name:
            data?.name ||
            data?.ea_name ||
            "Ghost Nexus EA",

          symbol:
            data?.symbol ||
            quoteSymbol ||
            DEFAULT_SYMBOL,

          status: running ? "ON" : "OFF",
        };

        setRobots((current) => {
          if (current.length === 0) {
            return [robot];
          }

          return current.map(
            (existing) => ({
              ...existing,
              ...robot,
            })
          );
        });
      }
    } catch {
      setEaEnabled(false);
      setServerOnline(false);

      setServerDetails((current) => ({
        ...current,
        backend: false,
        metaapi: false,
        metatrader: false,
        signals: false,
      }));
    }
  }, [fetchJSON, quoteSymbol]);

  useEffect(() => {
    loadEA();

    const interval = setInterval(
      loadEA,
      5000
    );

    return () =>
      clearInterval(interval);
  }, [loadEA]);

  const verifyLicense = async () => {
    const cleanKey =
      licenseKey.trim();

    if (!cleanKey) {
      setLicenseError(
        "Enter your license key."
      );
      return;
    }

    setLicenseLoading(true);
    setLicenseError("");
    setLicenseMessage("");

    try {
      const data = await fetchJSON(
        `${API}/ea/license/validate`,
        {
          method: "POST",
          body: JSON.stringify({
            license_key: cleanKey,
          }),
        }
      );

      const valid =
        data?.valid === true ||
        data?.success === true;

      if (!valid) {
        setLicenseError(
          data?.message ||
            "License is not valid."
        );
        return;
      }

      const returnedMentorName =
        data?.mentor_name ||
        data?.mentor?.name ||
        data?.mentor?.mentor_name ||
        "";

      const returnedAvatar =
        data?.mentor_avatar ||
        data?.mentor?.avatar ||
        data?.mentor?.profile_image ||
        data?.mentor?.profile_picture ||
        "";

      if (!returnedMentorName) {
        setLicenseError(
          "License is valid, but no mentor is attached to this license."
        );
        return;
      }

      const newRobot = {
        id:
          data?.ea_id ||
          data?.id ||
          "ghost-nexus-ea",

        name:
          data?.ea_name ||
          data?.name ||
          "Ghost Nexus EA",

        symbol:
          data?.symbol ||
          DEFAULT_SYMBOL,

        status: "OFF",
      };

      setMentorName(
        returnedMentorName
      );

      if (returnedAvatar) {
        setMentorAvatar(
          returnedAvatar
        );

        localStorage.setItem(
          MENTOR_AVATAR_STORAGE_KEY,
          returnedAvatar
        );
      }

      localStorage.setItem(
        MENTOR_STORAGE_KEY,
        returnedMentorName
      );

      localStorage.setItem(
        LICENSE_STORAGE_KEY,
        cleanKey
      );

      setRobots((current) => {
        const alreadyExists =
          current.some(
            (robot) =>
              robot.id ===
              newRobot.id
          );

        if (alreadyExists) {
          return current.map(
            (robot) =>
              robot.id === newRobot.id
                ? {
                    ...robot,
                    ...newRobot,
                  }
                : robot
          );
        }

        return [...current, newRobot];
      });

      setLicenseMessage(
        `License verified — ${returnedMentorName}`
      );

      setShowAddEA(false);
      setLicenseKey("");
    } catch (err) {
      setLicenseError(
        err?.message ||
          "License verification failed."
      );
    } finally {
      setLicenseLoading(false);
    }
  };

  const toggleEA = async () => {
    if (loading) {
      return;
    }

    if (robots.length === 0) {
      setError(
        "Add and verify an EA license first."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (eaEnabled) {
        await fetchJSON(
          `${API}/ea/stop`,
          {
            method: "POST",
          }
        );

        setEaEnabled(false);

        setRobots((current) =>
          current.map((robot) => ({
            ...robot,
            status: "OFF",
          }))
        );
      } else {
        await fetchJSON(
          `${API}/ea/start`,
          {
            method: "POST",
          }
        );

        setEaEnabled(true);

        setRobots((current) =>
          current.map((robot) => ({
            ...robot,
            status: "ON",
          }))
        );
      }

      await loadEA();
    } catch (err) {
      setError(
        err?.message ||
          "EA control failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeEA = () => {
    if (eaEnabled) {
      setError(
        "Turn the EA OFF before removing it."
      );
      return;
    }

    setRobots([]);
    setMentorName("");
    setMentorAvatar("");
    setLicenseMessage("");

    try {
      localStorage.removeItem(
        MENTOR_STORAGE_KEY
      );

      localStorage.removeItem(
        MENTOR_AVATAR_STORAGE_KEY
      );

      localStorage.removeItem(
        LICENSE_STORAGE_KEY
      );
    } catch {
      // Ignore storage errors.
    }
  };

  const handleOrbPointerDown = (
    event
  ) => {
    event.preventDefault();

    const rect =
      event.currentTarget.getBoundingClientRect();

    dragRef.current = {
      offsetX:
        event.clientX - rect.left,

      offsetY:
        event.clientY - rect.top,

      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Ignore.
    }

    setDragging(true);
  };

  const handleOrbPointerMove = (
    event
  ) => {
    if (!dragging) {
      return;
    }

    const distanceX = Math.abs(
      event.clientX -
        dragRef.current.startX
    );

    const distanceY = Math.abs(
      event.clientY -
        dragRef.current.startY
    );

    if (
      distanceX > 6 ||
      distanceY > 6
    ) {
      dragRef.current.moved = true;
    }

    const size =
      window.innerWidth <= 380
        ? 56
        : 60;

    let x =
      event.clientX -
      dragRef.current.offsetX;

    let y =
      event.clientY -
      dragRef.current.offsetY;

    const maxX =
      window.innerWidth - size;

    const maxY =
      window.innerHeight - size;

    x = Math.max(
      8,
      Math.min(x, maxX - 8)
    );

    y = Math.max(
      75,
      Math.min(y, maxY - 85)
    );

    setOrbPosition({
      x,
      y,
    });
  };

  const handleOrbPointerUp = () => {
    const wasDragged =
      dragRef.current.moved;

    setDragging(false);

    if (!wasDragged) {
      setServerPanelOpen(true);
    }
  };

  const checkSignal = useCallback(
    async () => {
      if (!eaEnabled) {
        return;
      }

      try {
        const data =
          await fetchJSON(
            `${API}/ea/signal`
          );

        if (
          data?.signal === "BUY" ||
          data?.signal === "SELL"
        ) {
          setServerDetails(
            (current) => ({
              ...current,
              signals: true,
            })
          );

          showTradeSignal({
            ...data,
            direction:
              data.signal,
          });
        }

        setServerOnline(true);
      } catch {
        setServerDetails(
          (current) => ({
            ...current,
            signals: false,
          })
        );
      }
    },
    [eaEnabled, fetchJSON]
  );

  useEffect(() => {
    if (!eaEnabled) {
      return;
    }

    checkSignal();

    const interval = setInterval(
      checkSignal,
      1000
    );

    return () =>
      clearInterval(interval);
  }, [eaEnabled, checkSignal]);

  const showTradeSignal = (
    incomingSignal
  ) => {
    if (signalVisible) {
      return;
    }

    setSignal(incomingSignal);
    setSignalVisible(true);
    setTradeTriggered(false);
    setCountdown(3);

    clearInterval(
      countdownTimerRef.current
    );

    let count = 3;

    countdownTimerRef.current =
      setInterval(() => {
        count -= 1;
        setCountdown(count);

        if (count <= 0) {
          clearInterval(
            countdownTimerRef.current
          );

          triggerTrade(
            incomingSignal
          );
        }
      }, 1000);
  };

  const triggerTrade = async (
    incomingSignal
  ) => {
    try {
      const data = await fetchJSON(
        `${API}/trade`,
        {
          method: "POST",
          body: JSON.stringify({
            symbol:
              incomingSignal.symbol ||
              quoteSymbol ||
              DEFAULT_SYMBOL,

            side:
              incomingSignal.direction,

            signal:
              incomingSignal.direction,

            source:
              "Ghost Nexus EA",

            execution: "REAL",
          }),
        }
      );

      if (
        data?.success === true ||
        data?.executed === true
      ) {
        setTradeTriggered(true);
      } else {
        setError(
          data?.message ||
            "Trade was not executed."
        );
      }
    } catch (err) {
      setError(
        err?.message ||
          "Trade execution failed."
      );
    }
  };

  const closeSignal = () => {
    clearInterval(
      countdownTimerRef.current
    );

    setSignalVisible(false);
    setSignal(null);
    setCountdown(0);
  };

  const openQuotes = () => {
    setQuoteError("");
    setQuoteMessage("");
    setQuoteSearch("");
    setQuotesOpen(true);
  };

  const selectMarket = (market) => {
    setQuoteMarket(market);
    setQuoteSearch("");

    if (market === "FOREX") {
      setQuoteSymbol("EURUSD");
    }

    if (market === "METALS") {
      setQuoteSymbol("XAUUSD");
    }

    if (market === "CRYPTO") {
      setQuoteSymbol("BTCUSD");
    }
  };

  const saveQuoteConfiguration =
    async () => {
      setQuoteError("");
      setQuoteMessage("");

      const trades = Number(
        quoteTrades
      );

      const lot = Number(
        quoteLot
      );

      if (
        !Number.isInteger(trades) ||
        trades < 1 ||
        trades > 100
      ) {
        setQuoteError(
          "Number of trades must be between 1 and 100."
        );
        return;
      }

      if (
        !Number.isFinite(lot) ||
        lot <= 0
      ) {
        setQuoteError(
          "Enter a valid lot size."
        );
        return;
      }

      if (!quoteSymbol) {
        setQuoteError(
          "Choose a trading symbol."
        );
        return;
      }

      const configuration = {
        symbol: quoteSymbol,
        trades,
        lot_size: lot,
        direction: quoteDirection,
        updated_at:
          new Date().toISOString(),
      };

      setQuoteSaving(true);

      try {
        localStorage.setItem(
          EA_CONFIG_STORAGE_KEY,
          JSON.stringify(
            configuration
          )
        );

        try {
          await fetchJSON(
            `${API}/ea/config`,
            {
              method: "POST",
              body: JSON.stringify(
                configuration
              ),
            }
          );
        } catch (backendError) {
          const message =
            backendError?.message || "";

          if (
            !message.includes("404") &&
            !message.includes(
              "Not Found"
            )
          ) {
            console.warn(
              "EA configuration was saved locally but backend sync failed:",
              backendError
            );
          }
        }

        setQuoteMessage(
          `${quoteSymbol} configuration saved.`
        );
      } catch (err) {
        setQuoteError(
          err?.message ||
            "Could not save quote configuration."
        );
      } finally {
        setQuoteSaving(false);
      }
    };

  useEffect(() => {
    return () => {
      clearInterval(
        countdownTimerRef.current
      );
    };
  }, []);

  const navigate = (page) => {
    window.dispatchEvent(
      new CustomEvent(
        "ghost:navigate",
        {
          detail: {
            page,
          },
        }
      )
    );
  };

  return (
    <main className="ghost-home-page">
      <div className="home-background">
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />
        <div className="background-grid" />
      </div>

      {orbPosition.x !== null &&
        orbPosition.y !== null && (
          <button
            type="button"
            className={`server-orb ${
              dragging ? "dragging" : ""
            } ${
              serverOnline
                ? "server-online"
                : "server-offline"
            }`}
            style={{
              left: `${orbPosition.x}px`,
              top: `${orbPosition.y}px`,
            }}
            onPointerDown={
              handleOrbPointerDown
            }
            onPointerMove={
              handleOrbPointerMove
            }
            onPointerUp={
              handleOrbPointerUp
            }
            onPointerCancel={
              handleOrbPointerUp
            }
            aria-label="Ghost Nexus Server"
          >
            <span className="server-orb-pulse" />
            <Server size={19} />
            <span className="server-orb-status" />
          </button>
        )}

      <div className="ghost-home-content">
        <header className="ghost-home-header">
          <div className="ghost-home-brand">
            <span>GHOST</span>
            <strong>NEXUS</strong>
          </div>

          <div className="mentor-header">
            {mentorAvatar ? (
              <img
                src={mentorAvatar}
                alt={mentorName || "Mentor"}
                className="mentor-header-avatar"
              />
            ) : null}

            <div className="mentor-header-info">
              <span className="mentor-label">
                MENTOR
              </span>

              <strong>
                {mentorName ||
                  "Not connected"}
              </strong>
            </div>
          </div>
        </header>

        <section className="ghost-core-section">
          <div className="core-orbit orbit-one" />
          <div className="core-orbit orbit-two" />
          <div className="core-orbit orbit-three" />

          <div className="ghost-core">
            <div className="core-inner">
              {mentorAvatar ? (
                <img
                  src={mentorAvatar}
                  alt={
                    mentorName ||
                    "Mentor"
                  }
                  className="mentor-core-avatar"
                />
              ) : (
                <BrainCircuit
                  className="core-brain"
                  size={42}
                />
              )}

              <span>
                GHOST CORE
              </span>

              <strong>
                {mentorName ||
                  "GHOST"}
              </strong>
            </div>
          </div>
        </section>

        <div className="powered-by-card">
          <Zap size={16} />
          <span>
            Powered by Ghost Nexus
          </span>
        </div>

        <section className="ea-controls">
          <button
            type="button"
            className="ea-control-button"
            onClick={removeEA}
          >
            <Trash2 size={21} />
            <span>DELETE</span>
          </button>

          <button
            type="button"
            className={`ea-control-button ${
              eaEnabled
                ? "control-on"
                : ""
            }`}
            onClick={toggleEA}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw
                className="spin"
                size={21}
              />
            ) : (
              <Power size={21} />
            )}

            <span>
              {eaEnabled ? "ON" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            className="ea-control-button"
            onClick={openQuotes}
          >
            <Radio size={21} />
            <span>QUOTES</span>
          </button>
        </section>

        <section className="robot-list">
          <div className="robot-list-header">
            <div className="robot-list-title">
              ROBOTS
            </div>

            <span>
              {robots.length}{" "}
              {robots.length === 1
                ? "EA"
                : "EAs"}
            </span>
          </div>

          {robots.length > 0 ? (
            robots.map((robot) => (
              <div
                className="robot-card"
                key={robot.id}
              >
                <div className="robot-card-icon">
                  <BrainCircuit
                    size={21}
                  />
                </div>

                <div className="robot-card-info">
                  <strong>
                    {robot.name}
                  </strong>

                  <span>
                    {robot.symbol}
                  </span>
                </div>

                <div
                  className={`robot-status ${
                    robot.status === "ON"
                      ? "robot-on"
                      : "robot-off"
                  }`}
                >
                  <span />
                  {robot.status}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-robots">
              <BrainCircuit size={21} />
              <span>
                No EA activated
              </span>
            </div>
          )}

          <button
            type="button"
            className="add-ea-button"
            onClick={() => {
              setShowAddEA(true);
              setLicenseError("");
              setLicenseMessage("");
            }}
          >
            <CirclePlus size={21} />
            <span>ADD EA</span>
          </button>
        </section>

        {error && (
          <div className="home-error">
            <AlertTriangle size={16} />

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              aria-label="Close error"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      
      {serverPanelOpen && (
        <div className="server-overlay">
          <div className="server-panel">
            <button
              type="button"
              className="panel-close"
              onClick={() =>
                setServerPanelOpen(false)
              }
              aria-label="Close server panel"
            >
              <X size={20} />
            </button>

            <div className="server-panel-icon">
              <Server size={27} />
            </div>

            <div className="server-panel-title">
              GHOST SERVER
            </div>

            <div
              className={`server-panel-status ${
                serverOnline
                  ? "online"
                  : "offline"
              }`}
            >
              <span />
              {serverOnline
                ? "SERVER ONLINE"
                : "SERVER OFFLINE"}
            </div>

            <div className="connection-list">
              <ConnectionItem
                icon={<Zap size={17} />}
                label="EA SCRIPT"
                online={
                  serverDetails.ea
                }
              />

              <ConnectionItem
                icon={
                  <Link2 size={17} />
                }
                label="METATRADER"
                online={
                  serverDetails.metatrader
                }
              />

              <ConnectionItem
                icon={
                  <Database size={17} />
                }
                label="BACKEND"
                online={
                  serverDetails.backend
                }
              />

              <ConnectionItem
                icon={
                  <Link2 size={17} />
                }
                label="METAAPI"
                online={
                  serverDetails.metaapi
                }
              />

              <ConnectionItem
                icon={
                  <Radio size={17} />
                }
                label="SIGNALS"
                online={
                  serverDetails.signals
                }
              />
            </div>

            <div className="live-signal-card">
              <div className="live-signal-heading">
                LIVE SIGNAL
              </div>

              {signal ? (
                <>
                  <strong>
                    {signal.symbol ||
                      quoteSymbol}
                  </strong>

                  <span
                    className={
                      signal.direction ===
                      "BUY"
                        ? "live-buy"
                        : "live-sell"
                    }
                  >
                    {signal.direction}
                  </span>

                  {signal.confidence !==
                    undefined && (
                    <small>
                      Confidence:{" "}
                      {
                        signal.confidence
                      }
                      %
                    </small>
                  )}
                </>
              ) : (
                <span className="signal-waiting">
                  Waiting for live signal
                </span>
              )}
            </div>

            <div className="server-panel-footer">
              <button
                type="button"
                onClick={loadEA}
              >
                <RefreshCw size={16} />
                REFRESH
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEA && (
        <div className="license-overlay">
          <div className="license-modal">
            <button
              type="button"
              className="license-close"
              onClick={() =>
                setShowAddEA(false)
              }
              aria-label="Close license"
            >
              <X size={20} />
            </button>

            <div className="license-icon">
              <BrainCircuit size={31} />
            </div>

            <h2>ADD EA</h2>

            <p>
              Enter your Ghost Nexus
              EA license key to
              activate your robot.
            </p>

            <input
              type="text"
              value={licenseKey}
              onChange={(event) =>
                setLicenseKey(
                  event.target.value
                )
              }
              placeholder="GNX-XXXX-XXXX-XXXX"
              autoComplete="off"
              spellCheck="false"
            />

            {licenseError && (
              <div className="license-error">
                <AlertTriangle size={15} />
                <span>
                  {licenseError}
                </span>
              </div>
            )}

            {licenseMessage && (
              <div className="license-success">
                <CheckCircle2 size={15} />
                <span>
                  {licenseMessage}
                </span>
              </div>
            )}

            <button
              type="button"
              className="license-verify"
              onClick={verifyLicense}
              disabled={
                licenseLoading
              }
            >
              {licenseLoading ? (
                <>
                  <RefreshCw
                    className="spin"
                    size={18}
                  />
                  VERIFYING
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                  />
                  ACTIVATE EA
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {quotesOpen && (
        <div className="quotes-overlay">
          <div className="quotes-modal">
            <button
              type="button"
              className="panel-close"
              onClick={() =>
                setQuotesOpen(false)
              }
              aria-label="Close quotes"
            >
              <X size={20} />
            </button>

            <div className="quotes-heading">
              <div className="quotes-icon">
                <Radio size={22} />
              </div>

              <div>
                <span>TRADING</span>
                <h2>QUOTES</h2>
              </div>
            </div>

            <div className="quote-section">
              <label>MARKET</label>

              <div className="market-tabs">
                {[
                  "FOREX",
                  "METALS",
                  "CRYPTO",
                ].map((market) => (
                  <button
                    type="button"
                    key={market}
                    className={
                      quoteMarket ===
                      market
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      selectMarket(
                        market
                      )
                    }
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            <div className="quote-section">
              <label>SYMBOL</label>

              <div className="symbol-search">
                <input
                  value={quoteSearch}
                  onChange={(event) =>
                    setQuoteSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search symbol..."
                />

                <ChevronDown
                  size={17}
                />
              </div>

              <div className="selected-symbol">
                {quoteSymbol}
              </div>

              <div className="symbol-grid">
                {filteredQuoteSymbols
                  .slice(0, 40)
                  .map((symbol) => (
                    <button
                      type="button"
                      key={symbol}
                      className={
                        quoteSymbol ===
                        symbol
                          ? "symbol-selected"
                          : ""
                      }
                      onClick={() =>
                        setQuoteSymbol(
                          symbol
                        )
                      }
                    >
                      {symbol}
                    </button>
                  ))}
              </div>
            </div>

            <div className="quote-settings-grid">
              <div className="quote-section">
                <label>
                  NUMBER OF TRADES
                </label>

                <input
                  className="quote-input"
                  type="number"
                  min="1"
                  max="100"
                  value={quoteTrades}
                  onChange={(event) =>
                    setQuoteTrades(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="quote-section">
                <label>
                  LOT SIZE
                </label>

                <input
                  className="quote-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quoteLot}
                  onChange={(event) =>
                    setQuoteLot(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="quote-section">
              <label>DIRECTION</label>

              <div className="direction-tabs">
                {[
                  "BUY",
                  "SELL",
                  "BOTH",
                ].map((direction) => (
                  <button
                    type="button"
                    key={direction}
                    className={
                      quoteDirection ===
                      direction
                        ? `direction-selected ${direction.toLowerCase()}`
                        : ""
                    }
                    onClick={() =>
                      setQuoteDirection(
                        direction
                      )
                    }
                  >
                    {direction}
                  </button>
                ))}
              </div>
            </div>

            {quoteError && (
              <div className="quote-error">
                <AlertTriangle size={15} />
                <span>
                  {quoteError}
                </span>
              </div>
            )}

            {quoteMessage && (
              <div className="quote-success">
                <CheckCircle2 size={15} />
                <span>
                  {quoteMessage}
                </span>
              </div>
            )}

            <button
              type="button"
              className="quote-save"
              onClick={
                saveQuoteConfiguration
              }
              disabled={quoteSaving}
            >
              {quoteSaving ? (
                <>
                  <RefreshCw
                    className="spin"
                    size={18}
                  />
                  SAVING
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  SAVE CONFIGURATION
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {signalVisible && signal && (
        <div className="trade-signal-screen">
          <div className="trade-signal-glow" />

          <button
            type="button"
            className="trade-close"
            onClick={closeSignal}
            aria-label="Close signal"
          >
            <X size={24} />
          </button>

          <div className="trade-signal-content">
            <div className="trade-trigger-label">
              EA SIGNAL
            </div>

            <div className="trade-symbol">
              {signal.symbol ||
                "XAUUSD"}
            </div>

            <div
              className={`trade-direction ${
                signal.direction ===
                "BUY"
                  ? "trade-buy"
                  : "trade-sell"
              }`}
            >
              {signal.direction}
            </div>

            {!tradeTriggered ? (
              <>
                <div className="trade-countdown">
                  {countdown}
                </div>

                <div className="trade-countdown-text">
                  TRADE INCOMING
                </div>
              </>
            ) : (
              <div className="trade-triggered">
                <CheckCircle2 size={48} />

                <span>
                  GHOST TRIGGERED
                </span>

                <small>
                  {signal.direction}{" "}
                  TRADE SENT TO MT5
                </small>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;