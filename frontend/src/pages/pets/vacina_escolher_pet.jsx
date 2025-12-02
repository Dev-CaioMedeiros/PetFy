import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";
import "../../styles/pets/vacinas_escolher.css";
import { API_URL } from "../../services/config";

export default function VacinasEscolherPet() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vacina = state?.vacina;

  const [pets, setPets] = useState([]);

  function getImg(pet) {
    if (pet.foto) return `${API_URL}/uploads/${pet.foto}`;
    return "/placeholder_pet.png";
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

        const json = await res.json();
        setPets(json);
      } catch (err) {
        console.error(err);
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
      {pets.length === 0 && (
        <p className="v-empty">Nenhum pet cadastrado 😿</p>
      )}

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>

    </div>
  );
}
