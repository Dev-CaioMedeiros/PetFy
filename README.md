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
│   ├── uploads/            # Arquivos e imagens enviados
│   ├── utils/              # Funções utilitárias
│   ├── .env                # Variáveis de ambiente
│   ├── .gitignore          # Arquivos ignorados pelo Git
│   ├── app.py              # Arquivo principal da aplicação Flask
│   ├── config.py           # Configurações gerais do projeto
│   ├── package.json        # Dependências (caso use scripts auxiliares)
│   ├── package-lock.json   # Controle de versões das dependências
│   ├── Procfile            # Configuração para deploy (ex: Heroku)
│   ├── requirements.txt    # Dependências Python
│   └── sitecustomize.py    # Configurações adicionais do ambiente Python
│
├── frontend/
│   ├── dist/               # Build final do frontend
│   ├── node_modules/       # Dependências do frontend
│   ├── public/             # Arquivos públicos
│   ├── src/
│   │   ├── assets/         # Imagens e recursos estáticos
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── home/       # Página inicial
│   │   │   ├── pets/       # Páginas relacionadas aos pets
│   │   │   └── user/       # Páginas relacionadas ao usuário
│   │   ├── services/       # Serviços de comunicação com a API
│   │   ├── styles/         # Estilos globais e específicos
│   │   ├── App.jsx         # Componente raiz da aplicação
│   │   ├── main.jsx        # Ponto de entrada do React
│   │   └── index.css       # Estilos globais
│   │
│   ├── .env                # Variáveis de ambiente do frontend
│   ├── .gitignore          # Arquivos ignorados pelo Git
│   ├── eslint.config.js    # Configuração do ESLint
│   ├── index.html          # Template HTML principal
│   ├── package.json        # Dependências do frontend
│   ├── package-lock.json   # Controle de versões
│   ├── postcss.config.js   # Configuração do PostCSS
│   ├── tailwind.config.js  # Configuração do Tailwind CSS
│   ├── vercel.json         # Configuração de deploy (Vercel)
│   └── vite.config.js      # Configuração do Vite
│
└── README.md               # Documentação do projeto

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

