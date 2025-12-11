import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/pet-login.png";
import { saveToken } from "../../services/auth";
import "../../styles/user/login.css";
import { BASE_URL } from "../../services/config";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ ADD
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // ⬅️ Bloqueia clique duplo
    setErro("");
    setLoading(true); // ⬅️ Liga loading

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);
        navigate("/home/home");
      } else {
        setErro(data.mensagem || "Erro ao fazer login.");
      }
    } catch {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false); // ⬅️ Desliga loading
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={loginImg}
        alt="Ilustração de login"
        className="login-illustration"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      />

      <motion.h1
        className="login-title"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        PetFy 🐾
      </motion.h1>

      <motion.p
        className="login-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        Faça o login para continuar
      </motion.p>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
      >
        <form className="login-form" onSubmit={handleLogin}>
          <motion.div
            className="input-group"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

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

          {erro && (
            <p className="text-red-500 text-sm mt-2 mb-1 text-center">{erro}</p>
          )}

          <motion.button
            type="submit"
            className={`login-button ${loading ? "disabled" : ""}`}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? "Entrando" : "Entrar"}
          </motion.button>
        </form>

        <motion.p
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="cadastro-link">
            Cadastre-se
          </Link>
        </motion.p>
      </motion.div>

      <footer className="login-footer-text">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </motion.div>
  );
}
