import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ServerContext = createContext(null);

const API = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.106:8000"
).replace(/\/$/, "");

export function ServerProvider({ children }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState("");

  const checkServer = async () => {
    setChecking(true);

    try {
      const response = await fetch(`${API}/health`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      setServerOnline(true);
      setError("");
      setLastChecked(new Date());
    } catch (err) {
      console.error("Ghost Nexus backend offline:", err);

      setServerOnline(false);
      setError(
        err?.message || "Backend unavailable"
      );
      setLastChecked(new Date());
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkServer();

    const interval = setInterval(
      checkServer,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ServerContext.Provider
      value={{
        serverOnline,
        checking,
        lastChecked,
        error,
        apiUrl: API,
        checkServer,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

export function useServer() {
  return useContext(ServerContext);
}

export default ServerProvider;