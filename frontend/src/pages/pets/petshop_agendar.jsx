import { ArrowLeft, Calendar, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/petshop_agendar.css";

export default function PetShopAgendar() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { servico, pet } = state || {};

  const [data, setData] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirmar() {
    if (!data) {
      setMsg("❌ Selecione uma data e hora!");
      return;
    }

    try {
      setMsg("");
      setLoading(true);

      const token = getToken();

      const res = await fetch(`${BASE_URL}/petshop/agendamentos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pet_id: pet.id,
          servico: servico.nome,
          data,
          observacoes, // enviado pro back
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao agendar");

      setMsg("Serviço agendado com sucesso! 🎉");

      setTimeout(() => navigate("/petshop/historico"), 1200);

    } catch (err) {
      setMsg("❌ " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="psa-container">
      <div className="psa-content">
        <button className="psa-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} /> Voltar
        </button>

        <h1 className="psa-title">Agendar serviço</h1>

        {/* CARD */}
        <div className="psa-card">
          <div className="psa-row">
            <p>Pet</p>
            <h3>{pet?.nome}</h3>
          </div>

          <div className="psa-row">
            <p>Serviço</p>
            <h3>{servico?.nome}</h3>
          </div>
        </div>

        {/* INPUT */}
        <label className="psa-label">Escolha data e hora</label>

        <div className={`psa-input-box ${!data ? "psa-empty" : ""}`}>
          <Calendar size={22} className="psa-icon" />

          <input
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="psa-input"
          />
        </div>

        {/* OBSERVAÇÕES */}
        <label className="psa-label">Observações (opcional)</label>
        <div className="psa-textarea-box">
          <ClipboardList size={18} className="psa-textarea-icon" />
          <textarea
            className="psa-textarea"
            rows={4}
            placeholder="Ex: Tigre está sujo nas patas, por favor caprichar na escovação. Já tomou anti-pulgas."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
        <button
          className={`psa-btn ${loading ? "disabled" : ""}`}
          onClick={confirmar}
          disabled={loading}
        >
          {loading ? "Agendando..." : "Confirmar agendamento"}
        </button>

        {/* MENSAGEM */}
        {msg && (
          <div className={msg.startsWith("❌") ? "msg-error" : "msg-success"}>
            {msg}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
