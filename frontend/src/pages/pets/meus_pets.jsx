import { useEffect, useState } from "react";
import { ArrowLeft, Cat, Dog, PawPrint, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import "../../styles/pets/meus_pets.css";
import { API_URL } from "../../services/config";

export default function MeusPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/login");

    fetch(`${BASE_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensagem);
        setPets(Array.isArray(data) ? data : []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  /** FILTRAR POR CATEGORIA **/
  const filtrarPorCategoria = (lista) => {
    if (activeCategory === "dog") {
      return lista.filter((p) =>
        p.especie?.toLowerCase().includes("cachorro")
      );
    }
    if (activeCategory === "cat") {
      return lista.filter((p) =>
        p.especie?.toLowerCase().includes("gato")
      );
    }
    return lista;
  };

  /** BUSCA **/
  const filtrarPorBusca = (lista) =>
    lista.filter((pet) => {
      const nomePet = pet.nome?.toLowerCase() || "";
      const nomeDono = pet.nome_dono?.toLowerCase() || "";
      const texto = search.toLowerCase();
      return nomePet.includes(texto) || nomeDono.includes(texto);
    });

  const listaFinal = filtrarPorBusca(filtrarPorCategoria(pets));

  const categorias = [
    { id: "all", label: "Todos", icon: PawPrint },
    { id: "dog", label: "Cães", icon: Dog },
    { id: "cat", label: "Gatos", icon: Cat },
  ];

  const formatarIdade = (idade) => {
    if (!idade) return "Sem idade";
    const n = Number(idade);
    return n === 1 ? "1 ano" : `${n} anos`;
  };

  return (
    <div className="meus-pets-page">
      {/* TOPO */}
      <div className="meus-pets-top">
        <button className="back-btn" onClick={() => navigate("/home/home")}>
          <ArrowLeft size={20} />
        </button>

        <div className="meus-pets-title-block">
          <h1>Meus Pets</h1>
          <p>Veja e gerencie seus companheiros de quatro patas 🐾</p>
        </div>
      </div>

      {/* BUSCA */}
      <div className="meus-pets-search">
        <input
          type="text"
          placeholder="Buscar por nome do pet ou dono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORIAS */}
      <div className="meus-pets-categories">
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              className={`category-chip ${active ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon size={18} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* LISTA */}
      <div className="meus-pets-list">
        {loading && <p className="loading-text">Carregando pets...</p>}

        {!loading && listaFinal.length === 0 && (
          <p className="empty-text">Nenhum pet encontrado.</p>
        )}

        {listaFinal.map((pet) => (
          <motion.div
            key={pet.id}
            className="pet-card-horizontal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate(`/pets/${pet.id}`)}
          >
            {/* esquerda */}
            <div className="pet-card-info">
              <div className="pet-card-header-row">
                <h2>{pet.nome}</h2>
              </div>

              <div className="pet-badges-row">
                <span className="badge">{formatarIdade(pet.idade)}</span>
                <span className="badge">{pet.sexo}</span>
                {pet.porte && <span className="badge">{pet.porte}</span>}
              </div>

              <p className="pet-card-desc">
                {pet.descricao?.trim()
                  ? pet.descricao
                  : "Clique para ver mais detalhes."}
              </p>

              <button className="pet-card-btn">Ver detalhes</button>
            </div>

            {/* direita */}
            <div className="pet-card-image-wrapper">
              <div className="paw-bg-circle">
                <PawPrint size={80} className="paw-bg-icon" />
              </div>

              <img
  src={
    pet.foto
      ? `${API_URL}/uploads/${pet.foto}`
      : "/pet.png"
  }
  alt={pet.nome}
  className="pet-card-image"
/>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BOTÃO ADICIONAR */}
      <button
        className="add-pet-fab"
        onClick={() => navigate("/cadastrar-pet")}
      >
        <Plus size={28} />
      </button>
      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
