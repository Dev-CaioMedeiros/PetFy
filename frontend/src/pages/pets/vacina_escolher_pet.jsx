import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";
import "../../styles/pets/vacinas_escolher.css";
import { API_URL, BASE_URL } from "../../services/config";

export default function VacinasEscolherPet() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vacina = state?.vacina;

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  function getImg(pet) {
    if (pet.foto) return `${API_URL}/uploads/${pet.foto}`;
    return "/placeholder_pet.png"; // imagem fallback
  }

  function escolherPet(pet) {
    navigate("/vacinas/agendar", { state: { vacina, pet } });
  }

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar pets");
        }

        const json = await res.json();

        // garante sempre um array
        const lista = Array.isArray(json) ? json : json?.pets || [];

        setPets(lista);

      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="vacinas-page">

      {/* VOLTAR */}
      <button className="v-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      {/* TITULO */}
      <h1 className="v-title">Escolha o Pet</h1>

      {/* LOADING */}
      {loading && <p className="v-loading">Carregando pets...</p>}

      {/* GRID */}
      <div className="pet-grid">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="pet-card"
            onClick={() => escolherPet(pet)}
          >
            <img src={getImg(pet)} className="pet-img" />
            <p className="pet-name">{pet.nome}</p>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {!loading && pets.length === 0 && (
        <p className="v-empty">Nenhum pet cadastrado 😿</p>
      )}

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>

    </div>
  );
}
