# routes/vacina_routes.py
from flask import Blueprint, request, jsonify
from datetime import datetime

from config import db
from models.vacina_agendamento import VacinaAgendamento
from models.pet import Pet
from utils.jwt_helper import token_required

vacina_routes = Blueprint("vacina_routes", __name__)

# -------------------------------------------
# CRIAR AGENDAMENTO DE VACINA (POST)
# -------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["POST"])
@token_required
def criar_vacina_agendamento(usuario_id):
    data = request.get_json() or {}

    pet_id = data.get("pet_id")
    vacina = data.get("vacina")
    data_str = data.get("data")

    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400

    if not vacina:
        return jsonify({"mensagem": "vacina é obrigatória"}), 400

    if not data_str:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    # valida pet
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"mensagem": "Pet não encontrado"}), 404

    # converte data
    try:
        data_agendamento = datetime.fromisoformat(data_str)
    except Exception:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    try:
        novo = VacinaAgendamento(
            pet_id=pet_id,
            vacina=vacina,
            data=data_agendamento
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


# -------------------------------------------
# LISTAR AGENDAMENTOS DE VACINA (GET)
# -------------------------------------------
@vacina_routes.route("/vacinas/agendamentos", methods=["GET"])
@token_required
def listar_vacinas_agendadas(usuario_id):
    try:
        agendamentos = (
            VacinaAgendamento.query
            .join(Pet, VacinaAgendamento.pet_id == Pet.id)
            .all()
        )

        result = [a.to_dict() for a in agendamentos]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"mensagem": f"Erro ao listar vacinas: {str(e)}"}), 400


# -------------------------------------------
# DELETAR AGENDAMENTO DE VACINA (DELETE)
# -------------------------------------------
@vacina_routes.route("/vacinas/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_vacina_agendamento(usuario_id, id):
    try:
        agendamento = VacinaAgendamento.query.get(id)

        if not agendamento:
            return jsonify({"mensagem": "Agendamento não encontrado"}), 404

        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento de vacina excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 400
