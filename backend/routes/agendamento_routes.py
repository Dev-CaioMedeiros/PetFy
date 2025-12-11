from flask import Blueprint, request, jsonify, current_app
from config import db
from models.agendamento import Agendamento
from models.pet import Pet
from models.clinica import Clinica
from utils.jwt_helper import token_required
from datetime import datetime
import traceback

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
    observacoes = data.get("observacoes")  # opcional

    if not clinica_id:
        return jsonify({"mensagem": "clinica_id é obrigatório"}), 400

    if not pet_id:
        return jsonify({"mensagem": "pet_id é obrigatório"}), 400

    if not data_agendamento:
        return jsonify({"mensagem": "data é obrigatória"}), 400

    # valida formato da data
    try:
        data_agendamento = datetime.fromisoformat(data_agendamento)
    except Exception:
        return jsonify({"mensagem": "Formato de data inválido"}), 400

    # valida pet pertence ao usuário
    pet = Pet.query.filter_by(id=pet_id, dono_id=usuario_id).first()
    if not pet:
        return jsonify({"mensagem": "Pet não encontrado ou não pertence ao usuário"}), 404

    # opcional: valida clinica existe (se quiser)
    clinica = Clinica.query.get(clinica_id) if clinica_id else None
    if clinica_id and not clinica:
        return jsonify({"mensagem": "Clínica não encontrada"}), 404

    try:
        novo = Agendamento(
            clinica_id=clinica_id,
            pet_id=pet_id,
            data_agendamento=data_agendamento,
            descricao=descricao,
            observacoes=observacoes
        )

        db.session.add(novo)
        db.session.commit()

        return jsonify({
            "mensagem": "Agendamento criado com sucesso",
            "id": novo.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error("Erro criar_agendamento: %s\n%s", str(e), traceback.format_exc())
        return jsonify({"mensagem": f"Erro ao criar agendamento: {str(e)}"}), 500


# -------------------------------------------------
# LISTAR MEUS AGENDAMENTOS (GET)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos", methods=["GET"])
@token_required
def listar_consultas(usuario_id):
    try:
        agendamentos = (
            Agendamento.query
            .join(Pet)
            .filter(Pet.dono_id == usuario_id)
            .order_by(Agendamento.data_agendamento.desc())
            .all()
        )

        resultado = []
        for a in agendamentos:
            try:
                data_iso = a.data_agendamento.isoformat() if getattr(a, "data_agendamento", None) else None
            except Exception:
                # se a.data_agendamento não for datetime válido, tenta str()
                try:
                    data_iso = str(a.data_agendamento)
                except Exception:
                    data_iso = None

            pet_nome = None
            try:
                pet_nome = a.pet.nome if a.pet else None
            except Exception:
                pet_nome = None

            clinica_nome = None
            try:
                clinica_nome = a.clinica.nome if a.clinica else "Clínica PetFy"
            except Exception:
                clinica_nome = "Clínica PetFy"

            resultado.append({
                "id": a.id,
                "descricao": getattr(a, "descricao", None),
                "data": data_iso,
                "pet_nome": pet_nome,
                "clinica_nome": clinica_nome,
                "observacoes": getattr(a, "observacoes", None),
            })

        return jsonify(resultado), 200

    except Exception as e:
        tb = traceback.format_exc()
        current_app.logger.error("Erro listar_consultas: %s\n%s", str(e), tb)
        # Retorna JSON com mensagem amigável (não HTML)
        return jsonify({
            "mensagem": "Erro interno ao listar agendamentos",
            "erro": str(e),
            "trace": tb[:2000]  # corte para não enviar tudo
        }), 500


# -------------------------------------------------
# DELETAR MEU AGENDAMENTO (DELETE)
# -------------------------------------------------
@agendamento_routes.route("/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(usuario_id, id):
    try:
        agendamento = (
            Agendamento.query
            .join(Pet)
            .filter(
                Agendamento.id == id,
                Pet.dono_id == usuario_id
            )
            .first()
        )

        if not agendamento:
            return jsonify({"mensagem": "Agendamento não encontrado"}), 404

        db.session.delete(agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento excluído com sucesso"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error("Erro deletar_agendamento: %s\n%s", str(e), traceback.format_exc())
        return jsonify({"mensagem": f"Erro ao excluir agendamento: {str(e)}"}), 500
