import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft,PawPrint,Edit,Trash2,CalendarDays,HeartPulse,Weight,Ruler,Bone } from "lucide-react";
import { getToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import "../../styles/pets/pet_detalhes.css";
import { API_URL } from "../../services/config";

export default function PetDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);


  useEffect(() => {
    const token = getToken();

    fetch(`${BASE_URL}/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensagem);
        setPet(data);
      })
      .catch(() => navigate("/meus_pets"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="pet-loading">Carregando...</p>;
  if (!pet) return <p className="pet-loading">Pet não encontrado.</p>;

  async function handleDelete() {
  try {
    const token = getToken();
    
    const res = await fetch(`${BASE_URL}/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert("Pet excluído com sucesso!");
      navigate("/meus_pets");
    } else {
      alert(data.mensagem || "Erro ao excluir pet");
    }

  } catch (error) {
    alert("Erro ao conectar ao servidor.");
    console.error(error);
  }
}

  return (
    <div className="pet-detalhes-page">
      
      {/* BOTÃO VOLTAR */}
      <div className="pet-back-btn" onClick={() => navigate("/meus_pets")}>
        <ArrowLeft size={22} />
      </div>

      {/* FOTO PRINCIPAL */}
      <div className="pet-header">
        <div className="pet-photo-wrapper">
          <div className="pet-photo-bg"></div>
          <img
  src={
    pet.foto
      ? `${API_URL}/uploads/${pet.foto}`
      : "/pet.png"
  }
  alt={pet.nome}
  className="pet-photo"
/>
      
        </div>

        <h1 className="pet-name">{pet.nome}</h1>
        <span className="pet-especie">{pet.especie}</span>

        {/* TAGS */}
        <div className="pet-info-tags">
          <span className="tag">
            <Bone size={16} /> {pet.sexo}
          </span>
          <span className="tag">
            <CalendarDays size={16} /> {pet.idade} anos
          </span>
          {pet.porte && (
            <span className="tag">
              <Ruler size={16} /> {pet.porte}
            </span>
          )}
        </div>
      </div>

      {/* CARDS DE INFO */}
      <div className="pet-details-section">

        {/* CARD - SAÚDE */}
        <motion.div
          className="pet-info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-title">
            <HeartPulse size={22} />
            <h3>Saúde</h3>
          </div>
          <p className="card-text">
            {pet.saude || "Nenhuma informação registrada"}
          </p>
        </motion.div>

        {/* CARD - DESCRIÇÃO */}
        <motion.div
          className="pet-info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-title">
            <PawPrint size={22} />
            <h3>Descrição</h3>
          </div>
          <p className="card-text">
            {pet.descricao || "Sem descrição cadastrada."}
          </p>
        </motion.div>
      </div>

      {/* BOTÕES */}
      <div className="pet-buttons">
        <button
          className="btn-edit"
          onClick={() => navigate(`/editar_pet/${pet.id}`)}
        >
          <Edit size={18} /> Editar
        </button>

        <button
          className="btn-delete"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 size={18} /> Excluir
        </button>
      </div>
      {confirmDelete && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Tem certeza que deseja excluir?</h3>
      <p>Essa ação não pode ser desfeita.</p>

      <div className="popup-buttons">
        <button className="confirm-btn" onClick={handleDelete}>
          Sim, excluir
        </button>

        <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
