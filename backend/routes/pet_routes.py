from flask import Blueprint, jsonify, request, current_app
from models.pet import Pet
from config import db
from utils.jwt_helper import token_required
import os

pet_routes = Blueprint('pet_routes', __name__)

# ---------------------- LISTAR PETS DO USUÁRIO ----------------------
@pet_routes.route('/pets', methods=['GET'])
@token_required
def listar_pets(usuario_id):
    pets = Pet.query.filter_by(dono_id=usuario_id).all()

    lista_pets = []
    for p in pets:
        lista_pets.append({
            "id": p.id,
            "nome": p.nome,
            "idade": p.idade,
            "especie": p.especie,
            "sexo": p.sexo,
            "foto": p.foto,
            "porte": p.porte,
            "descricao": p.descricao,
            "saude": p.saude
        })

    return jsonify(lista_pets), 200


# ---------------------- CADASTRAR PET ----------------------
@pet_routes.route('/pets', methods=['POST'])
@token_required
def criar_pet(usuario_id):

    nome = request.form.get("nome")
    idade = request.form.get("idade")
    especie = request.form.get("especie")
    sexo = request.form.get("sexo")

    # Novos campos
    porte = request.form.get("porte")
    descricao = request.form.get("descricao")
    saude = request.form.get("saude")

    foto = request.files.get("foto")

    if not nome or not especie or not sexo:
        return jsonify({"mensagem": "Campos obrigatórios: nome, espécie e sexo"}), 400

    filename = None
    if foto:
        filename = f"pet_{usuario_id}_{nome}.jpg"
        foto_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        foto.save(foto_path)

    novo_pet = Pet(
        nome=nome,
        idade=idade,
        especie=especie,
        sexo=sexo,
        dono_id=usuario_id,
        foto=filename,
        porte=porte,
        descricao=descricao,
        saude=saude
    )

    db.session.add(novo_pet)
    db.session.commit()

    return jsonify({"mensagem": "Pet cadastrado com sucesso!"}), 201


# ---------------------- BUSCAR PET POR ID (FUNDAMENTAL!) ----------------------
@pet_routes.route('/pets/<int:pet_id>', methods=['GET'])
@token_required
def obter_pet(usuario_id, pet_id):

    pet = Pet.query.filter_by(id=pet_id, dono_id=usuario_id).first()

    if not pet:
        return jsonify({"mensagem": "Pet não encontrado"}), 404

    return jsonify({
        "id": pet.id,
        "nome": pet.nome,
        "idade": pet.idade,
        "especie": pet.especie,
        "sexo": pet.sexo,
        "foto": pet.foto,
        "porte": pet.porte,
        "descricao": pet.descricao,
        "saude": pet.saude
    }), 200


# ---------------------- ATUALIZAR PET ----------------------
@pet_routes.route('/pets/<int:pet_id>', methods=['PUT'])
@token_required
def atualizar_pet(usuario_id, pet_id):
    pet = Pet.query.filter_by(id=pet_id, dono_id=usuario_id).first()

    if not pet:
        return jsonify({"mensagem": "Pet não encontrado ou não pertence a você."}), 404

    nome = request.form.get("nome", pet.nome)
    idade = request.form.get("idade", pet.idade)
    especie = request.form.get("especie", pet.especie)
    sexo = request.form.get("sexo", pet.sexo)

    porte = request.form.get("porte", pet.porte)
    descricao = request.form.get("descricao", pet.descricao)
    saude = request.form.get("saude", pet.saude)

    foto = request.files.get("foto")

    # Atualizar campos
    pet.nome = nome
    pet.idade = idade
    pet.especie = especie
    pet.sexo = sexo
    pet.porte = porte
    pet.descricao = descricao
    pet.saude = saude

    if foto:
        filename = f"pet_{usuario_id}_{nome}.jpg"
        foto_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        foto.save(foto_path)
        pet.foto = filename

    db.session.commit()

    return jsonify({"mensagem": "Pet atualizado com sucesso!"}), 200


# ---------------------- DELETAR PET ----------------------
@pet_routes.route('/pets/<int:pet_id>', methods=['DELETE'])
@token_required
def deletar_pet(usuario_id, pet_id):
    pet = Pet.query.filter_by(id=pet_id, dono_id=usuario_id).first()

    if not pet:
        return jsonify({"mensagem": "Pet não encontrado ou não pertence a você."}), 404

    # Apagar foto
    if pet.foto:
        foto_path = os.path.join(current_app.config["UPLOAD_FOLDER"], pet.foto)
        if os.path.exists(foto_path):
            os.remove(foto_path)

    db.session.delete(pet)
    db.session.commit()

    return jsonify({"mensagem": "Pet removido com sucesso!"}), 200
