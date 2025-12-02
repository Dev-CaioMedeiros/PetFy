import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ilustracao from "../../assets/pet_sobre.png";
import "../../styles/home/sobre.css";

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <div className="sobre-container">
        
      {/* ILUSTRAÇÃO COM ANIMAÇÃO */}
      <motion.div
        className="sobre-illustration"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="sobre-illustration-bg"></div>
        <img src={ilustracao} className="sobre-img" alt="Sobre o PetFy" />
      </motion.div>

      {/* TEXTO */}
      <motion.div
        className="sobre-content"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="sobre-title">
          Sobre o <span>PetFy</span> 🐾
        </h1>

        <p className="sobre-text">
          O PetFy foi desenvolvido para tornar o cuidado com os seus animais
          mais simples, organizado e cheio de carinho.
        </p>

        <p className="sobre-text">
          Aqui você pode gerenciar seus pets, registrar saúde, acompanhar
          vacinas, agendar consultas e até salvar seus passeios, tudo em um
          único lugar.
        </p>

        <p className="sobre-text">
          Nosso objetivo é oferecer uma experiência leve, bonita e pensada para
          você e para seu melhor amigo.
        </p>
      </motion.div>

      {/* BOTÃO */}
      <motion.button
        className="sobre-button"
        onClick={() => navigate("/home/home")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        Utilizar PetFy 🐾
      </motion.button>

      {/* RODAPÉ */}
      <p className="sobre-footer">© 2025 PetFy — Todos os direitos reservados</p>
    </div>
  );
}
