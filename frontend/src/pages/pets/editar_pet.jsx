import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  PawPrint,
  Dog,
  Info,
  HeartPulse,
  Ruler,
} from "lucide-react";
import { BASE_URL } from "../../services/config";
import { getToken } from "../../services/auth";
import "../../styles/pets/editar_pet.css";


export default function EditarPet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    especie: "",
    idade: "",
    sexo: "",
    porte: "",
    saude: "",
    descricao: "",
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = BASE_URL.replace("/api", "");


  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/login");

    fetch(`${BASE_URL}/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error("Erro ao buscar pet");

        setForm({
          nome: data.nome || "",
          especie: data.especie || "",
          idade: data.idade || "",
          sexo: data.sexo || "",
          porte: data.porte || "",
          saude: data.saude || "",
          descricao: data.descricao || "",
        });

        if (data.foto) 
          setFotoPreview(`${API_URL}/uploads/${data.foto}`);
      })
      .catch(() => navigate("/meus_pets"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p className="loading">Carregando...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return navigate("/login");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (fotoFile) formData.append("foto", fotoFile);

    
    const res = await fetch(`${BASE_URL}/pets/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    });

    if (res.ok) navigate("/meus_pets");

    const data = await res.json();
    if (res.ok) navigate(`/pets/${id}`);
    else alert(data.mensagem || "Erro ao atualizar pet");
  };

  return (
    <div className="editar-page">
      <button className="voltar-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Voltar
      </button>

      <h1 className="titulo">Editar Pet</h1>

      {/* FOTO */}
      <div className="foto-area">
        <label className="foto-input">
          <input type="file" accept="image/*" onChange={handleFoto} />
          <div className="foto-circle">
            {fotoPreview ? (
              <img src={fotoPreview} alt="preview" className="foto-preview" />
            ) : (
              <div className="foto-placeholder">
                <Camera size={34} />
                <span>Adicionar foto</span>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* FORM */}
      <form className="card" onSubmit={handleSubmit}>
        {/* Nome */}
        <label className="field-label">Nome</label>
        <div className="input-with-icon">
          <PawPrint size={16} className="input-icon" />
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do pet"
            className="input"
            required
          />
        </div>

        {/* Espécie */}
        <label className="field-label">Espécie</label>
        <div className="input-with-icon">
          <Dog size={16} className="input-icon" />
          <input
            name="especie"
            value={form.especie}
            onChange={handleChange}
            placeholder="Cachorro, Gato..."
            className="input"
            required
          />
        </div>

        {/* Idade */}
        <label className="field-label">Idade</label>
        <div className="input-with-icon">
          <Info size={16} className="input-icon" />
          <input
            name="idade"
            value={form.idade}
            onChange={handleChange}
            placeholder="Idade em anos"
            className="input"
            inputMode="numeric"
          />
        </div>

        {/* Sexo */}
        <label className="field-label">Sexo</label>
        <div className="select-with-icon">
          <select name="sexo" value={form.sexo} onChange={handleChange} className="select">
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>

        {/* Porte */}
        <label className="field-label">Porte</label>
        <div className="select-with-icon">
          <select name="porte" value={form.porte} onChange={handleChange} className="select">
            <option value="">Selecione</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Médio">Médio</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        {/* Saude */}
        <label className="field-label">Saúde</label>
        <div className="input-with-icon">
          <HeartPulse size={16} className="input-icon" />
          <input
            name="saude"
            value={form.saude}
            onChange={handleChange}
            placeholder="Vacinas, condições..."
            className="input"
          />
        </div>

        {/* Descrição */}
        <label className="field-label">Descrição</label>
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição do pet"
          className="textarea"
        />

        <button type="submit" className="btn-save">
          Salvar alterações
        </button>
      </form>
      <footer className="home-footer-text">
         © 2025 PetFy — Todos os direitos reservados 🐾
      </footer>
    </div>
  );
}
