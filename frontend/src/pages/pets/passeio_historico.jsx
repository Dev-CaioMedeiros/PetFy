import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/passeio_historico.css";

export default function PasseiosHistorico() {
  const navigate = useNavigate();

  const [lista, setLista] = useState([]);

  async function carregar() {
    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/passeios/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      setLista(json);
    } catch (err) {
      console.error(err);
    }
  }

  async function remover(id) {
  try {
    const token = getToken();

    await fetch(`${BASE_URL}/passeios/agendamentos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setLista(prev => prev.filter(a => a.id !== id));

  } catch (err) {
    console.error(err);
  }
}


  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="ph-page">

      <button className="ph-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="ph-title">Histórico de Passeios</h1>

      <div className="ph-list">
        {lista.map((a) => (
          <div className="ph-card" key={a.id}>
            <div>
              <h3>{a.pet_nome}</h3>
              <p>{a.servico}</p>
              <span>
                {a.data ? new Date(a.data).toLocaleString("pt-BR") : "Sem data"}
              </span>
            </div>

            <Trash2 size={22}
              className="ph-del"
              onClick={() => remover(a.id)}
            />
          </div>
        ))}
      </div>

      {lista.length === 0 && (
        <p className="ph-empty">Nenhum passeio encontrado 😕</p>
      )}

      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
