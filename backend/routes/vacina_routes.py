from flask import Blueprint, request, jsonify
from datetime import datetime

from config import db
from models.vacina_agendamento import VacinaAgendamento
from models.pet import Pet
from utils.jwt_helper import token_required

vacina_routes = Blueprint("vacina_routes", __name__)

# -------------------------------------------------
# CRIAR AGENDAMENTO
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["POST"])
@token_required
def criar_vacina_agendamento(usuario_id):
    data = request.get_json() or {}

    pet_id = data.get("pet_id")
    vacina = data.get("vacina")
    data_str = data.get("data")
    observacoes = data.get("observacoes")  # ← novo

    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400

    if not vacina:
        return jsonify({"mensagem": "vacina é obrigatória"}), 400

    if not data_str:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    try:
        data_agendamento = datetime.fromisoformat(data_str)
    except:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    try:
        novo = VacinaAgendamento(
            pet_id=pet_id,
            vacina=vacina,
            data=data_agendamento,
            observacoes=observacoes  # ← salva no model
        )
        db.session.add(novo)
        db.session.commit()

        return jsonify({
            "mensagem": "Vacina agendada com sucesso",
            "id": novo.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao agendar vacina: {str(e)}"}), 400


# -------------------------------------------------
# LISTAR MEUS AGENDAMENTOS
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["GET"])
@token_required
def listar_vacinas_agendadas(usuario_id):

    agendamentos = VacinaAgendamento.query.join(Pet).filter(
        Pet.dono_id == usuario_id
    ).order_by(VacinaAgendamento.data.desc()).all()

    # já retorna observacoes via to_dict()
    return jsonify([a.to_dict() for a in agendamentos]), 200


# -------------------------------------------------
# DELETAR MEU AGENDAMENTO
# -------------------------------------------------
@vacina_routes.route("/vacinas/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_vacina_agendamento(usuario_id, id):

    agendamento = VacinaAgendamento.query.join(Pet).filter(
        VacinaAgendamento.id == id,
        Pet.dono_id == usuario_id
    ).first()

    if not agendamento:
        return jsonify({"mensagem": "Agendamento não encontrado"}), 404

    try:
        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento de vacina excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 400
