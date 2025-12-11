import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Carrega variáveis do .env
load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()

def init_app():
    app = Flask(__name__)

    # Configuração do banco
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_NAME = os.getenv("DB_NAME")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))

    app.config['SQLALCHEMY_DATABASE_URI'] = \
    f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = os.getenv('SECRET_KEY', 'dev123')

    # Inicializações
    db.init_app(app)
    bcrypt.init_app(app)

    # CORS: configurável por env var FRONTEND_ORIGINS (comma-separated).
    # Default permite o frontend de produção e localhosts comuns para dev.
    origins_env = os.getenv(
        "FRONTEND_ORIGINS",
        "https://pet-fy.vercel.app,http://localhost:5173,http://localhost:3000"
    )
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]

    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        expose_headers=["Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    return app
