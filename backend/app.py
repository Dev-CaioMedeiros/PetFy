from config import init_app, db
from routes.user_routes import user_routes
from routes.pet_routes import pet_routes
from routes.loja_routes import loja_routes
from routes.agendamento_routes import agendamento_routes
from models.user import User
from models.pet import Pet
from models.produto import Produto
from models.clinica import Clinica
from models.agendamento import Agendamento
from routes.petshop_routes import petshop_routes
from models.petshop_agendamento import PetShopAgendamento
from models.vacina_agendamento import VacinaAgendamento 
from routes.vacina_routes import vacina_routes
from routes.passeio_routes import passeio_routes
from flask import send_from_directory
from sqlalchemy import text
import os

app = init_app()


# 📂 uploads
UPLOAD_FOLDER = os.path.join("uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/uploads/<path:filename>")
def uploads(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# 🟢 verificar conexão com banco
with app.app_context():
    try:
        db.session.execute(text("SELECT 1"))
        print("✅ Banco de dados conectado com sucesso!")
    except Exception as e:
        print("❌ Erro ao conectar ao banco de dados:", e)


# 🔥 registrar rotas
app.register_blueprint(user_routes, url_prefix="/api")
app.register_blueprint(pet_routes, url_prefix="/api")
app.register_blueprint(loja_routes, url_prefix="/api")
app.register_blueprint(agendamento_routes, url_prefix="/api")
app.register_blueprint(petshop_routes, url_prefix="/api")
app.register_blueprint(vacina_routes, url_prefix="/api")
app.register_blueprint(passeio_routes, url_prefix="/api")




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("📦 Tabelas criadas/verificadas!")
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))


