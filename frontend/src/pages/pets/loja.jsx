import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/loja.css";

export default function Loja() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [favoritos, setFavoritos] = useState({});
  const [cartCount, setCartCount] = useState(0);

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

  // carregar carrinho e quantidade total
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.quantidade, 0));
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function toggleFavorito(id) {
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addToCart(produto) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existente = cart.find((item) => item.id === produto.id);

    if (existente) {
      existente.quantidade += 1;
    } else {
      cart.push({
        ...produto,
        quantidade: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setCartCount(cart.reduce((acc, item) => acc + item.quantidade, 0));
  }

  return (
    <div className="loja-mobile-container">

      {/* HEADER */}
      <div className="loja-header">

        <button className="btn-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} /> Voltar
        </button>

        <h1 className="loja-titulo">Loja Pet</h1>

        <div className="cart-icon-container" onClick={() => navigate("/cart")}>
          <ShoppingCart size={26} className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>

      {/* BUSCA */}
      <input
        type="text"
        placeholder="Buscar produtos..."
        className="loja-search-mobile"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* LISTA */}
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

            <button
              className="add-carrinho-btn"
              onClick={() => addToCart(produto)}
            >
              Adicionar ao carrinho 🛒
            </button>

          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="loja-footer">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>

    </div>
  );
}
