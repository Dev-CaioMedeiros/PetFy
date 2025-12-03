import { useEffect } from "react";
import { clearToken } from "../services/auth";

export default function ActivityTimeout() {
  const TIMEOUT = 10 * 60 * 1000; // 10 min

  useEffect(() => {
    let timer;

    function startTimer() {
      clearTimeout(timer);

      timer = setTimeout(() => {
        // dispara evento global de expiração
        window.dispatchEvent(new Event("session-expired"));

        clearToken();
        window.location.href = "/login";
      }, TIMEOUT);
    }

    function resetActivity() {
      localStorage.setItem("lastActivity", Date.now());
      startTimer();
    }

    // registrar eventos
    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keypress", resetActivity);
    window.addEventListener("scroll", resetActivity);

    // iniciar timer sem salvar timestamp
    startTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keypress", resetActivity);
      window.removeEventListener("scroll", resetActivity);
    };
  }, []);

  return null;
}
