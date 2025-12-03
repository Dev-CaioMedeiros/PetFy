// src/services/auth.js

const TOKEN_KEY = "token";
const LAST_ACTIVITY_KEY = "lastActivity";

// tempo padrão: 10 min
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;

// ================================
// TOKEN
// ================================

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  touchLastActivity();
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  // se existir token, atualiza atividade
  if (token) touchLastActivity();

  return token;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

// ================================
// ACTIVITY CONTROL
// ================================

export const touchLastActivity = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
};

export const getLastActivity = () => {
  const v = localStorage.getItem(LAST_ACTIVITY_KEY);
  return v ? Number(v) : null;
};

// ================================
// EXPIRATION CHECK
// ================================

export const isExpired = (timeoutMs) => {
  const timeout = typeof timeoutMs === "number" ? timeoutMs : DEFAULT_TIMEOUT_MS;
  const last = getLastActivity();

  // se nunca registrou atividade, NÃO expira
  // só expira se tiver timestamp e tiver passado tempo
  if (!last) return false;

  return Date.now() - last > timeout;
};

// ================================
// LOGOUT
// ================================

export const doLogout = (onAfter) => {
  clearToken();
  if (typeof onAfter === "function") onAfter();
};
