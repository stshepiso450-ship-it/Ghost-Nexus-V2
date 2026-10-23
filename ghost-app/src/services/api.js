const API = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.106:8000"
).replace(/\/$/, "");

async function request(endpoint, options = {}) {
  const url = `${API}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.error ||
      data?.message ||
      `API Error: ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export const DashboardAPI = {
  // --------------------------------------------------
  // GENERAL
  // --------------------------------------------------

  dashboard: () =>
    request("/dashboard"),

  status: () =>
    request("/status"),

  health: () =>
    request("/health"),

  ready: () =>
    request("/ready"),

  // --------------------------------------------------
  // BOT
  // --------------------------------------------------

  startBot: () =>
    request("/bot/start", {
      method: "POST",
    }),

  stopBot: () =>
    request("/bot/stop", {
      method: "POST",
    }),

  // --------------------------------------------------
  // MT5
  // --------------------------------------------------

  connectMT5: (body) =>
    request("/mt5/connect", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  account: () =>
    request("/mt5/account"),

  quotes: () =>
    request("/mt5/quotes"),

  // --------------------------------------------------
  // SCANNER
  // --------------------------------------------------

  scanner: () =>
    request("/scanner"),

  aiScan: (body) =>
    request("/ai/scan", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // --------------------------------------------------
  // LICENSE
  // --------------------------------------------------

  activateLicense: (
    license,
    account = "",
    device = ""
  ) =>
    request("/license/check", {
      method: "POST",
      body: JSON.stringify({
        license,
        account,
        device,
      }),
    }),

  // --------------------------------------------------
  // EA
  // --------------------------------------------------

  eaStatus: () =>
    request("/ea/status"),

  eaStart: () =>
    request("/ea/start", {
      method: "POST",
    }),

  eaStop: () =>
    request("/ea/stop", {
      method: "POST",
    }),

  eaSignal: () =>
    request("/ea/signal"),

  validateEALicense: (licenseKey) =>
    request("/ea/license/validate", {
      method: "POST",
      body: JSON.stringify({
        license_key: licenseKey,
      }),
    }),

  // --------------------------------------------------
  // TRADE
  // --------------------------------------------------

  trade: (body) =>
    request("/trade", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // --------------------------------------------------
  // METAAPI
  // --------------------------------------------------

  metaAccounts: () =>
    request("/metaapi/accounts"),

  // --------------------------------------------------
  // QUOTES
  // --------------------------------------------------

  liveQuotes: () =>
    request("/quotes"),
};

export { API };