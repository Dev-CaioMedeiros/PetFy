import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/consulta_escolher_pet.css";
import { API_URL } from "../../services/config";

function getImg(pet) {
  if (pet.foto) return `${API_URL}/uploads/${pet.foto}`;
  return "/placeholder_pet.png";
}

export default function ConsultaEscolherPet() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const servico = state?.servico;
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function loadPets() {
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
    loadPets();
  }, []);

  const escolherPet = (pet) => {
    navigate("/consultas/agendar", { state: { servico, pet } });
  };

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
        <p className="cep-empty">Nenhum pet cadastrado 😿</p>
      )}

      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
