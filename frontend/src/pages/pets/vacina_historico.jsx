import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/vacinas_historico.css";

export default function VacinasHistorico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/vacinas/agendamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setHistorico(json);
      } catch (err) {
        setErro("Erro ao carregar histórico.");
      }
    }

    load();
  }, []);

  async function deletar(id) {
    if (!window.confirm("Deseja excluir este agendamento?")) return;

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/vacinas/agendamentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistorico((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Erro ao excluir");
    }
  }

  function formatarData(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="vh-page">
      <button className="vh-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="vh-title">Histórico de Vacinas</h1>

      {historico.map((item) => (
        <div key={item.id} className="vh-card">
          <div className="vh-top">
            <h3>{item.vacina}</h3>
            <Trash2 size={20} className="vh-trash" onClick={() => deletar(item.id)} />
          </div>

          <p className="vh-date">{formatarData(item.data)}</p>
          <p className="vh-pet"><b>Pet:</b> {item.pet_nome}</p>
        </div>
      ))}

      {historico.length === 0 && <p className="vh-empty">Nenhuma vacina encontrada</p>}

      <button className="vh-home" onClick={() => navigate("/")}>
        Voltar ao Início
      </button>

      <footer className="home-footer-text">© 2025 AppPet — Todos os direitos reservados</footer>
    </div>
  );
}
