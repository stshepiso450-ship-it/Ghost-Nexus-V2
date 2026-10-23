import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const QuotesContext = createContext(null);

const API = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.106:8000"
).replace(/\/$/, "");

const DEFAULT_CONFIG = {
  symbol: "XAUUSD",
  trades: 1,
  lotSize: 0.01,
  direction: "BOTH",
};

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
  "EURCAD",
  "EURAUD",
  "EURNZD",
  "EURSGD",

  "GBPJPY",
  "GBPCHF",
  "GBPCAD",
  "GBPAUD",
  "GBPNZD",
  "GBPSGD",

  "AUDJPY",
  "AUDCAD",
  "AUDCHF",
  "AUDNZD",

  "NZDJPY",
  "NZDCHF",

  "CADJPY",
  "CADCHF",

  "CHFJPY",

  "USDSGD",
  "USDHKD",
  "USDZAR",
  "USDMXN",
  "USDTRY",
];

const METAL_SYMBOLS = [
  "XAUUSD",
  "XAGUSD",
  "XPTUSD",
  "XPDUSD",
];

const CRYPTO_SYMBOLS = [
  "BTCUSD",
  "ETHUSD",
  "BNBUSD",
  "XRPUSD",
  "SOLUSD",
  "ADAUSD",
  "DOGEUSD",
  "AVAXUSD",
  "DOTUSD",
  "LINKUSD",
  "LTCUSD",
  "BCHUSD",
  "TRXUSD",
  "MATICUSD",
];

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ghost_nexus_quote_config"
      );

      if (!saved) {
        return DEFAULT_CONFIG;
      }

      return {
        ...DEFAULT_CONFIG,
        ...JSON.parse(saved),
      };
    } catch (err) {
      console.error(
        "Failed to load quote configuration:",
        err
      );

      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "ghost_nexus_quote_config",
        JSON.stringify(config)
      );
    } catch (err) {
      console.error(
        "Failed to save quote configuration:",
        err
      );
    }
  }, [config]);

  const loadQuotes = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/quotes`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Quote service returned ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setQuotes(data);
      } else if (Array.isArray(data?.quotes)) {
        setQuotes(data.quotes);
      } else {
        setQuotes([]);
      }

      setConnected(true);
      setError("");
    } catch (err) {
      console.error(
        "Ghost Nexus quotes unavailable:",
        err
      );

      setQuotes([]);
      setConnected(false);
      setError(
        err?.message || "Quotes unavailable"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();

    const timer = setInterval(
      loadQuotes,
      2000
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  const updateConfig = (updates) => {
    setConfig((previous) => ({
      ...previous,
      ...updates,
    }));
  };

  const saveConfig = (updates = {}) => {
    const nextConfig = {
      ...config,
      ...updates,
    };

    setConfig(nextConfig);

    try {
      localStorage.setItem(
        "ghost_nexus_quote_config",
        JSON.stringify(nextConfig)
      );
    } catch (err) {
      console.error(
        "Failed to save quote configuration:",
        err
      );
    }

    return nextConfig;
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);

    try {
      localStorage.setItem(
        "ghost_nexus_quote_config",
        JSON.stringify(DEFAULT_CONFIG)
      );
    } catch (err) {
      console.error(
        "Failed to reset quote configuration:",
        err
      );
    }
  };

  const allSymbols = useMemo(
    () => ({
      forex: FOREX_SYMBOLS,
      metals: METAL_SYMBOLS,
      crypto: CRYPTO_SYMBOLS,
    }),
    []
  );

  const symbols = useMemo(
    () => [
      ...FOREX_SYMBOLS,
      ...METAL_SYMBOLS,
      ...CRYPTO_SYMBOLS,
    ],
    []
  );

  const selectedQuote = useMemo(() => {
    return quotes.find(
      (quote) =>
        quote?.symbol === config.symbol
    ) || null;
  }, [quotes, config.symbol]);

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        loading,
        connected,
        error,

        config,
        quoteConfig: config,

        symbols,
        allSymbols,
        selectedQuote,

        updateConfig,
        saveConfig,
        resetConfig,

        refreshQuotes: loadQuotes,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotes() {
  return useContext(QuotesContext);
}

export default QuotesProvider;