import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import petRegister from "../../assets/pet-cadastro.png";
import "../../styles/user/cadastro.css";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  // === Máscaras ===
  const formatarCPF = (value) => {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const formatarTelefone = (value) => {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    return v;
  };

  // === Função para enviar cadastro ===
  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cpf,
          telefone,
          email,
          senha,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        alert(data.message || "Erro ao realizar cadastro");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor");
    }
  };

  return (
    <motion.div
      className="cadastro-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Imagem */}
      <motion.img
        src={petRegister}
        alt="Cadastro pets"
        className="cadastro-illustration"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      />

      {/* Título */}
      <motion.h1
        className="cadastro-title"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Cadastro PetFy 🐾  
      </motion.h1>

      <motion.p
        className="cadastro-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        Cadastre-se e junte-se à nossa comunidade
      </motion.p>

      {/* Formulário */}
      <motion.div
        className="cadastro-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
      >
        {/* 🔧 Formulário funcional */}
        <form className="cadastro-form" onSubmit={handleCadastro}>
          {/* Nome */}
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* CPF */}
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              maxLength="14"
              required
            />
          </div>

          {/* Telefone */}
          <div className="input-group">
            <Phone className="input-icon" size={18} />
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              maxLength="15"
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar Senha */}
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Botão */}
          <motion.button
            type="submit"
            className="cadastro-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Cadastrar
          </motion.button>
        </form>

        {/* Link */}
        <motion.p
          className="cadastro-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Já tem uma conta?{" "}
          <Link to="/login" className="login-link">
            Entrar
          </Link>
        </motion.p>
      </motion.div>

      <footer className="cadastro-footer-text">
        © 2025 AppPet — Todos os direitos reservados
      </footer>
    </motion.div>
  );
}
