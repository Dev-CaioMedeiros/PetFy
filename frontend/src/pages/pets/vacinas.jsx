import { ArrowLeft, Search, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/vacinas.css";
import { useState } from "react";

export default function Vacinas() {
  const navigate = useNavigate();

  const vacinas = [
    { nome: "V8 / V10", icon: "💉" },
    { nome: "Raiva", icon: "🐺" },
    { nome: "Gripe Canina", icon: "🤧" },
    { nome: "Antipulgas", icon: "🦟" },
    { nome: "Vermifugação", icon: "🪱" },
    { nome: "Reforço anual", icon: "📆" },
  ];

  const [busca, setBusca] = useState("");

  const filtradas = vacinas.filter((v) =>
    v.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function escolher(vacina) {
    navigate("/vacinas/escolher_pet", { state: { vacina } });
  }

  return (
    <div className="vac-page">
      
      {/* Voltar */}
      <button className="vac-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="vac-title">Vacinas</h1>

      {/* Histórico */}
      <div
        className="vac-historico-card"
        onClick={() => navigate("/vacinas/historico")}
      >
        <Clock size={28} className="vac-historico-icon" />

        <div>
          <h3>Histórico de vacinas</h3>
          <p>Veja registros aplicados</p>
        </div>

        <ChevronRight size={20} className="vac-historico-arrow" />
      </div>

      {/* Promo */}
      <div className="vac-promo-box">
        <div className="promo-text">
          <h2>Pacote anual</h2>
          <p>Proteção completa para seu pet 🐾</p>
          
          <button className="promo-btn"
         onClick={() => alert("Pacote aplicado!")}>
          Aplicar Pacote</button>
        </div>

        <img
          src="src/assets/pet_vacina.png"
          alt="promo"
          className="promo-img"
        />
      </div>

      {/* Busca */}
      <div className="vac-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar vacina..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <h2 className="vac-subtitle">Vacinas disponíveis</h2>

      {/* GRID */}
      <div className="vac-grid">
        {filtradas.map((v, i) => (
          <div
            className="vac-card"
            key={i}
            onClick={() => escolher(v)}
          >
            <span className="vac-icon">{v.icon}</span>
            <p className="vac-card-title">{v.nome}</p>
            <ChevronRight size={18} className="vac-arrow" />
          </div>
        ))}
      </div>

      {busca && filtradas.length === 0 && (
        <p className="vac-empty">Nenhuma vacina encontrada 😕</p>
      )}

      {/* Footer */}
      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>

    </div>
  );
}
