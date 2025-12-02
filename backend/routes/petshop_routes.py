from flask import Blueprint, request, jsonify
from config import db
from models.petshop_agendamento import PetShopAgendamento
from models.pet import Pet
from utils.jwt_helper import token_required
from datetime import datetime

petshop_routes = Blueprint("petshop_routes", __name__)

# -----------------------------
# CRIAR AGENDAMENTO
# -----------------------------
@petshop_routes.route("/petshop/agendamentos", methods=["POST"])
@token_required
def criar_agendamento(usuario_id):

    data = request.get_json()

    if not data:
        return jsonify({"mensagem": "JSON inválido"}), 400

    pet_id = data.get("pet_id")
    servico = data.get("servico")
    data_agendamento = data.get("data")

    # validações
    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400
    
    if not servico:
        return jsonify({"mensagem": "servico é obrigatório"}), 400
    
    if not data_agendamento:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    # converter data
    try:
        data_agendamento = datetime.fromisoformat(data_agendamento)
    except:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    try:
        novo = PetShopAgendamento(
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


# -----------------------------
# LISTAR AGENDAMENTOS
# -----------------------------
@petshop_routes.route("/petshop/agendamentos", methods=["GET"])
@token_required
def listar_agendamentos(usuario_id):
    try:
        agendamentos = PetShopAgendamento.query.order_by(PetShopAgendamento.data.desc()).all()
        return jsonify([a.to_dict() for a in agendamentos]), 200

    except Exception as e:
        return jsonify({"mensagem": str(e)}), 400


# -----------------------------
# DELETAR AGENDAMENTO
# -----------------------------
@petshop_routes.route("/petshop/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(usuario_id, id):

    try:
        agendamento = PetShopAgendamento.query.get(id)

        if not agendamento:
            return jsonify({"mensagem": "Agendamento não encontrado"}), 404

        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento removido"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": str(e)}), 400
