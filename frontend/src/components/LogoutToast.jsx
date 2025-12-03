import React from "react";
import "../styles/logouttoast.css";

export default function LogoutToast({ open }) {
  if (!open) return null;

  return (
    <div className="logout-toast">
      Sessão encerrada
    </div>
  );
}
