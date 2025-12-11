# routes/vacina_routes.py
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from config import db
from models.vacina_agendamento import VacinaAgendamento
from models.pet import Pet
from models.clinica import Clinica
from utils.jwt_helper import token_required
import traceback

vacina_routes = Blueprint("vacina_routes", __name__)

# -------------------------------------------------
# CRIAR AGENDAMENTO DE VACINA
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["POST"])
@token_required
def criar_vacina_agendamento(usuario_id):
    data = request.get_json() or {}

    pet_id = data.get("pet_id")
    vacina = data.get("vacina")
    data_str = data.get("data")
    observacoes = data.get("observacoes")
    clinica_id = data.get("clinica_id")  # opcional

    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400

    if not vacina:
        return jsonify({"mensagem": "vacina é obrigatória"}), 400

    if not data_str:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    try:
        data_agendamento = datetime.fromisoformat(data_str)
    except Exception:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    # valida pet pertence ao usuário
    pet = Pet.query.filter_by(id=pet_id, dono_id=usuario_id).first()
    if not pet:
        return jsonify({"mensagem": "Pet não encontrado ou não pertence ao usuário"}), 404

    # tenta obter nome da clínica (se foi enviado clinica_id)
    clinica_nome = None
    if clinica_id:
        c = Clinica.query.get(clinica_id)
        if c:
            clinica_nome = c.nome

    # se nenhum clinica_nome e tiver uma clinica default no banco, tenta pegar
    if not clinica_nome:
        c_first = Clinica.query.first()
        clinica_nome = c_first.nome if c_first else None

    try:
        novo = VacinaAgendamento(
            pet_id=pet_id,
            vacina=vacina,
            data=data_agendamento,
            observacoes=observacoes,
            clinica_id=clinica_id,
            clinica_nome=clinica_nome
        )
        db.session.add(novo)
        db.session.commit()

        return jsonify({
            "mensagem": "Vacina agendada com sucesso",
            "id": novo.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error("Erro criar_vacina_agendamento: %s\n%s", str(e), traceback.format_exc())
        return jsonify({"mensagem": f"Erro ao agendar vacina: {str(e)}"}), 500


# -------------------------------------------------
# LISTAR MEUS AGENDAMENTOS DE VACINA
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["GET"])
@token_required
def listar_vacinas_agendadas(usuario_id):
    try:
        agendamentos = VacinaAgendamento.query.join(Pet).filter(
            Pet.dono_id == usuario_id
        ).order_by(VacinaAgendamento.data.desc()).all()

        return jsonify([a.to_dict() for a in agendamentos]), 200

    except Exception as e:
        current_app.logger.error("Erro listar_vacinas_agendadas: %s\n%s", str(e), traceback.format_exc())
        return jsonify({"mensagem": "Erro ao listar agendamentos", "erro": str(e)}), 500


# -------------------------------------------------
# DELETAR MEU AGENDAMENTO DE VACINA
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_vacina_agendamento(usuario_id, id):
    try:
        agendamento = VacinaAgendamento.query.join(Pet).filter(
            VacinaAgendamento.id == id,
            Pet.dono_id == usuario_id
        ).first()

        if not agendamento:
            return jsonify({"mensagem": "Agendamento não encontrado"}), 404

        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento de vacina excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error("Erro deletar_vacina_agendamento: %s\n%s", str(e), traceback.format_exc())
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 500
