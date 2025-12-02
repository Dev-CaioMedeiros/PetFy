from flask import Blueprint, request, jsonify
from config import db
from models.agendamento import Agendamento
from utils.jwt_helper import token_required
from datetime import datetime

agendamento_routes = Blueprint("agendamento_routes", __name__)

# -------------------------------------------------
# CRIAR AGENDAMENTO (POST)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos", methods=["POST"])
@token_required
def criar_agendamento(usuario_id):

    data = request.get_json()

    if not data:
        return jsonify({"mensagem": "Json inválido ou ausente"}), 400

    try:
        clinica_id = data.get("clinica_id")
        pet_id = data.get("pet_id")
        data_agendamento = data.get("data")
        descricao = data.get("descricao", "")

        # Validations
        if not clinica_id:
            return jsonify({"mensagem": "clinica_id é obrigatório"}), 400
        
        if not pet_id:
            return jsonify({"mensagem": "pet_id é obrigatório"}), 400
        
        if not data_agendamento:
            return jsonify({"mensagem": "data é obrigatória"}), 400
        
        # Convert date safely
        try:
            data_agendamento = datetime.fromisoformat(data_agendamento)
        except:
            return jsonify({"mensagem": "Formato de data inválido"}), 400

        novo = Agendamento(
            clinica_id=clinica_id,
            pet_id=pet_id,
            data_agendamento=data_agendamento,
            descricao=descricao
        )

        db.session.add(novo)
        db.session.commit()

        return jsonify({
            "mensagem": "Agendamento criado com sucesso",
            "id": novo.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao criar agendamento: {str(e)}"}), 400


# -------------------------------------------------
# LISTAR AGENDAMENTOS (GET)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos", methods=["GET"])
def listar_agendamentos():
    try:
        agendamentos = (
            db.session.query(Agendamento)
            .order_by(Agendamento.data_agendamento.desc())
            .all()
        )

        resultado = []
        for a in agendamentos:
            pet = a.pet  # relacionamento no model
            resultado.append({
                "id": a.id,
                "clinica_id": a.clinica_id,
                "pet_id": a.pet_id,
                "pet_nome": pet.nome if pet else None,
                "data": a.data_agendamento.isoformat() if a.data_agendamento else None,
                "descricao": a.descricao
            })

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"mensagem": f"Erro ao listar agendamentos: {str(e)}"}), 400



# -------------------------------------------------
# DELETAR AGENDAMENTO (DELETE)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(usuario_id, id):
    try:
        agendamento = Agendamento.query.get(id)

        if not agendamento:
            return jsonify({"mensagem": "Agendamento não encontrado"}), 404

        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 400
