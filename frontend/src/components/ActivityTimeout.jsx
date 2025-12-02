// src/components/ActivityTimeout.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, touchLastActivity, isExpired, doLogout, getLastActivity } from "../services/auth";

const CHECK_INTERVAL = 1000; // checar a cada 1s
const WARNING_SECONDS = 30; // mostrar aviso quando faltar 30s

export default function ActivityTimeout() {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // atualiza lastActivity quando houver interações do usuário
    const events = ["click", "mousemove", "keydown", "touchstart"];
    const handler = () => {
      if (getToken()) touchLastActivity();
    };
    events.forEach((ev) => window.addEventListener(ev, handler));

    // checador
    intervalRef.current = setInterval(() => {
      if (!getToken()) {
        setRemaining(null);
        return;
      }
      if (isExpired()) {
        doLogout(() => navigate("/login"));
        return;
      }
      const last = getLastActivity();
      const diff = Date.now() - last;
      const rem = Math.max(0, Math.ceil((5 * 60 * 1000 - diff) / 1000));
      setRemaining(rem);
    }, CHECK_INTERVAL);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handler));
      clearInterval(intervalRef.current);
    };
  }, [navigate]);

  if (!remaining || remaining > WARNING_SECONDS) return null;

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <h4 style={{margin:0}}>Você será desconectado em {remaining}s</h4>
        <p style={{margin:'6px 0 0', fontSize:13}}>Sem atividade — por segurança</p>
        <div style={{marginTop:10, display:'flex', gap:8}}>
          <button onClick={() => touchLastActivity()} style={btnStyle}>Continuar</button>
          <button onClick={() => { doLogout(() => navigate("/login")); }} style={cancelBtnStyle}>Sair agora</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", left:0, right:0, bottom:20, display:"flex", justifyContent:"center", zIndex:9999
};
const boxStyle = {
  background:"#fff", padding:"12px 16px", borderRadius:12, boxShadow:"0 10px 30px rgba(0,0,0,0.12)",
  display:"flex", flexDirection:"column", alignItems:"center", gap:6, width:320, maxWidth:"90%"
};
const btnStyle = {
  background:"linear-gradient(180deg,#fcd34d,#fbbf24)", border:"none", padding:"8px 12px", borderRadius:10, cursor:"pointer", color:"#fff", fontWeight:700
};
const cancelBtnStyle = {
  background:"#eee", border:"none", padding:"8px 12px", borderRadius:10, cursor:"pointer"
};
