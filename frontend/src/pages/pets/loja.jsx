import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/loja.css";

export default function Loja() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [favoritos, setFavoritos] = useState({});
  const [abrirFiltros, setAbrirFiltros] = useState(false);

  const produtos = [
    {
      id: 1,
      nome: "Coleira Personalizada",
      preco: 49.9,
      imagem: "/coleira.png",
    },
    {
      id: 2,
      nome: "Caminha Premium",
      preco: 199.0,
      imagem: "/caminha.png",
    },
    {
      id: 3,
      nome: "Ração Gold 10kg",
      preco: 89.9,
      imagem: "/ração.png",
    },
  ];

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function toggleFavorito(id) {
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="loja-mobile-container">

      {/* ===== BOTÃO VOLTAR ===== */}
      <button className="btn-voltar" onClick={() => navigate(-1)}>
         <ArrowLeft size={22} /> Voltar
      </button>

      {/* ===== TÍTULO ===== */}
      <h1 className="loja-titulo">Loja Pet</h1>

      {/* ===== BUSCA ===== */}
      <input
        type="text"
        placeholder="Buscar produtos..."
        className="loja-search-mobile"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* ===== LISTA DE PRODUTOS ===== */}
      <div className="produtos-grid-mobile">
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="produto-card-mobile">
            <button
              className="favorito-btn"
              onClick={() => toggleFavorito(produto.id)}
            >
              {favoritos[produto.id] ? "★" : "☆"}
            </button>

            <img src={produto.imagem} alt={produto.nome} className="produto-img" />

            <h3 className="produto-nome">{produto.nome}</h3>
            <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>

            <button className="btn-carrinho-geral" onClick={() => navigate("/cart")}>
              Ir para o Carrinho 🛒
            </button>

          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="loja-footer">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
