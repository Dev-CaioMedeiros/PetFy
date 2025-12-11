from flask import Blueprint, request, jsonify
from config import db
from models.agendamento import Agendamento
from models.pet import Pet
from utils.jwt_helper import token_required
from datetime import datetime

agendamento_routes = Blueprint("agendamento_routes", __name__)

# -------------------------------------------------
# CRIAR AGENDAMENTO (POST)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos", methods=["POST"])
@token_required
def criar_agendamento(usuario_id):

    data = request.get_json() or {}

    clinica_id = data.get("clinica_id")
    pet_id = data.get("pet_id")
    data_agendamento = data.get("data")
    descricao = data.get("descricao", "")
    observacoes = data.get("observacoes")  # 🔹 NOVO

    if not clinica_id:
        return jsonify({"mensagem": "clinica_id é obrigatório"}), 400
        
    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400
        
    if not data_agendamento:
        return jsonify({"mensagem": "data é obrigatória"}), 400
        
    try:
        data_agendamento = datetime.fromisoformat(data_agendamento)
    except Exception:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    try:
        novo = Agendamento(
            clinica_id=clinica_id,
            pet_id=pet_id,
            data_agendamento=data_agendamento,
            descricao=descricao,
            observacoes=observacoes  # 🔹 NOVO
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
# LISTAR MEUS AGENDAMENTOS (GET)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos", methods=["GET"])
@token_required
def listar_consultas(usuario_id):

    agendamentos = Agendamento.query.join(Pet).filter(
        Pet.dono_id == usuario_id
    ).order_by(Agendamento.data_agendamento.desc()).all()

    return jsonify([
        {
            "id": a.id,
            "descricao": a.descricao,
            "data": a.data_agendamento.isoformat(),
            "pet_nome": a.pet.nome if a.pet else None,
            "clinica_nome": a.clinica.nome if a.clinica else "Clínica PetFy",
            "observacoes": a.observacoes,  # 🔹 NOVO
        }
        for a in agendamentos
    ]), 200


# -------------------------------------------------
# DELETAR MEU AGENDAMENTO (DELETE)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(usuario_id, id):

    agendamento = Agendamento.query.join(Pet).filter(
        Agendamento.id == id,
        Pet.dono_id == usuario_id
    ).first()

    if not agendamento:
        return jsonify({"mensagem": "Agendamento não encontrado"}), 404

    try:
        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 400
