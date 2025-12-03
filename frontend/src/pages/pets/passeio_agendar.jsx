import { ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/passeio_agendar.css";

export default function PasseiosAgendar() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const servico = state?.servico;
  const pet = state?.pet;

  const [data, setData] = useState("");
  const [msg, setMsg] = useState(""); // sucesso ou erro
  const [loading, setLoading] = useState(false);

  async function enviar() {
    if (!data) {
      setMsg("❌ Selecione uma data e hora");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const token = getToken();

      const res = await fetch(`${BASE_URL}/passeios/agendamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pet_id: pet.id,
          servico: servico.nome,
          data: data
        })
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.mensagem || "Erro ao agendar");

      setMsg("Passeio agendado com sucesso! 🎉");

      // redireciona após 1.5s
      setTimeout(() => navigate("/passeios/historico"), 1500);

    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pa-page">

      <button className="pa-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="pa-title">Agendar Passeio</h1>

      {/* CARD DE INFO */}
      <div className="pa-info-box">
        <p>Pet:</p>
        <h3>{pet?.nome}</h3>

        <p className="mt">Passeio:</p>
        <h3>{servico?.nome}</h3>
      </div>

      <p className="pa-label">Escolha a data e hora:</p>

      {/* INPUT */}
      <div className="pa-input">
        <Calendar size={20} className="pa-cal-icon" />
        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      {/* BOTÃO */}
      <button className="pa-btn" onClick={enviar} disabled={loading}>
        {loading ? "Agendando..." : "Confirmar agendamento"}
      </button>

      {/* MENSAGEM */}
      {msg && (
        <div className={msg.includes("❌") ? "msg-error" : "msg-success"}>
          {msg}
        </div>
      )}

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}
