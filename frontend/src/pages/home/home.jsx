import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  PawPrint,
  Syringe,
  HeartPulse,
  ChevronRight,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import dogHero from "../../assets/pet.png";
import dogShop from "../../assets/pet-care.png";
import dogLove from "../../assets/pet-friends-love.png";
import dogMyPets from "../../assets/pet-mine.png";

import LogoutToast from "../../components/LogoutToast"; 
import { getToken, clearToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import "../../styles/home/home.css";

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [busca, setBusca] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showToast, setShowToast] = useState(false); 

  const navigate = useNavigate();
  const API_URL = BASE_URL.replace("/api", "");

  // ===== FUNÇÃO DE LOGOUT =====
  function handleLogout() {
    clearToken();
    setShowMenu(false);
    setShowToast(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  // ===== LISTA DE SERVIÇOS PARA PESQUISA =====
  const servicos = [
    { nome: "Banho simples", categoria: "Pet Shop", rota: "/petshop" },
    { nome: "Tosa completa", categoria: "Pet Shop", rota: "/petshop" },
    { nome: "Consultas", categoria: "Consultas", rota: "/consulta" },
    { nome: "Vacinas", categoria: "Vacinas", rota: "/vacinas" },
    { nome: "Acessórios", categoria: "Pet Store", rota: "/loja" },
    { nome: "Passeios", categoria: "Passeios", rota: "/passeios" },
    { nome: "Meus Pets", categoria: "Pets", rota: "/meus_pets" },
    { nome: "Editar perfil", categoria: "Usuário", rota: "/editar_p_dono" },
    { nome: "Sobre AppPet", categoria: "Informações", rota: "/sobre" },
  ];

  // normaliza texto (ignora acentos e maiúsculas)
  const normalize = (txt) =>
    txt
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";

  // pesquisa inteligente
  const resultados = servicos
    .map((item) => {
      const termo = normalize(busca);
      const nome = normalize(item.nome);
      const categoria = normalize(item.categoria);

      let score = 0;

      if (nome.includes(termo)) score += 2;
      if (categoria.includes(termo)) score += 1;
      if (nome.startsWith(termo)) score += 3;

      return { ...item, score };
    })
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score);

  // ===== BUSCAR USUÁRIO =====
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/usuario`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        return res.json();
      })
      .then((data) => {
        setNomeUsuario(data.nome || "Usuário");

        if (data.foto) {
          setFotoPerfil(`${API_URL}/uploads/${data.foto}`);
        }
      })
      .catch(() => {
        clearToken();
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="home-container">

      {/* TOAST DE LOGOUT */}
      <LogoutToast show={showToast} />

      {/* Menu usuário */}
      <div className="user-menu">
        <div
          className="user-icon"
          onClick={() => setShowMenu(!showMenu)}
          title="Perfil"
        >
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Foto usuário" className="user-avatar" />
          ) : (
            <User size={24} />
          )}
        </div>

        {showMenu && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={() => navigate("/editar_p_dono")}
              className="dropdown-item"
            >
              Editar perfil
            </button>

            <button
              type="button"
              onClick={handleLogout} 
              className="dropdown-item logout"
            >
              Sair
            </button>
          </motion.div>
        )}
      </div>

      {/* Saudação */}
      <motion.h1
        className="home-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Olá, {nomeUsuario} <span className="paw-icon">🐾</span>
      </motion.h1>

      {/* Busca */}
      <motion.div
        className="search-bar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar produtos, serviços ou pets..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </motion.div>

      {/* RESULTADOS DA PESQUISA */}
      {busca && (
        <motion.div
          className="search-results"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {resultados.length > 0 ? (
            resultados.map((item, i) => (
              <div
                key={i}
                className="search-item"
                onClick={() => navigate(item.rota)}
              >
                <span className="sr-title">{item.nome}</span>
                <span className="sr-cat">{item.categoria}</span>
              </div>
            ))
          ) : (
            <p className="sr-empty">Nenhum resultado encontrado</p>
          )}
        </motion.div>
      )}

      {/* Hero card */}
      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="hero-text">
          <h2>Amor pelos pets?</h2>
          <p>Encontre tudo o que precisa para o seu amigo 💛</p>
          <button className="hero-btn" onClick={() => navigate("/sobre")}>
            Saiba mais
          </button>
        </div>
        <img src={dogHero} alt="Pet amor" className="hero-img" />
      </motion.div>

      {/* Menu de ícones */}
      <motion.div
        className="menu-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="menu-item" onClick={() => navigate("/loja")}>
          <ShoppingBag className="menu-icon" size={24} />
          <span>Pet Store</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/consulta")}>
          <HeartPulse className="menu-icon" size={24} />
          <span>Consultas</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/petshop")}>
          <PawPrint className="menu-icon" size={24} />
          <span>Pet Shop</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/vacinas")}>
          <Syringe className="menu-icon" size={24} />
          <span>Vacinas</span>
        </div>
      </motion.div>

      {/* Seção Meus Pets */}
      <motion.div
        className="pet-section mypets"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="section-text">
          <h3>Meus Pets</h3>
          <h2>Veja seus companheiros</h2>
          <p>Cuide, dê amor e acompanhê seus a 🐶🐱</p>
          <button className="section-btn" onClick={() => navigate("/meus_pets")}>
            Ver meus pets
          </button>
        </div>

        <div className="section-img">
          <img src={dogMyPets} alt="Meus pets" />
          <ChevronRight
            className="arrow-icon"
            size={20}
            onClick={() => navigate("/meus_pets")}
          />
        </div>
      </motion.div>

      {/* Loja */}
      <motion.div
        className="pet-section marketplace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="section-text">
          <h3>Pet Store</h3>
          <h2>Acessórios e mais</h2>
          <p>Seu pet merece tudo do melhor 💛</p>
          <button className="section-btn" onClick={() => navigate("/loja")}>
            Ver agora
          </button>
        </div>

        <div className="section-img">
          <img src={dogShop} alt="Marketplace pet" />
          <ChevronRight
            className="arrow-icon"
            size={20}
            onClick={() => navigate("/loja")}
          />
        </div>
      </motion.div>

      {/* Passeios */}
      <motion.div
        className="pet-section passeios"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="section-text">
          <h3>Passeios</h3>
          <h2>Veja seus últimos passeios</h2>
          <p>Dê felicidade e uma vida saudável ao seu pet</p>
          <button className="section-btn" onClick={() => navigate("/passeios")}>
            Encontrar
          </button>
        </div>
        <div className="section-img">
          <img src={dogLove} alt="Passeios pet" />
          <ChevronRight
            className="arrow-icon"
            size={20}
            onClick={() => navigate("/passeios")}
          />
        </div>
      </motion.div>

      <footer className="home-footer-text">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
