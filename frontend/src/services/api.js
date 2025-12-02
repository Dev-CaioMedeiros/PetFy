// src/services/api.js
import { BASE_URL } from "./config";
import { getToken } from "./auth";

/**
 * Helper para requests:
 * - se `body` for FormData, não setamos Content-Type (o browser faz).
 * - retorna { ok, status, data } onde data é o json (ou null)
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};

  // adiciona Authorization se houver token
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // não sobrescreve Content-Type quando for FormData
  if (!(options.body instanceof FormData) && options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else {
    try {
      data = await res.text();
    } catch (_) {
      data = null;
    }
  }

  return { ok: res.ok, status: res.status, data };
}

export const api = {
  // AUTH
  login: (email, senha) => request("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  }),

  cadastrar: (dados) => request("/cadastro", {
    method: "POST",
    body: JSON.stringify(dados),
  }),

  getUsuario: () => request("/usuario", { method: "GET" }),

  editarPerfil: (formData) => request("/editar-perfil", {
    method: "PUT",
    body: formData, // FormData
  }),

  // PETS
  listarPets: () => request("/pets", { method: "GET" }),
  criarPet: (formData) => request("/pets", { method: "POST", body: formData }),
  obterPet: (petId) => request(`/pets/${petId}`, { method: "GET" }),
  atualizarPet: (petId, formData) => request(`/pets/${petId}`, { method: "PUT", body: formData }),
  deletarPet: (petId) => request(`/pets/${petId}`, { method: "DELETE" }),

  // AGENDAMENTOS / CONSULTAS (se backend tiver)
  listarAgendamentos: () => request("/agendamentos", { method: "GET" }),
  criarAgendamento: (dados) => request("/agendamentos", { method: "POST", body: JSON.stringify(dados) }),
  // ... adicione mais conforme a API do backend

  // VACINAS
  listarVacinas: () => request("/vacinas", { method: "GET" }),
  criarVacina: (dados) => request("/vacinas", { method: "POST", body: JSON.stringify(dados) }),
  // ... etc

  // PASSEIOS
  listarPasseios: () => request("/passeios", { method: "GET" }),
  criarPasseio: (formData) => request("/passeios", { method: "POST", body: formData }),

  // SERVIÇOS / PETSHOP (se adicionar endpoints)
  listarServicos: () => request("/servicos", { method: "GET" }),
  agendarServico: (dados) => request("/servicos/agendar", { method: "POST", body: JSON.stringify(dados) }),
};
