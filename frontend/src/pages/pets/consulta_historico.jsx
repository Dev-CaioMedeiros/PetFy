import {
  ArrowLeft,
  Calendar,
  Clock,
  PawPrint,
  MapPin,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/consulta_historico.css";

export default function ConsultasHistorico() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // "todos" | "futuro" | "passado" | "cancelado"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    try {
      setLoading(true);
      setMsg("");
      const token = getToken();

      const res = await fetch(`${BASE_URL}/agendamentos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao carregar histórico");

      // espera que json seja um array de agendamentos
      setAgendamentos(json);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }

  async function deletarAgendamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar esse agendamento?"
    );
    if (!confirmar) return;

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao cancelar");

      // aqui você pode só remover da lista
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao cancelar agendamento");
    }
  }

  function getStatus(ag) {
    // se o back já manda status = "cancelado"
    if (ag.status === "cancelado") return "cancelado";

    const dataAg = new Date(ag.data);
    const agora = new Date();

    if (Number.isNaN(dataAg.getTime())) return "futuro";

    return dataAg < agora ? "passado" : "futuro";
  }

  function getStatusLabel(ag) {
    const s = getStatus(ag);
    if (s === "passado") return "Já aconteceu";
    if (s === "cancelado") return "Cancelado";
    return "Ainda vai acontecer";
  }

  function getStatusClass(ag) {
    const s = getStatus(ag);
    if (s === "passado") return "status-passado";
    if (s === "cancelado") return "status-cancelado";
    return "status-futuro";
  }

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    const statusReal = getStatus(ag);

    if (filtro === "todos") return true;
    if (filtro === "cancelado") return statusReal === "cancelado";
    if (filtro === "passado") return statusReal === "passado";
    if (filtro === "futuro") return statusReal === "futuro";
    return true;
  });

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    if (Number.isNaN(data.getTime())) return dataStr;

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano}, ${hora}:${min}`;
  }

  return (
    <div className="historico-container">
      <div className="historico-content">
        {/* header */}
        <header className="historico-header">
          <button className="historico-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>

          <h1 className="historico-title">Histórico de Consultas</h1>
        </header>

        {/* filtros */}
        <div className="historico-filters">
          <button
            className={`historico-filter-chip ${
              filtro === "todos" ? "active" : ""
            }`}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>
          <button
            className={`historico-filter-chip ${
              filtro === "futuro" ? "active" : ""
            }`}
            onClick={() => setFiltro("futuro")}
          >
            Ainda vai acontecer
          </button>
          <button
            className={`historico-filter-chip ${
              filtro === "passado" ? "active" : ""
            }`}
            onClick={() => setFiltro("passado")}
          >
            Já aconteceu
          </button>
          <button
            className={`historico-filter-chip ${
              filtro === "cancelado" ? "active" : ""
            }`}
            onClick={() => setFiltro("cancelado")}
          >
            Cancelado
          </button>
        </div>

        {/* mensagem de erro */}
        {msg && <div className="historico-msg-error">{msg}</div>}

        {/* loading */}
        {loading && <p className="historico-loading">Carregando consultas...</p>}

        {/* vazio */}
        {!loading && agendamentosFiltrados.length === 0 && (
          <p className="historico-empty">
            Nenhuma consulta encontrada nesse filtro.
          </p>
        )}

        {/* lista */}
        <div className="historico-list">
          {agendamentosFiltrados.map((ag) => {
            const petNome = ag.pet?.nome || ag.pet_nome || "Pet";
            const clinicaNome =
              ag.clinica?.nome || ag.clinica_nome || "Clínica PetFy";
            const statusLabel = getStatusLabel(ag);
            const statusClass = getStatusClass(ag);

            return (
              <article key={ag.id} className="historico-card">
                {/* barra lateral colorida */}
                <div className={`historico-card-status-bar ${statusClass}`} />

                <div className="historico-card-main">
                  <header className="historico-card-header">
                    <div>
                      <h2 className="historico-card-title">{ag.descricao}</h2>
                      <span className={`historico-status-chip ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <button
                      className="historico-delete-btn"
                      onClick={() => deletarAgendamento(ag.id)}
                      title="Cancelar agendamento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </header>

                  <div className="historico-card-info-row">
                    <Calendar size={16} />
                    <span>{formatarData(ag.data)}</span>
                  </div>

                  <div className="historico-card-info-row">
                    <Clock size={16} />
                    <span>Consulta</span>
                  </div>

                  <div className="historico-card-info-row">
                    <PawPrint size={16} />
                    <span>
                      <strong>Pet:</strong> {petNome}
                    </span>
                  </div>

                  <div className="historico-card-info-row">
                    <MapPin size={16} />
                    <span>
                      <strong>Clínica:</strong> {clinicaNome}
                    </span>
                  </div>

                  {ag.observacoes && (
                    <div className="historico-card-observacoes">
                      <span className="historico-observacoes-label">
                        Observações
                      </span>
                      <p className="historico-observacoes-text">
                        {ag.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button className="historico-home-btn" onClick={() => navigate("/")}>
          Voltar ao Início
        </button>
      </div>

      <footer className="historico-footer">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
