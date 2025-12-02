import { ArrowLeft, Search, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/passeios.css";
import { useState } from "react";
import imgPromo from "../../assets/pet_passeio.png";

export default function Passeios() {
  const navigate = useNavigate();

  const servicos = [
    { nome: "Passeio básico", icon: "🚶‍♂️" },
    { nome: "Passeio longo", icon: "🏃‍♂️" },
    { nome: "Passeio com brinquedos", icon: "🎾" },
    { nome: "Passeio noturno", icon: "🌙" },
    { nome: "Social para cães", icon: "🐶" },
    { nome: "Caminhada rápida", icon: "⏱️" },
  ];

  const [busca, setBusca] = useState("");

  const filtrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function escolher(servico) {
    navigate("/passeios/escolher", { state: { servico } });
  }

  return (
    <div className="passeios-page">
      
      <button className="ps-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="ps-title">Passeios</h1>

      {/* Histório */}
      <div
        className="ps-historico-card"
        onClick={() => navigate("/passeios/historico")}
      >
        <Clock size={28} className="ps-historico-icon" />
        <div>
          <h3>Histórico de passeios</h3>
          <p>Veja passeios anteriores</p>
        </div>
        <ChevronRight size={20} className="ps-historico-arrow" />
      </div>

      {/* Promo */}
      <div className="ps-promo-box">
        <div className="promo-text">
          <h2>💛 Passeio grátis</h2>
          <p>No primeiro agendamento!</p>
          
          <button className="promo-btn"
            onClick={() => alert("Promoção ativada!")}>
            Ativar promoção
          </button>
        </div>

        <img src={imgPromo} 
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

      <h2 className="ps-subtitle">Nossos passeios</h2>

      {/* GRID */}
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
        <p className="ps-empty">Nenhum passeio encontrado 😕</p>
      )}

      {/* FOOTER */}
      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
      
    </div>
  );
}
