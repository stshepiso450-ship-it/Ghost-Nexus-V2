import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SignalContext = createContext(null);

const API = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.106:8000"
).replace(/\/$/, "");

export function SignalProvider({ children }) {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const loadSignals = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/signals`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Signal service returned ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSignals(data);
      } else if (Array.isArray(data?.signals)) {
        setSignals(data.signals);
      } else {
        setSignals([]);
      }

      setConnected(true);
      setError("");
    } catch (err) {
      console.error(
        "Ghost Nexus signal service offline:",
        err
      );

      setSignals([]);
      setConnected(false);
      setError(
        err?.message || "Signal service unavailable"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignals();

    const timer = setInterval(
      loadSignals,
      5000
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <SignalContext.Provider
      value={{
        signals,
        loading,
        connected,
        error,
        refreshSignals: loadSignals,
      }}
    >
      {children}
    </SignalContext.Provider>
  );
}

export function useSignal() {
  return useContext(SignalContext);
}

export default SignalProvider;