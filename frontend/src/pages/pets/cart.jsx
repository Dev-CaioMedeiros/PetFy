import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/cart.css";

export default function Carrinho() {
  const navigate = useNavigate();

  const [carrinho, setCarrinho] = useState([
    {
      id: 1,
      nome: "Coleira Personalizada",
      preco: 49.9,
      quantidade: 1,
      imagem: "/coleira.png",
    },
    {
      id: 2,
      nome: "Caminha Premium",
      preco: 199.0,
      quantidade: 1,
      imagem: "/caminha.png",
    }
  ]);

  const [mensagem, setMensagem] = useState("");

  function removerItem(id) {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  }

  function finalizarCompra() {
    setMensagem("🎉 Compra realizada com sucesso! Obrigado por comprar com o PetFy 🐾");

    setTimeout(() => {
      setCarrinho([]);
      setMensagem("");
      navigate("/home/home");
    }, 2500);
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  return (
    <div className="cart-container">
      <button className="cart-voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      <h1 className="cart-titulo">Meu Carrinho 🛒</h1>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}

      {carrinho.length === 0 && !mensagem && (
        <p className="cart-vazio">Seu carrinho está vazio 🐶</p>
      )}

      <div className="cart-lista">
        {carrinho.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imagem} alt={item.nome} className="cart-img" />

            <div className="cart-info">
              <h3>{item.nome}</h3>
              <p className="cart-preco">R$ {item.preco.toFixed(2)}</p>
              <p>Quantidade: {item.quantidade}</p>
            </div>

            <button className="btn-remover" onClick={() => removerItem(item.id)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      {carrinho.length > 0 && (
        <div className="cart-total">
          <p>Total: <strong>R$ {total.toFixed(2)}</strong></p>
          <button className="btn-comprar" onClick={finalizarCompra}>
            Finalizar Compra 🧡
          </button>
        </div>
      )}

      <footer className="cart-footer">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
