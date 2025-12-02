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
    DB_PORT = os.getenv("DB_PORT", 3306)

    app.config['SQLALCHEMY_DATABASE_URI'] = \
    f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = os.getenv('SECRET_KEY', 'dev123')

    # Inicializações
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    return app
