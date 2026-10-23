// ============================================================
// GHOST NEXUS - API CONFIGURATION
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://192.168.68.156:8000";


// ============================================================
// REQUEST HELPER
// ============================================================

async function request(
  endpoint,
  options = {}
) {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {

    const message =
      data?.detail?.message ||
      data?.detail ||
      data?.message ||
      `API request failed (${response.status})`;

    throw new Error(
      typeof message === "string"
        ? message
        : JSON.stringify(message)
    );
  }

  return data;
}


// ============================================================
// MT5
// ============================================================

export async function connectMT5(
  login,
  password,
  server,
  name = "Ghost Nexus"
) {

  return request(
    "/mt5/connect",
    {
      method: "POST",

      body: JSON.stringify({
        login: Number(login),
        password,
        server,
        name
      })
    }
  );
}


export async function disconnectMT5() {

  return request(
    "/mt5/disconnect",
    {
      method: "POST"
    }
  );
}


export async function getMT5Status() {

  return request(
    "/mt5/status"
  );
}


export async function getMT5Account() {

  return request(
    "/mt5/account"
  );
}


export async function getMT5Positions() {

  return request(
    "/mt5/positions"
  );
}


export async function getMT5Accounts() {

  return request(
    "/mt5/accounts"
  );
}


export async function getMT5Health() {

  return request(
    "/mt5/health"
  );
}


// ============================================================
// METAAPI
// ============================================================

export async function getMetaAPIStatus() {

  return request(
    "/metaapi/status"
  );
}


export async function getMetaAPIAccount() {

  return request(
    "/metaapi/account"
  );
}


export async function getMetaAPIPositions() {

  return request(
    "/metaapi/positions"
  );
}


export async function getMetaAPIAccounts() {

  return request(
    "/metaapi/accounts"
  );
}


export async function disconnectMetaAPI() {

  return request(
    "/metaapi/disconnect",
    {
      method: "POST"
    }
  );
}


// ============================================================
// SYSTEM
// ============================================================

export async function getHealth() {

  return request(
    "/health"
  );
}


export async function getStatus() {

  return request(
    "/status"
  );
}


// ============================================================
// DEFAULT API OBJECT
// ============================================================

const api = {

  connectMT5,

  disconnectMT5,

  getMT5Status,

  getMT5Account,

  getMT5Positions,

  getMT5Accounts,

  getMT5Health,

  getMetaAPIStatus,

  getMetaAPIAccount,

  getMetaAPIPositions,

  getMetaAPIAccounts,

  disconnectMetaAPI,

  getHealth,

  getStatus
};


export default api;