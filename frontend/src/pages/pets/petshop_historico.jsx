import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/petshop_historico.css";

export default function PetShopHistorico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);

  // ===== Formatador de Data =====
  function formatarData(iso) {
    if (!iso) return "";

    try {
      const data = new Date(iso);
      return data.toLocaleString("pt-BR", {
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

  // ===== Buscar Histórico =====
  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await fetch(`${BASE_URL}/petshop/agendamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar histórico");

        const json = await res.json();

        // Ordenar por data DESC
        json.sort((a, b) => new Date(b.data) - new Date(a.data));

        setHistorico(json);

      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar histórico.");
      }
    }

    load();
  }, []);

  // ===== Deletar =====
  async function deletar(id) {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/petshop/agendamentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir");

      setHistorico((prev) => prev.filter((item) => item.id !== id));

    } catch (err) {
      console.error(err);
      alert("Erro ao excluir");
    }
  }

  // ===== Render =====
  return (
    <div className="h-page">

      {/* Voltar */}
      <button className="h-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      {/* Título */}
      <h1 className="h-title">Histórico do Pet Shop</h1>

      {/* Erro */}
      {erro && <p className="h-erro">{erro}</p>}

      {/* Lista */}
      <div className="h-list">
        {historico.map((item) => (
          <div key={item.id} className="h-card">

            <div className="h-card-top">
              <h3>{item.servico}</h3>
              <Trash2
                size={20}
                className="h-trash"
                onClick={() => deletar(item.id)}
              />
            </div>

            <p className="h-date">{formatarData(item.data)}</p>

            <p className="h-pet">
              <b>Pet:</b> {item.pet_nome}
            </p>

          </div>
        ))}

        <button
  className="h-home-btn"
  onClick={() => navigate("/")}
>
  Voltar ao Início
</button>


        {/* Se vazio */}
        {historico.length === 0 && !erro && (
          <p className="h-empty">Nenhum serviço encontrado 😕</p>
        )}
      </div>

      {/* Footer */}
      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
