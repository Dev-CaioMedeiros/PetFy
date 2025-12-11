import os
from flask import send_from_directory
from sqlalchemy import text, inspect
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

# inicia app
app = init_app()

# 📂 uploads
UPLOAD_FOLDER = os.path.join("uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/uploads/<path:filename>")
def uploads(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# 🔥 registrar rotas
app.register_blueprint(user_routes, url_prefix="/api")
app.register_blueprint(pet_routes, url_prefix="/api")
app.register_blueprint(loja_routes, url_prefix="/api")
app.register_blueprint(agendamento_routes, url_prefix="/api")
app.register_blueprint(petshop_routes, url_prefix="/api")
app.register_blueprint(vacina_routes, url_prefix="/api")
app.register_blueprint(passeio_routes, url_prefix="/api")


with app.app_context():
    db.create_all()

    try:
        insp = inspect(db.engine)
        if "agendamentos" in insp.get_table_names():
            colunas_ag = [c["name"] for c in insp.get_columns("agendamentos")]
            if "observacoes" not in colunas_ag:
                try:
                    db.session.execute(
                        text("ALTER TABLE agendamentos ADD COLUMN observacoes TEXT NULL")
                    )
                    db.session.commit()
                    print("✅ Coluna 'observacoes' adicionada em agendamentos")
                except Exception as e:
                    db.session.rollback()
                    print(f"⚠️ Erro ao adicionar coluna 'observacoes': {e}")
        else:
            # se a tabela não existia, db.create_all() já a criou com o campo (se você atualizou o model)
            print("Tabela 'agendamentos' não encontrada — criado via create_all() se necessário.")
    except Exception as e:
        # segurança: se o inspect falhar, só registra
        print(f"⚠️ Falha ao verificar colunas (inspect): {e}")

    # cria clínica default 1 vez
    if not Clinica.query.first():
        nova = Clinica(nome="Clínica Petfy")
        db.session.add(nova)
        db.session.commit()
        print("🏥 Clínica padrão criada!")


# 🔥 development server (local)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
