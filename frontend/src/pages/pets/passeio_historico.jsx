import { ArrowLeft, Calendar, PawPrint, MapPin, User, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/passeio_historico.css";

export default function PasseiosHistorico() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // todos | futuro | passado | cancelado
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    buscarPasseios();
  }, []);

  async function buscarPasseios() {
    try {
      setLoading(true);
      setMsg("");
      const token = getToken();
      const res = await fetch(`${BASE_URL}/passeios/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      console.log("PASSEIOS GET ->", json);
      if (!res.ok) throw new Error(json.mensagem || "Erro ao carregar passeios");
      setAgendamentos(json);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao carregar passeios");
    } finally {
      setLoading(false);
    }
  }

  async function deletarAgendamento(id) {
    if (!window.confirm("Tem certeza que deseja excluir esse agendamento?")) return;
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/passeios/agendamentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao excluir");
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "Erro ao excluir agendamento");
    }
  }

  function getStatus(a) {
    if (a.status === "cancelado") return "cancelado";

    // várias alternativas de campo de data (fazer fallback)
    const dataStr = a.data || a.data_agendamento || a.created_at || null;
    const d = dataStr ? new Date(dataStr) : new Date(NaN);
    const agora = new Date();
    if (Number.isNaN(d.getTime())) return "futuro";
    return d < agora ? "passado" : "futuro";
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

  const filtrados = agendamentos.filter((a) => {
    const s = getStatus(a);
    if (filtro === "todos") return true;
    if (filtro === "futuro") return s === "futuro";
    if (filtro === "passado") return s === "passado";
    if (filtro === "cancelado") return s === "cancelado";
    return true;
  });

  function formatar(dataStr) {
    if (!dataStr) return "";
    const d = new Date(dataStr);
    if (Number.isNaN(d.getTime())) return dataStr;
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano}, ${h}:${m}`;
  }

  return (
    <div className="passeios-container">
      <div className="passeios-content">
        <header className="passeios-header">
          <button className="passeios-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <h1 className="passeios-title">Histórico de Passeios</h1>
        </header>

        <div className="passeios-filters">
          <button className={`passeios-chip ${filtro === "todos" ? "active" : ""}`} onClick={() => setFiltro("todos")}>Todos</button>
          <button className={`passeios-chip ${filtro === "futuro" ? "active" : ""}`} onClick={() => setFiltro("futuro")}>Ainda vai acontecer</button>
          <button className={`passeios-chip ${filtro === "passado" ? "active" : ""}`} onClick={() => setFiltro("passado")}>Já aconteceu</button>
          <button className={`passeios-chip ${filtro === "cancelado" ? "active" : ""}`} onClick={() => setFiltro("cancelado")}>Cancelado</button>
        </div>

        {msg && <div className="passeios-msg">{msg}</div>}
        {loading && <p className="passeios-loading">Carregando passeios...</p>}
        {!loading && filtrados.length === 0 && <p className="passeios-empty">Nenhum passeio encontrado nesse filtro.</p>}

        <div className="passeios-list">
          {filtrados.map((a) => {
            const statusClass = getStatusClass(a);
            const statusLabel = getStatusLabel(a);
            const petNome = a.pet?.nome || a.pet_nome || "Pet";
            const servico = a.servico || a.descricao || "Passeio";
            const dataFmt = formatar(a.data || a.data_agendamento || a.created_at);
            const walker = a.walker_name || a.walker || null;
            const local = a.local || a.localidade || a.clinica_nome || null;
            const clinica = a.clinica?.nome || a.clinica_nome || null;

            return (
              <article key={a.id} className="passeios-card">
                <div className={`passeios-card-bar ${statusClass}`} />
                <div className="passeios-card-main">
                  <header className="passeios-card-header">
                    <div>
                      <h2 className="passeios-card-title">{servico}</h2>
                      <span className={`passeios-status ${statusClass}`}>{statusLabel}</span>
                    </div>

                    <button className="passeios-delete" onClick={() => deletarAgendamento(a.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </header>

                  <div className="passeios-row">
                    <Calendar size={16} />
                    <span>{dataFmt}</span>
                  </div>

                  <div className="passeios-row">
                    <PawPrint size={16} />
                    <span><strong>Pet:</strong> {petNome}</span>
                  </div>

                  {walker && (
                    <div className="passeios-row">
                      <User size={16} />
                      <span><strong>Quem vai passear:</strong> {walker}</span>
                    </div>
                  )}

                  {local && (
                    <div className="passeios-row">
                      <MapPin size={16} />
                      <span><strong>Local:</strong> {local}</span>
                    </div>
                  )}

                  {clinica && (
                    <div className="passeios-row">
                      <MapPin size={16} />
                      <span><strong>Clínica:</strong> {clinica}</span>
                    </div>
                  )}

                  {a.observacoes && (
                    <div className="passeios-obs">
                      <small className="passeios-obs-label">OBSERVAÇÕES</small>
                      <p className="passeios-obs-text">{a.observacoes}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button className="passeios-home-btn" onClick={() => navigate("/")}>Voltar ao Início</button>
      </div>

      <footer className="passeios-footer">© 2025 PetFy — Todos os direitos reservados 🐾</footer>
    </div>
  );
}
