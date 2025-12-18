# 🐾 PetFy

PetFy é uma aplicação web desenvolvida para o gerenciamento de informações de pets, utilizando uma arquitetura separada entre backend (API) e frontend (interface), facilitando manutenção, escalabilidade e futuras integrações.

O projeto foi desenvolvido com foco em consolidar conhecimentos em desenvolvimento web full stack, organização de código e criação de APIs REST.

---

## 🚀 Funcionalidades
- Cadastro de pets com informações básicas
- Upload e armazenamento de imagens
- Organização dos dados por rotas REST
- Separação clara entre frontend e backend
- Estrutura preparada para futuras funcionalidades (login, adoção, etc.)

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python**
- **Flask** — framework web
- **SQLAlchemy** — ORM para persistência de dados
- **API REST**
- Upload e gerenciamento de arquivos

### Frontend
- **JavaScript**
- **HTML5**
- **CSS3**
- **React**

### Banco de Dados
- **MySQL**

---

## 🧩 Arquitetura do Projeto
O projeto segue o padrão de separação de responsabilidades:

PetFy/
├── backend/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   ├── config.py
│   ├── package.json
│   ├── package-lock.json
│   ├── Procfile
│   ├── requirements.txt
│   └── sitecustomize.py
│
├── frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── pets/
│   │   │   └── user/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md
      

---

## ▶️ Como Executar o Projeto

### Backend
```bash
pip install -r requirements.txt
python -B app.py
```

### Frontend
```bash
npm run dev
```

---

## 🎯 Aprendizados

- Criação e organização de APIs REST
- Integração entre frontend e backend
- Upload e manipulação de arquivos
- Estruturação de projetos full stack
- Design responsivo

---

## 📌 Status
🚧 Em desenvolvimento

## 👨‍💻 Autor
Desenvolvido com 🖥️ por Caio Medeiros.

