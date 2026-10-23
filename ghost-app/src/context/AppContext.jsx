import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext(null);

const DEFAULT_SETTINGS = {
  // Appearance
  theme: "Ghost Red",
  themeColor: "#ff004f",
  secondaryColor: "#ff4b91",

  // Background
  background: "/assets/background/default.mp4",

  // Images
  logo: "/assets/logo/ghost-logo.png",
  interfaceImage: "",
  mentorAvatar: "",

  // Fonts
  font: "Orbitron",
  fontSize: 16,

  // Shapes
  shape: "Rounded",

  // AI
  aiMode: "Sniper",
  assistant: "Ghost AI",

  // Trading
  risk: "Medium",

  // Interface
  showGhostCore: true,
  showScanner: true,
  showRobots: true,
  showServerOrb: true,

  // Notifications
  notifications: true,

  // License
  licenseStatus: "NOT ACTIVATED",
  licenseKey: "",
  mentorName: "",

  // Quotes / Trading configuration
  quoteConfig: {
    symbol: "XAUUSD",
    trades: 1,
    lotSize: 0.01,
    direction: "BOTH",
  },
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ghostNexusSettings");

      if (!saved) {
        return DEFAULT_SETTINGS;
      }

      const parsed = JSON.parse(saved);

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,

        quoteConfig: {
          ...DEFAULT_SETTINGS.quoteConfig,
          ...(parsed.quoteConfig || {}),
        },
      };
    } catch (error) {
      console.error("Failed to load Ghost Nexus settings:", error);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "ghostNexusSettings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Failed to save Ghost Nexus settings:", error);
    }
  }, [settings]);

  const updateSettings = (updates) => {
    setSettings((previous) => ({
      ...previous,
      ...updates,
    }));
  };

  const updateQuoteConfig = (updates) => {
    setSettings((previous) => ({
      ...previous,
      quoteConfig: {
        ...previous.quoteConfig,
        ...updates,
      },
    }));
  };

  const setMentor = ({
    name = "",
    avatar = "",
    licenseKey = "",
  } = {}) => {
    setSettings((previous) => ({
      ...previous,
      mentorName: name,
      mentorAvatar: avatar,
      licenseKey,
      licenseStatus: licenseKey
        ? "ACTIVATED"
        : previous.licenseStatus,
    }));
  };

  const clearMentor = () => {
    setSettings((previous) => ({
      ...previous,
      mentorName: "",
      mentorAvatar: "",
      licenseKey: "",
      licenseStatus: "NOT ACTIVATED",
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("ghostNexusSettings");
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        updateQuoteConfig,
        setMentor,
        clearMentor,
        resetSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}