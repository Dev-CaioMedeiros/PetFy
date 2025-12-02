// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isExpired, doLogout } from "../services/auth";

export default function PrivateRoute({ children }) {
  const token = getToken();

  // se não tem token -> redireciona
  if (!token) return <Navigate to="/login" replace />;

  // se expirou -> limpa e redireciona
  if (isExpired()) {
    doLogout();
    return <Navigate to="/login" replace />;
  }

  return children;
}
