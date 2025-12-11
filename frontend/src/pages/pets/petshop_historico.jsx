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
import "../../styles/pets/consulta_historico.css"; // reaproveita CSS do histórico de consultas

export default function PetShopHistorico() {
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

      const res = await fetch(`${BASE_URL}/petshop/agendamentos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao carregar histórico");

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
      "Tem certeza que deseja remover esse agendamento?"
    );
    if (!confirmar) return;

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/petshop/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao remover");

      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao remover agendamento");
    }
  }

  function getStatus(a) {
    if (a.status === "cancelado") return "cancelado";

    const dataAg = new Date(a.data);
    const agora = new Date();

    if (Number.isNaN(dataAg.getTime())) return "futuro";

    return dataAg < agora ? "passado" : "futuro";
  }

  function getStatusLabel(a) {
    const s = getStatus(a);
    if (s === "passado") return "Já aconteceu";
    if (s === "cancelado") return "Cancelado";
    return "Ainda vai acontecer";
  }

  function getStatusClass(a) {
    const s = getStatus(a);
    if (s === "passado") return "status-passado";
    if (s === "cancelado") return "status-cancelado";
    return "status-futuro";
  }

  const agendamentosFiltrados = agendamentos.filter((a) => {
    const statusReal = getStatus(a);

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

          <h1 className="historico-title">Histórico PetShop</h1>
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
        {loading && <p className="historico-loading">Carregando agendamentos...</p>}

        {/* vazio */}
        {!loading && agendamentosFiltrados.length === 0 && (
          <p className="historico-empty">
            Nenhum agendamento encontrado nesse filtro.
          </p>
        )}

        {/* lista */}
        <div className="historico-list">
          {agendamentosFiltrados.map((a) => {
            const petNome = a.pet_nome || a.pet?.nome || "Pet";
            const clinicaNome = a.clinica_nome || a.clinica?.nome || "PetFy PetShop";
            const tipoServico = a.servico || a.descricao || "Serviço";
            const statusLabel = getStatusLabel(a);
            const statusClass = getStatusClass(a);

            return (
              <article key={a.id} className="historico-card">
                {/* barra lateral colorida */}
                <div className={`historico-card-status-bar ${statusClass}`} />

                <div className="historico-card-main">
                  <header className="historico-card-header">
                    <div>
                      <h2 className="historico-card-title">{tipoServico}</h2>
                      <span className={`historico-status-chip ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <button
                      className="historico-delete-btn"
                      onClick={() => deletarAgendamento(a.id)}
                      title="Remover agendamento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </header>

                  <div className="historico-card-info-row">
                    <Calendar size={16} />
                    <span>{formatarData(a.data)}</span>
                  </div>

                  <div className="historico-card-info-row">
                    <Clock size={16} />
                    <span>{tipoServico}</span>
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

                  {a.observacoes && (
                    <div className="historico-card-observacoes">
                      <span className="historico-observacoes-label">
                        Observações
                      </span>
                      <p className="historico-observacoes-text">
                        {a.observacoes}
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
