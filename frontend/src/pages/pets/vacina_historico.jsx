import { ArrowLeft, Calendar, PawPrint, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/vacinas.css";

export default function VacinasHistorico() {
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

      const res = await fetch(`${BASE_URL}/vacinas/agendamentos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("VACINAS GET ->", json); // <<--- veja o que o backend está enviando
      if (!res.ok) throw new Error(json.mensagem || "Erro ao carregar vacinas");

      setAgendamentos(json);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao carregar vacinas");
    } finally {
      setLoading(false);
    }
  }

  async function deletarAgendamento(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esse agendamento?");
    if (!confirmar) return;

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/vacinas/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao excluir");

      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao excluir agendamento");
    }
  }

  function getStatus(ag) {
    if (ag.status === "cancelado") return "cancelado";

    // tenta vários campos possíveis de data (fallbacks)
    const dataStr = ag.data || ag.data_agendamento || ag.created_at || null;
    const dataAg = dataStr ? new Date(dataStr) : new Date(NaN);
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
    if (!dataStr) return "";
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
        <header className="historico-header">
          <button className="historico-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <h1 className="historico-title">Histórico de Vacinas</h1>
        </header>

        <div className="historico-filters">
          <button className={`historico-filter-chip ${filtro === "todos" ? "active" : ""}`} onClick={() => setFiltro("todos")}>Todos</button>
          <button className={`historico-filter-chip ${filtro === "futuro" ? "active" : ""}`} onClick={() => setFiltro("futuro")}>Ainda vai acontecer</button>
          <button className={`historico-filter-chip ${filtro === "passado" ? "active" : ""}`} onClick={() => setFiltro("passado")}>Já aconteceu</button>
          <button className={`historico-filter-chip ${filtro === "cancelado" ? "active" : ""}`} onClick={() => setFiltro("cancelado")}>Cancelado</button>
        </div>

        {msg && <div className="historico-msg-error">{msg}</div>}
        {loading && <p className="historico-loading">Carregando vacinas...</p>}
        {!loading && agendamentosFiltrados.length === 0 && <p className="historico-empty">Nenhuma vacina encontrada nesse filtro.</p>}

        <div className="historico-list">
          {agendamentosFiltrados.map((ag) => {
            const petNome = ag.pet?.nome || ag.pet_nome || "Pet";
            const vacinaNome = ag.vacina || ag.servico || ag.descricao || "Vacina";
            const dataIso = ag.data || ag.data_agendamento || ag.created_at || null;
            const clinicaNome = ag.clinica_nome || (ag.clinica && ag.clinica.nome) || "Clínica PetFy";
            const statusLabel = getStatusLabel(ag);
            const statusClass = getStatusClass(ag);

            return (
              <article key={ag.id} className="historico-card">
                <div className={`historico-card-status-bar ${statusClass}`} />
                <div className="historico-card-main">
                  <header className="historico-card-header">
                    <div>
                      <h2 className="historico-card-title">{vacinaNome}</h2>
                      <span className={`historico-status-chip ${statusClass}`}>{statusLabel}</span>
                    </div>

                    <button className="historico-delete-btn" onClick={() => deletarAgendamento(ag.id)} title="Excluir agendamento">
                      <Trash2 size={18} />
                    </button>
                  </header>

                  <div className="historico-card-info-row">
                    <Calendar size={16} />
                    <span>{formatarData(dataIso)}</span>
                  </div>

                  <div className="historico-card-info-row">
                    <PawPrint size={16} />
                    <span><strong>Pet:</strong> {petNome}</span>
                  </div>

                  <div className="historico-card-info-row">
                    <MapPin size={16} />
                    <span><strong>Clínica:</strong> {clinicaNome}</span>
                  </div>

                  {ag.observacoes && (
                    <div className="historico-card-observacoes">
                      <span className="historico-observacoes-label">OBSERVAÇÕES</span>
                      <p className="historico-observacoes-text">{ag.observacoes}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button className="historico-home-btn" onClick={() => navigate("/")}>Voltar ao Início</button>
      </div>

      <footer className="historico-footer">© 2025 PetFy — Todos os direitos reservados 🐾</footer>
    </div>
  );
}
