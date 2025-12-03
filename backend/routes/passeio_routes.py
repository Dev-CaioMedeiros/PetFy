from flask import Blueprint, request, jsonify
from config import db
from models.passeio_agendamento import PasseioAgendamento
from models.pet import Pet
from utils.jwt_helper import token_required
from datetime import datetime

passeio_routes = Blueprint("passeio_routes", __name__)

# -------------------------------------------------
# CRIAR AGENDAMENTO
# -------------------------------------------------
@passeio_routes.route("/passeios/agendamentos", methods=["POST"])
@token_required
def criar_agendamento(usuario_id):

    data = request.get_json() or {}

    pet_id = data.get("pet_id")
    servico = data.get("servico")
    data_agendamento = data.get("data")

    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400
    
    if not servico:
        return jsonify({"mensagem": "servico é obrigatório"}), 400
    
    if not data_agendamento:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    try:
        data_agendamento = datetime.fromisoformat(data_agendamento)
    except:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    try:
        novo = PasseioAgendamento(
            pet_id=pet_id,
            servico=servico,
            data=data_agendamento
        )

        db.session.add(novo)
        db.session.commit()

        return jsonify({
            "mensagem": "Agendamento criado com sucesso",
            "id": novo.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": str(e)}), 400


# -------------------------------------------------
# LISTAR MEUS AGENDAMENTOS
# -------------------------------------------------
@passeio_routes.route("/passeios/agendamentos", methods=["GET"])
@token_required
def listar_passeios(usuario_id):

    agendamentos = PasseioAgendamento.query.join(Pet).filter(
        Pet.dono_id == usuario_id
    ).order_by(PasseioAgendamento.data.desc()).all()

    return jsonify([a.to_dict() for a in agendamentos]), 200


# -------------------------------------------------
# DELETAR MEU AGENDAMENTO
# -------------------------------------------------
@passeio_routes.route("/passeios/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(usuario_id, id):

    agendamento = PasseioAgendamento.query.join(Pet).filter(
        PasseioAgendamento.id == id,
        Pet.dono_id == usuario_id
    ).first()

    if not agendamento:
        return jsonify({"mensagem": "Agendamento não encontrado"}), 404

    try:
        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento removido"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": str(e)}), 400
