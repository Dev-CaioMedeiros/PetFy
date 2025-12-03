import { useEffect } from "react";
import { clearToken } from "../services/auth";

export default function ActivityTimeout() {
  const TIMEOUT = 10 * 60 * 1000; // 10 min

  useEffect(() => {
    let timer;

    function reset() {
      clearTimeout(timer);
      localStorage.setItem("lastActivity", Date.now());
      timer = setTimeout(() => {
        clearToken();
        window.location.href = "/login";
      }, TIMEOUT);
    }

    // capturar eventos
    window.onload = reset;
    document.onmousemove = reset;
    document.onkeypress = reset;
    document.onscroll = reset;

    reset(); // inicia timer

    return () => clearTimeout(timer);

  }, []);

  return null;
}
