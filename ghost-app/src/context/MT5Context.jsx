import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { DashboardAPI } from "../services/api";

const MT5Context = createContext(null);

export function MT5Provider({ children }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connect = async (
    login,
    password,
    server,
    label = "Main"
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await DashboardAPI.connectMT5({
        login,
        password,
        server,
        label,
      });

      const isConnected =
        result?.connected === true ||
        result?.success === true;

      setConnected(isConnected);

      if (isConnected) {
        await loadAccount();
      }

      return result;
    } catch (err) {
      console.error("MT5 connection error:", err);

      setConnected(false);
      setError(
        err?.message || "Unable to connect to MetaTrader."
      );

      return {
        connected: false,
        success: false,
        error: err?.message || "MT5 connection failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAccount(null);
  };

  const loadAccount = async () => {
    try {
      const data = await DashboardAPI.account();

      setAccount(data);

      if (data) {
        setConnected(
          data.connected !== false
        );
      }

      return data;
    } catch (err) {
      console.error("Failed to load MT5 account:", err);

      return null;
    }
  };

  return (
    <MT5Context.Provider
      value={{
        connected,
        account,
        loading,
        error,
        connect,
        disconnect,
        loadAccount,
      }}
    >
      {children}
    </MT5Context.Provider>
  );
}

export function useMT5() {
  return useContext(MT5Context);
}

export default MT5Provider;