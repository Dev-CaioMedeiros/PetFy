import { ArrowLeft, Calendar, Clock, MapPin, ClipboardList } from "lucide-react";
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
          observacoes,
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao agendar");

      setMsg("Serviço agendado com sucesso! 🎉");
      setIsError(false);

      setTimeout(() => navigate("/petshop/historico"), 1200);

    } catch (err) {
      setMsg("❌ " + (err.message || err));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  // sugestão de horários (você pode alterar)
  const sugestoes = ["09:00", "10:30", "14:00", "16:00"];

  return (
    <div className="psa-container">
      <div className="psa-content">
        {/* Top bar */}
        <header className="psa-header">
          <button className="psa-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>

          <div className="psa-header-texts">
            <h1 className="psa-title">Agendar serviço</h1>
            <span className="psa-subtitle">
              Revise os dados do pet e escolha o melhor dia e horário.
            </span>
          </div>
        </header>

        {/* Pet card */}
        <section className="psa-section">
          <div className="psa-pet-card">
            <div className="psa-pet-left">
              <div className="psa-pet-avatar">
                {pet?.nome?.[0]?.toUpperCase() ?? "P"}
              </div>
              <div>
                <p className="psa-pet-label">Pet</p>
                <h3 className="psa-pet-name">{pet?.nome}</h3>
                <div className="psa-pet-tags">
                  {pet?.especie && <span className="psa-tag">{pet.especie}</span>}
                  {pet?.porte && <span className="psa-tag">{pet.porte}</span>}
                </div>
              </div>
            </div>

            <div className="psa-pet-right">
              <p className="psa-pet-label">Serviço</p>
              <h3 className="psa-service-name">{servico?.nome}</h3>
              <span className="psa-service-chip">PetShop</span>
            </div>
          </div>
        </section>

        {/* info grid */}
        <section className="psa-section">
          <div className="psa-info-grid">
            <div className="psa-info-card">
              <Calendar size={18} />
              <div>
                <p className="psa-info-label">Disponibilidade</p>
                <p className="psa-info-value">Seg a Sáb</p>
              </div>
            </div>

            <div className="psa-info-card">
              <Clock size={18} />
              <div>
                <p className="psa-info-label">Horário</p>
                <p className="psa-info-value">08h às 18h</p>
              </div>
            </div>

            <div className="psa-info-card">
              <MapPin size={18} />
              <div>
                <p className="psa-info-label">Local</p>
                <p className="psa-info-value">PetFy PetShop</p>
              </div>
            </div>
          </div>
        </section>

        {/* data/hora */}
        <section className="psa-section">
          <div className="psa-section-header">
            <h2 className="psa-section-title">Data e horário</h2>
            <span className="psa-section-sub">Escolha um dia e um horário disponíveis.</span>
          </div>

          <div className={`psa-input-box ${isError ? "psa-input-error" : ""}`}>
            <Calendar size={22} className="psa-icon" />
            <div className="psa-input-wrapper">
              <label className="psa-input-label">Data e hora</label>
              <input
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="psa-input"
              />
            </div>
          </div>

          <div className="psa-times">
            <span className="psa-times-label">Sugestões de horário</span>
            <div className="psa-times-list">
              {sugestoes.map((hora) => (
                <button
                  key={hora}
                  type="button"
                  className="psa-time-chip"
                  onClick={() => {
                    if (!data) {
                      const hoje = new Date().toISOString().slice(0, 10);
                      setData(`${hoje}T${hora}`);
                    } else {
                      const apenasData = data.slice(0, 10);
                      setData(`${apenasData}T${hora}`);
                    }
                  }}
                >
                  {hora}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* observações */}
        <section className="psa-section">
          <div className="psa-section-header">
            <h2 className="psa-section-title">Observações</h2>
            <span className="psa-section-sub">Informe detalhes que ajudam no serviço (opcional).</span>
          </div>

          <div className="psa-textarea-wrapper">
            <ClipboardList size={18} className="psa-textarea-icon" />
            <textarea
              className="psa-textarea"
              placeholder="Ex: Já tomou banho esta semana? Tem alergia a algum produto?"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </section>

        {/* botão */}
        <button
          className={`psa-btn ${loading ? "disabled" : ""}`}
          onClick={confirmar}
          disabled={loading}
        >
          {loading ? "Agendando..." : "Confirmar agendamento"}
        </button>

        {/* mensagem */}
        {msg && (
          <div className={isError ? "msg-error" : "msg-success"}>
            {msg}
          </div>
        )}
      </div>

      <footer className="home-footer-text">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
