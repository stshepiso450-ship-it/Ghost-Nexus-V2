import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DashboardAPI } from "../services/api";
import socket from "../services/websocket";

const DashboardContext = createContext(null);

const DEFAULT_DASHBOARD = {
  backend: false,
  metaapi: false,
  scanner: false,
  bot: false,
  license: false,

  balance: 0,
  equity: 0,
  profit: 0,
  margin: 0,
  free_margin: 0,

  positions: 0,
  buy: 0,
  sell: 0,

  symbol: "--",

  strategy: "Ghost Sniper",

  ping: 0,

  server: "Offline",

  // EA
  ea: false,
  ea_connected: false,
  ea_running: false,

  // MT5
  mt5: false,
  mt5_connected: false,

  // Signals
  signals: false,
  signals_connected: false,

  // Mentor / license
  mentor_name: "",
  mentor_avatar: "",
  license_key: "",
};

export const useDashboard = () =>
  useContext(DashboardContext);

export default function DashboardProvider({
  children,
}) {
  const [dashboard, setDashboard] = useState(
    DEFAULT_DASHBOARD
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await DashboardAPI.dashboard();

      if (data && typeof data === "object") {
        setDashboard((previous) => ({
          ...previous,
          ...data,
        }));
      }

      setError("");

      return data;
    } catch (err) {
      console.error(
        "Ghost Nexus dashboard unavailable:",
        err
      );

      setError(
        err?.message ||
          "Dashboard service unavailable"
      );

      setDashboard((previous) => ({
        ...previous,
        backend: false,
        server: "Offline",
      }));

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      if (!mounted) return;
      await refresh();
    };

    initialLoad();

    const interval = setInterval(() => {
      if (mounted) {
        refresh();
      }
    }, 5000);

    let unsubscribe;

    try {
      if (
        socket &&
        typeof socket.subscribe === "function"
      ) {
        unsubscribe = socket.subscribe(
          (data) => {
            if (!mounted) return;

            if (
              data &&
              typeof data === "object"
            ) {
              setDashboard((previous) => ({
                ...previous,
                ...data,
              }));
            }
          }
        );
      }
    } catch (err) {
      console.error(
        "Dashboard WebSocket error:",
        err
      );
    }

    return () => {
      mounted = false;

      clearInterval(interval);

      if (
        typeof unsubscribe === "function"
      ) {
        unsubscribe();
      }
    };
  }, [refresh]);

  const updateDashboard = useCallback(
    (updates) => {
      setDashboard((previous) => ({
        ...previous,
        ...updates,
      }));
    },
    []
  );

  const value = {
    dashboard,

    loading,

    error,

    refresh,

    updateDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}