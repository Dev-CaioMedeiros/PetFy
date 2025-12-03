// src/components/PrivateRoute.jsx
import { getToken, isExpired, doLogout } from "../services/auth";

export default function PrivateRoute({ children }) {
  const token = getToken();

  if (!token) {
    window.dispatchEvent(new Event("session-expired"));
    return null;
  }

  if (isExpired()) {
    doLogout();
    window.dispatchEvent(new Event("session-expired"));
    return null;
  }

  return children;
}
