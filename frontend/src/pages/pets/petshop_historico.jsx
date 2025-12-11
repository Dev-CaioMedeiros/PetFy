import { ArrowLeft, Calendar, PawPrint, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/petshop_historico.css";

export default function PetShopHistorico() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); 
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    buscar();
  }, []);

  async function buscar() {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`${BASE_URL}/petshop/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro");
      setAgendamentos(json);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  async function remover(id) {
    if (!window.confirm("Tem certeza que deseja remover esse agendamento?")) return;
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/petshop/agendamentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.mensagem || "Erro ao remover");
      // remove da lista
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message || "Erro ao remover");
    }
  }

  function getStatus(a) {
    if (a.status === "cancelado") return "cancelado";
    const d = new Date(a.data);
    const agora = new Date();
    return d < agora ? "passado" : "futuro";
  }

  function formatar(dataStr) {
    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return dataStr;
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano}, ${h}:${m}`;
  }

  const filtrados = agendamentos.filter(a => {
    const s = getStatus(a);
    if (filtro === "todos") return true;
    if (filtro === "futuro") return s === "futuro";
    if (filtro === "passado") return s === "passado";
    if (filtro === "cancelado") return s === "cancelado";
    return true;
  });

  return (
    <div className="psh-container">
      <div className="psh-content">
        <header className="psh-header">
          <button className="psh-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <h1 className="psh-title">Histórico PetShop</h1>
        </header>

        <div className="psh-filters">
          <button className={`psh-chip ${filtro === "todos" ? "active" : ""}`} onClick={() => setFiltro("todos")}>Todos</button>
          <button className={`psh-chip ${filtro === "futuro" ? "active" : ""}`} onClick={() => setFiltro("futuro")}>Ainda vai acontecer</button>
          <button className={`psh-chip ${filtro === "passado" ? "active" : ""}`} onClick={() => setFiltro("passado")}>Já aconteceu</button>
          <button className={`psh-chip ${filtro === "cancelado" ? "active" : ""}`} onClick={() => setFiltro("cancelado")}>Cancelado</button>
        </div>

        {msg && <div className="psh-msg">{msg}</div>}
        {loading && <p className="psh-loading">Carregando...</p>}
        {!loading && filtrados.length === 0 && <p className="psh-empty">Nenhum agendamento encontrado.</p>}

        <div className="psh-list">
          {filtrados.map(a => {
            const status = getStatus(a);
            return (
              <article key={a.id} className="psh-card">
                <div className={`psh-bar ${status}`} />
                <div className="psh-main">
                  <header className="psh-card-header">
                    <div>
                      <h2 className="psh-card-title">{a.servico}</h2>
                      <span className={`psh-status ${status}`}>
                        {status === "futuro" ? "Ainda vai acontecer" : status === "passado" ? "Já aconteceu" : "Cancelado"}
                      </span>
                    </div>
                    <button className="psh-delete" onClick={() => remover(a.id)} title="Remover">
                      <Trash2 size={16} />
                    </button>
                  </header>

                  <div className="psh-row">
                    <Calendar size={16} />
                    <span>{formatar(a.data)}</span>
                  </div>

                  <div className="psh-row">
                    <PawPrint size={16} />
                    <span><strong>Pet:</strong> {a.pet_nome}</span>
                  </div>

                  {a.observacoes && (
                    <div className="psh-obs">
                      <small className="psh-obs-label">Observações</small>
                      <p className="psh-obs-text">{a.observacoes}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button className="psh-home" onClick={() => navigate("/")}>Voltar ao Início</button>
      </div>

      <footer className="psh-footer">© 2025 PetFy — Todos os direitos reservados 🐾</footer>
    </div>
  );
}
