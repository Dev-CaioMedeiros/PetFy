import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/consulta_historico.css";

export default function ConsultaHistorico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/agendamentos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if (!res.ok) throw new Error("Erro ao buscar histórico");

        const json = await res.json();

        // ordenar
        json.sort((a, b) => new Date(b.data) - new Date(a.data));

        setHistorico(json);

      } catch (err) {
        setErro("Erro ao carregar histórico.");
      }
    }

    load();
  }, []);

  function formatarData(iso) {
    try {
      return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  async function deletar(id) {
    if (!window.confirm("Excluir consulta?")) return;

    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) throw new Error("Erro ao excluir");

      setHistorico(prev => prev.filter(h => h.id !== id));

    } catch {
      alert("Erro ao excluir");
    }
  }
      if (res.status === 401) {
        clearToken();
        navigate("/login");
        return;
      }


  return (
    <div className="h-page">

      {/* voltar */}
      <button className="h-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      {/* título */}
      <h1 className="h-title">Histórico de Consultas</h1>

      {erro && <p className="h-erro">{erro}</p>}

      {/* lista  */}
      <div className="h-list">
        {historico.map((item) => (
          <div className="h-card" key={item.id}>

            <div className="h-card-top">
              <h3>{item.descricao}</h3>

              <Trash2
                size={18}
                className="h-trash"
                onClick={() => deletar(item.id)}
              />
            </div>

            <p className="h-date">{formatarData(item.data)}</p>
            <p className="h-pet"><b>Pet:</b> {item.pet_nome}</p>
          </div>
        ))}

        {historico.length === 0 && !erro && (
          <p className="h-empty">Nenhuma consulta encontrada 😿</p>
        )}
      </div>

      {/* BOTÃO VOLTAR AO INICIO */}
      <div className="h-center">
        <button className="h-home-btn" onClick={() => navigate("/")}>
          Voltar ao Início
        </button>
      </div>

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}
