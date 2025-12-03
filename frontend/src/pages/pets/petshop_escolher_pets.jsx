import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/petshop_escolher_pet.css"; 

export default function PetShopEscolherPet() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const servico = state?.servico;

  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await fetch(`${BASE_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        setPets(json);

      } catch (err) {
        console.error("Erro ao carregar pets:", err);
      }
    }

    load();
  }, []);

  function escolherPet(pet) {
    navigate("/petshop/agendar", { state: { servico, pet } });
  }

  function getImg(pet) {
    if (!pet?.foto) {
      return "/placeholder_pet.png";
    }
    // remove /api se existir no BASE_URL (Railway, Render, etc)
    const base = BASE_URL.replace("/api", "");
    return `${base}/uploads/${pet.foto}`;
  }

  return (
    <div className="pe-container">
      
      <button className="pe-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="pe-title">Escolha o Pet</h1>

      <div className="pe-grid">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="pe-card"
            onClick={() => escolherPet(pet)}
          >
            <img
              src={getImg(pet)}
              alt={pet.nome}
              className="pe-img"
            />

            <p className="pe-name">{pet.nome}</p>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <p className="pe-empty">Nenhum pet cadastrado 😿</p>
      )}

      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}
