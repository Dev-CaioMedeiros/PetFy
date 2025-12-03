import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/pets/cart.css";

export default function Carrinho() {
  const navigate = useNavigate();

  const [carrinho, setCarrinho] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // carregar carrinho do storage quando abrir a tela
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCarrinho(stored);
  }, []);

  // salvar sempre que mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(carrinho));
  }, [carrinho]);

  function removerItem(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function finalizarCompra() {
    setMensagem("🎉 Compra realizada com sucesso! Obrigado por comprar com o PetFy 🐾");

    setTimeout(() => {
      localStorage.removeItem("cart");
      setCarrinho([]);
      setMensagem("");
      navigate("/home/home");
    }, 2000);
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  return (
    <div className="cart-container">
      
      {/* VOLTAR */}
      <button className="cart-voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} /> Voltar
      </button>

      {/* TÍTULO */}
      <h1 className="cart-titulo">Meu Carrinho 🛒</h1>

      {/* MENSAGEM */}
      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}

      {/* VAZIO */}
      {carrinho.length === 0 && !mensagem && (
        <p className="cart-vazio">Seu carrinho está vazio 🐶</p>
      )}

      {/* LISTA */}
      <div className="cart-lista">
        {carrinho.map((item) => (
          <div key={item.id} className="cart-item">

            <img src={item.imagem} alt={item.nome} className="cart-img" />

            <div className="cart-info">
              <h3>{item.nome}</h3>
              <p className="cart-preco">R$ {item.preco.toFixed(2)}</p>

              {/* QUANTIDADE */}
              <div className="cart-quantidade">

                <button onClick={() => alterarQuantidade(item.id, -1)}>
                  <Minus size={18} />
                </button>

                <span>{item.quantidade}</span>

                <button onClick={() => alterarQuantidade(item.id, +1)}>
                  <Plus size={18} />
                </button>

              </div>
            </div>

            {/* REMOVER */}
            <button className="btn-remover" onClick={() => removerItem(item.id)}>
              <Trash2 size={18} />
            </button>

          </div>
        ))}
      </div>

      {/* TOTAL + BOTÃO */}
      {carrinho.length > 0 && (
        <div className="cart-total">
          <p>Total: <strong>R$ {total.toFixed(2)}</strong></p>

          <button className="btn-comprar" onClick={finalizarCompra}>
            Finalizar Compra 🧡
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="cart-footer">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>

    </div>
  );
}
