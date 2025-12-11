import { ArrowLeft, Calendar, Clock, MapPin, ClipboardList } from "lucide-react";
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
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  async function confirmarAgendamento() {
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
          observacoes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem);

      setMsg("Consulta agendada com sucesso! 🎉");
      setIsError(false);

      setTimeout(() => {
        navigate("/consultas/historico");
      }, 1500);
    } catch (err) {
      setMsg("❌ " + err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="agendar-container">
      {/* wrapper do conteúdo pra ficar organizado em qualquer tela */}
      <div className="agendar-content">
        {/* Top bar */}
        <header className="agendar-header">
          <button className="agendar-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>

          <div className="agendar-header-texts">
            <h1 className="agendar-title">Agendar Consulta</h1>
            <span className="agendar-subtitle">
              Revise os dados do pet e escolha o melhor dia e horário.
            </span>
          </div>
        </header>

        {/* PET CARD */}
        <section className="agendar-section">
          <div className="agendar-pet-card">
            <div className="agendar-pet-left">
              <div className="agendar-pet-avatar">
                {pet?.nome?.[0]?.toUpperCase() ?? "P"}
              </div>
              <div>
                <p className="agendar-pet-label">Pet</p>
                <h3 className="agendar-pet-name">{pet?.nome}</h3>
                <div className="agendar-pet-tags">
                  {pet?.tipo && <span className="agendar-tag">{pet.tipo}</span>}
                  {pet?.raca && <span className="agendar-tag">{pet.raca}</span>}
                </div>
              </div>
            </div>

            <div className="agendar-pet-right">
              <p className="agendar-pet-label">Serviço</p>
              <h3 className="agendar-service-name">{servico?.nome}</h3>
              <span className="agendar-service-chip">Consulta geral</span>
            </div>
          </div>
        </section>

        {/* RESUMO / INFO DA CLÍNICA */}
        <section className="agendar-section">
          <div className="agendar-info-grid">
            <div className="agendar-info-card">
              <Calendar size={18} />
              <div>
                <p className="agendar-info-label">Disponibilidade</p>
                <p className="agendar-info-value">Seg a Sáb</p>
              </div>
            </div>

            <div className="agendar-info-card">
              <Clock size={18} />
              <div>
                <p className="agendar-info-label">Horário da clínica</p>
                <p className="agendar-info-value">08h às 18h</p>
              </div>
            </div>

            <div className="agendar-info-card">
              <MapPin size={18} />
              <div>
                <p className="agendar-info-label">Local</p>
                <p className="agendar-info-value">Clínica PetFy</p>
              </div>
            </div>
          </div>
        </section>

        {/* DATA E HORA */}
        <section className="agendar-section">
          <div className="agendar-section-header">
            <h2 className="agendar-section-title">Data e horário</h2>
            <span className="agendar-section-sub">
              Escolha um dia e um horário disponíveis.
            </span>
          </div>

          <div
            className={`agendar-input-box ${
              isError ? "agendar-input-error" : ""
            }`}
          >
            <Calendar size={22} className="agendar-icon" />

            <div className="agendar-input-wrapper">
              <label className="agendar-input-label">Data e hora</label>
              <input
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="agendar-input"
              />
            </div>
          </div>

          {/* "chips" de horários rápidos */}
          <div className="agendar-times">
            <span className="agendar-times-label">Sugestões de horário</span>
            <div className="agendar-times-list">
              {["09:00", "10:30", "14:00", "16:00"].map((hora) => (
                <button
                  key={hora}
                  type="button"
                  className="agendar-time-chip"
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

        {/* OBSERVAÇÕES */}
        <section className="agendar-section">
          <div className="agendar-section-header">
            <h2 className="agendar-section-title">Observações</h2>
            <span className="agendar-section-sub">
              Informe sintomas, uso de medicamentos ou algo importante.
            </span>
          </div>

          <div className="agendar-textarea-wrapper">
            <ClipboardList size={18} className="agendar-textarea-icon" />
            <textarea
              className="agendar-textarea"
              placeholder="Ex: Raulf está mancando desde ontem, já tomou remédio para dor."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </section>

        {/* BOTÃO */}
        <button
          className={`agendar-btn ${loading ? "disabled" : ""}`}
          onClick={confirmarAgendamento}
          disabled={loading}
        >
          {loading ? "Agendando..." : "Confirmar agendamento"}
        </button>

        {/* Mensagem */}
        {msg && (
          <div className={isError ? "msg-error" : "msg-success"}>{msg}</div>
        )}
      </div>

      {/* Footer */}
      <footer className="home-footer-text">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
