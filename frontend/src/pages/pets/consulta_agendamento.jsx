import { ArrowLeft, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/agendar.css";

export default function ConsultaAgendar() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { servico, pet } = state || {};

  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [tipoMsg, setTipoMsg] = useState(""); // "sucesso" ou "erro"
  const [loading, setLoading] = useState(false);
  const [erroData, setErroData] = useState(false);

  async function confirmarAgendamento() {

    if (!pet?.id) {
      alert("Pet inválido");
      return;
    }

    if (!data) {
      setErroData(true);
      setMsg("Selecione uma data e hora!");
      setTipoMsg("erro");
      return;
    }

    try {
      setErroData(false);
      setMsg("");
      setTipoMsg("");
      setLoading(true);

      const token = getToken();

      const res = await fetch(`${BASE_URL}/agendamentos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinica_id: 1,
          pet_id: pet.id,
          data,
          descricao: servico.nome,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao agendar");

      setMsg("Consulta agendada com sucesso! 🎉");
      setTipoMsg("sucesso");

      setTimeout(() => {
        navigate("/consultas/historico");
      }, 1500);
    } catch (err) {
      setMsg("❌ " + err.message);
      setTipoMsg("erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="agendar-container">
      {/* Voltar */}
      <button className="agendar-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      {/* Título – igual PetShop */}
      <h1 className="agendar-title">Agendar Consulta</h1>

      {/* Card Pet + Serviço (mesmo layout) */}
      <div className="agendar-card">
        <div className="agendar-row">
          <p>Pet</p>
          <h3>{pet?.nome}</h3>
        </div>

        <div className="agendar-row">
          <p>Serviço</p>
          <h3>{servico?.nome}</h3>
        </div>
      </div>

      {/* Data e hora */}
      <label className="agendar-label">Escolha data e hora</label>

      <div
        className={`agendar-input-box ${
          erroData ? "agendar-input-error" : ""
        }`}
      >
        <Calendar size={22} className="agendar-icon" />
        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="agendar-input"
        />
      </div>

      {/* Botão */}
      <button
        className={`agendar-btn ${loading ? "disabled" : ""}`}
        onClick={confirmarAgendamento}
        disabled={loading}
      >
        {loading ? "Agendando..." : "Confirmar agendamento"}
      </button>

      {/* Mensagem */}
      {msg && (
        <p className={`agendar-msg ${tipoMsg ? tipoMsg : ""}`}>{msg}</p>
      )}

      {/* Footer */}
      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}
