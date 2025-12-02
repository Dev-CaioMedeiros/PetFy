import { ArrowLeft, Search, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/consultas.css";
import { useState } from "react";


export default function Consultas() {
  const navigate = useNavigate();

  const servicos = [
    { nome: "Consulta geral", icon: "🐾" },
    { nome: "Exame físico", icon: "🩺" },
    { nome: "Retorno veterinário", icon: "📄" },
    { nome: "Consulta emergencial", icon: "🚑" },
    { nome: "Avaliação de pele", icon: "🔬" },
    { nome: "Consulta cardiológica", icon: "❤️" },
  ];

  // 🔎 Estado da busca
  const [busca, setBusca] = useState("");

  // Filtrar serviços
  const filtrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Navegar para escolha do pet
  const abrirEscolhaPet = (servico) => {
    navigate("/consultas/escolher_pets", { state: { servico } });
  };

  return (
    <div className="consultas-page">

      {/* Voltar */}
      <button className="c-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
        Voltar
      </button>

      {/* Título */}
      <h1 className="c-title">Consultas</h1>

      {/* Histórico */}
      <div
        className="c-historico-card"
        onClick={() => navigate("/consultas/historico")}
      >
        <Clock size={28} className="c-historico-icon" />
        <div>
          <h3>Histórico de consultas</h3>
          <p>Consulte o que já foi realizado</p>
        </div>
        <ChevronRight size={20} className="c-historico-arrow" />
      </div>

      {/* Promo */}
      <div className="c-promo">
        <div>
          <h2>10% OFF</h2>
          <p>Na primeira consulta do seu pet 🐶</p>
          <button
            className="c-promo-btn"
            onClick={() => alert("Promoção aplicada!")}
          >
            Aplicar Oferta
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="c-search">
        <Search size={18} className="c-search-icon" />
        <input
          type="text"
          placeholder="Buscar serviço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Título seção */}
      <h2 className="c-subtitle">Serviços disponíveis</h2>

      {/* Lista filtrada */}
      <div className="c-grid">
        {filtrados.map((s, i) => (
          <div
            className="c-card"
            key={i}
            onClick={() => abrirEscolhaPet(s)}
          >
            <span className="c-icon">{s.icon}</span>
            <p className="c-card-title">{s.nome}</p>
            <ChevronRight className="c-arrow" size={18} />
          </div>
        ))}
      </div>

      {/* Sem resultados */}
      {filtrados.length === 0 && (
        <p className="c-empty">Nenhum serviço encontrado 😕</p>
      )}
      <footer className="home-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </div>
  );
}

