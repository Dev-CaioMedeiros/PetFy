import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, User, Phone, Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import "../../styles/user/editar_p_user.css";
import { API_URL } from "../../services/config";

export default function EditarPerfil() {
  const [usuario, setUsuario] = useState({
    nome: "",
    telefone: "",
    email: "",
    foto: null,
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const navigate = useNavigate();

  // MÁSCARA DE TELEFONE
  const formatarTelefone = (valor) => {
    if (!valor) return "";
    valor = valor.replace(/\D/g, "");

    if (valor.length <= 10) {
      return valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return valor
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  // BUSCAR DADOS DO USUÁRIO
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/usuario`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUsuario({
            nome: data.nome || "",
            telefone: data.telefone || "",
            email: data.email || "",
            foto: null,
          });

          if (data.foto) {
            setFotoPreview(`${API_URL}/uploads/${data.foto}`);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }

    fetchUser();
  }, []);

  // FOTO
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUsuario((prev) => ({ ...prev, foto: file }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // SALVAR ALTERAÇÕES
  const handleSalvar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", usuario.nome);
    formData.append("telefone", usuario.telefone);
    formData.append("email", usuario.email);

    if (usuario.foto instanceof File) {
      formData.append("foto", usuario.foto);
    }

    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/editar-perfil`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        navigate("/home/home");
      } else {
        alert(data.mensagem || "Erro ao atualizar perfil");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="editar-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/*  VOLTAR */}
      <div className="voltar-editar" onClick={() => navigate(-1)}>
         <ArrowLeft size={22} /> Voltar
      </div>

      <motion.h1
        className="editar-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Editar Perfil 🐾
      </motion.h1>

      {/* FOTO */}
      <motion.div
        className="foto-container"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <label htmlFor="fotoInput" className="foto-label">
          {fotoPreview ? (
            <img src={fotoPreview} alt="Foto do usuário" className="foto-preview" />
          ) : (
            <div className="foto-placeholder">
              <Camera size={32} />
              <span>Adicionar foto</span>
            </div>
          )}

          <input
            type="file"
            id="fotoInput"
            accept="image/*"
            onChange={handleFotoChange}
            hidden
          />
        </label>
      </motion.div>

      {/* FORM */}
      <motion.form
        className="editar-form"
        onSubmit={handleSalvar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* NOME */}
        <label className="label-campo">Nome</label>
        <div className="input-group">
          <User className="input-icon" size={18} />
          <input
            type="text"
            value={usuario.nome}
            onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
          />
        </div>

        {/* TELEFONE */}
        <label className="label-campo">Telefone</label>
        <div className="input-group">
          <Phone className="input-icon" size={18} />
          <input
            type="text"
            value={usuario.telefone}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                telefone: formatarTelefone(e.target.value),
              })
            }
          />
        </div>

        {/* EMAIL */}
        <label className="label-campo">E-mail</label>
        <div className="input-group">
          <Mail className="input-icon" size={18} />
          <input
            type="email"
            value={usuario.email}
            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
          />
        </div>

        {/* BOTÃO */}
        <motion.button
          type="submit"
          className="editar-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Salvar alterações
        </motion.button>
      </motion.form>
      <footer className="home-footer-text">
        © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </motion.div>
  );
}
