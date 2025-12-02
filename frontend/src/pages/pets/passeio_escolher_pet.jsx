import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/passeio_escolher_pet.css";
import { API_URL } from "../../services/config";

export default function PasseiosEscolherPet() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const servico = state?.servico;

  const [pets, setPets] = useState([]);

  function getImg(pet) {
  if (pet.foto) return `${API_URL}/uploads/${pet.foto}`;
  return "/placeholder_pet.png";
  }

  function escolherPet(pet) {
    navigate("/passeios/agendar", { state: { servico, pet } });
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
    <div className="pe-container">
      
      <button className="pe-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="pe-title">Escolha o Pet</h1>

      <div className="pe-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="pe-card" onClick={() => escolherPet(pet)}>
            <img src={getImg(pet)} className="pe-img" />
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
