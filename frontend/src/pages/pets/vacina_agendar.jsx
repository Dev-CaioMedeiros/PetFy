import { ArrowLeft, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/vacinas_agendar.css";

export default function VacinasAgendar() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { vacina, pet } = state || {};

  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirmar() {
    if (!data) {
      setMsg("Selecione uma data e hora!");
      setIsError(true);
      return;
    }

    try {
      setMsg("");
      setIsError(false);
      setLoading(true);

      const token = getToken();

      const res = await fetch(`${BASE_URL}/vacinas/agendamentos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_id: pet.id,
          vacina: vacina.nome,
          data,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem);

      setMsg("Vacina agendada com sucesso! 🎉");
      setIsError(false);

      setTimeout(() => navigate("/vacinas/historico"), 1500);
    } catch (err) {
      setMsg("❌ " + err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vaga-container">
      <button className="vaga-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="vaga-title">Agendar Vacina</h1>

      <div className="vaga-card">
        <p>Pet:</p>
        <h3>{pet?.nome}</h3>

        <p>Vacina:</p>
        <h3>{vacina?.nome}</h3>
      </div>

      <label className="vaga-label">Escolha a data e hora:</label>

      <div className={`vaga-input-box ${!data ? "vaga-empty" : ""}`}>
        <Calendar size={22} className="vaga-icon" />

        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="vaga-input"
        />
      </div>

      <button
        className={`vaga-btn ${loading ? "disabled" : ""}`}
        onClick={confirmar}
        disabled={loading}
      >
        {loading ? "Agendando..." : "Confirmar agendamento"}
      </button>

      {msg && (
        <div className={isError ? "msg-error" : "msg-success"}>
          {msg}
        </div>
      )}

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}
