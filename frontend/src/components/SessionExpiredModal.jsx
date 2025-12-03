// src/components/SessionExpiredModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/session-expired.css";

export default function SessionExpiredModal({ open }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="session-overlay">
      <div className="session-modal">

        <h2>Sessão expirada</h2>

        <p>Você ficou muito tempo inativo. Faça login novamente.</p>

        <button
          className="session-btn"
          onClick={() => navigate("/login")}
        >
          Fazer login
        </button>

      </div>
    </div>
  );
}
