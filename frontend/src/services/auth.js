// src/services/auth.js
const TOKEN_KEY = "token";
const LAST_ACTIVITY_KEY = "lastActivity";
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  touchLastActivity();
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

export const touchLastActivity = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
};

export const getLastActivity = () => {
  const v = localStorage.getItem(LAST_ACTIVITY_KEY);
  return v ? Number(v) : null;
};

export const isExpired = (customTimeoutMs) => {
  const timeout = typeof customTimeoutMs === "number" ? customTimeoutMs : TIMEOUT_MS;
  const last = getLastActivity();
  if (!last) return true;
  return Date.now() - last > timeout;
};

// Logout helper for UI (removes token and optionally executes callback)
export const doLogout = (onAfter) => {
  clearToken();
  if (typeof onAfter === "function") onAfter();
};
