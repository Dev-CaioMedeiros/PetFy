import { ArrowLeft, Search, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/pet_shop.css";
import { useState } from "react";
import banner from "../../assets/pet_pet_shop.png";

export default function PetShop() {
  const navigate = useNavigate();

  const servicos = [
    { nome: "Banho simples", icon: "🛁" },
    { nome: "Tosa completa", icon: "✂️" },
    { nome: "Desembaraço", icon: "🐕" },
    { nome: "Hidratação", icon: "💧" },
    { nome: "Corte de unha", icon: "🐾" },
    { nome: "Limpeza de ouvido", icon: "🧼" },
  ];

  const [busca, setBusca] = useState("");

  const filtrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function escolher(servico) {
    navigate("/petshop/escolher", { state: { servico } });
  }

  return (
    <div className="petshop-page">
      
      <button className="ps-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="ps-title">Banho & Tosa</h1>

      {/* Histório */}
      <div
        className="ps-historico-card"
        onClick={() => navigate("/petshop/historico")}
      >
        <Clock size={28} className="ps-historico-icon" />
        <div>
          <h3>Histórico de serviços</h3>
          <p>Veja atendimentos anteriores</p>
        </div>
        <ChevronRight size={20} className="ps-historico-arrow" />
      </div>

      {/* Promo */}
      <div className="ps-promo-box">
        <div className="promo-text">
          <h2>30% OFF</h2>
          <p>Banho + hidratação no seu pet ✨</p>
          
          <button className="promo-btn"
            onClick={() => alert("Promoção aplicada!")}>

            Aplicar Promoção
            </button>
        </div>

        <img src={banner} 
          alt="promo"
          className="promo-img"
        />
      </div>

      {/* Busca */}
      <div className="ps-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar serviço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <h2 className="ps-subtitle">Nossos serviços</h2>

      <div className="ps-grid">
        {filtrados.map((s, i) => (
          <div
            className="ps-card"
            key={i}
            onClick={() => escolher(s)}
          >
            <span className="ps-icon">{s.icon}</span>
            <p className="ps-card-title">{s.nome}</p>
            <ChevronRight size={18} className="ps-arrow" />
          </div>
        ))}
      </div>

      {busca && filtrados.length === 0 && (
        <p className="ps-empty">Nenhum serviço encontrado 😕</p>
      )}

      {/* FOOTER */}
      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
      
    </div>
  );
}

