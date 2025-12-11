import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint,Camera,Dog,Info,HeartPulse,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";
import { BASE_URL } from "../../services/config";
import "../../styles/pets/cadastrar_pet.css";

export default function CadastrarPet() {
  const [pet, setPet] = useState({
    nome: "",
    idade: "",
    especie: "",
    sexo: "",
    porte: "",
    saude: "",
    descricao: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // FOTO PREVIEW
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPet({ ...pet, foto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

 const salvarPet = async (e) => {
  e.preventDefault();

  if (!pet.nome || !pet.especie || !pet.sexo) {
    alert("Preencha nome, espécie e sexo!");
    return;
  }

  const token = getToken();
  const formData = new FormData();

  for (let key in pet) {
    formData.append(key, pet[key]);
  }

  const res = await fetch(`${BASE_URL}/pets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();

  if (res.ok) {
    alert("Pet cadastrado com sucesso!");
    navigate("/meus_pets");
  } else {
    alert(data.mensagem || "Erro ao cadastrar pet");
  }
};

  return (
    <motion.div
      className="cadastrar-pet-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* SETA VOLTAR */}
      <div className="voltar-btn" onClick={() => navigate("/home/home")}>
        <ArrowLeft size={22} />
        <span>Voltar</span>
      </div>

      {/* TÍTULO */}
      <motion.h1
        className="pet-title"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Cadastrar Pet 
      </motion.h1>

      {/* FOTO */}
      <label className="pet-foto-label">
        {preview ? (
          <img src={preview} className="pet-preview" />
        ) : (
          <div className="foto-placeholder">
            <Camera size={32} />
            <p>Adicionar foto</p>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFoto} hidden />
      </label>

      {/* FORM */}
      <form className="pet-form" onSubmit={salvarPet}>
        
        {/* NOME */}
        <div className="input-box">
          <Dog size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Nome do pet"
            value={pet.nome}
            onChange={(e) => setPet({ ...pet, nome: e.target.value })}
          />
        </div>

        {/* ESPÉCIE */}
        <div className="input-box">
          <PawPrint size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Espécie (Cachorro, Gato...)"
            value={pet.especie}
            onChange={(e) => setPet({ ...pet, especie: e.target.value })}
          />
        </div>

       {/* IDADE */}
<div className="input-box">
  <Info size={18} className="input-icon" />
  <input
    type="text"
    placeholder="Idade"
    value={pet.idade}
    onChange={(e) =>
      setPet({
        ...pet,
        idade: e.target.value.replace(/\D/g, "") 
      })
    }
    inputMode="numeric"
    maxLength="2"
  />
</div>

        {/* SEXO */}
        <div className="select-box">
          <label>Sexo</label>
          <select
            value={pet.sexo}
            onChange={(e) => setPet({ ...pet, sexo: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>

        {/* PORTE */}
        <div className="select-box">
          <label>Porte</label>
          <select
            value={pet.porte}
            onChange={(e) => setPet({ ...pet, porte: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Médio">Médio</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        {/* ESTADO DE SAÚDE */}
        <div className="input-box">
          <HeartPulse size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Saúde (vacinas, condições...)"
            value={pet.saude}
            onChange={(e) => setPet({ ...pet, saude: e.target.value })}
          />
        </div>

        {/* DESCRIÇÃO */}
        <div className="textarea-box">
          <textarea
            placeholder="Descrição do pet"
            value={pet.descricao}
            onChange={(e) => setPet({ ...pet, descricao: e.target.value })}
          ></textarea>
        </div>

        <motion.button
          className="salvar-pet-btn"
          whileTap={{ scale: 0.95 }}
        >
          Cadastrar Pet
        </motion.button>

      </form>
      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </motion.div>
    
    
  );
}
