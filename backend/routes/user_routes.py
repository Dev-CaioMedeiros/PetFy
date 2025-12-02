from flask import Blueprint, request, jsonify, current_app
from models.user import User
from config import db, bcrypt
from utils.jwt_helper import gerar_token, token_required
import os

user_routes = Blueprint("user_routes", __name__)

# ---------------------- CADASTRO ----------------------
@user_routes.route("/cadastro", methods=["POST"])
def cadastro():
    data = request.get_json()
    nome = data.get("nome")
    cpf = data.get("cpf")
    telefone = data.get("telefone")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha or not cpf or not telefone:
        return jsonify({"mensagem": "Todos os campos são obrigatórios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"mensagem": "E-mail já cadastrado"}), 409

    senha_hash = bcrypt.generate_password_hash(senha).decode("utf-8")

    novo_usuario = User(
        nome=nome,
        cpf=cpf,
        telefone=telefone,
        email=email,
        senha_hash=senha_hash,
        foto=None
    )

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({"mensagem": "Usuário cadastrado com sucesso!"}), 201


# ---------------------- LOGIN ----------------------
@user_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"mensagem": "Preencha todos os campos"}), 400

    usuario = User.query.filter_by(email=email).first()
    if not usuario or not bcrypt.check_password_hash(usuario.senha_hash, senha):
        return jsonify({"mensagem": "E-mail ou senha inválidos"}), 401

    token = gerar_token(usuario.id)

    return jsonify({
        "mensagem": "Login realizado com sucesso!",
        "token": token,
        "nome": usuario.nome
    }), 200


# ---------------------- USUÁRIO ATUAL ----------------------
@user_routes.route("/usuario", methods=["GET"])
@token_required
def get_usuario(usuario_id):
    usuario = User.query.get(usuario_id)

    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado"}), 404

    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "cpf": usuario.cpf,
        "telefone": usuario.telefone,
        "foto": usuario.foto 
    }), 200


# ---------------------- EDITAR PERFIL ----------------------
@user_routes.route("/editar-perfil", methods=["PUT"])
@token_required
def editar_perfil(usuario_id):
    usuario = User.query.get(usuario_id)

    if not usuario:
        return jsonify({"mensagem": "Usuário não encontrado"}), 404

    nome = request.form.get("nome")
    telefone = request.form.get("telefone")
    email = request.form.get("email")
    foto = request.files.get("foto")

    if nome:
        usuario.nome = nome
    if telefone:
        usuario.telefone = telefone
    if email:
        usuario.email = email

    # FOTO
    if foto:
        filename = f"user_{usuario.id}.jpg"
        filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        foto.save(filepath)
        usuario.foto = filename

    db.session.commit()

    return jsonify({"mensagem": "Perfil atualizado com sucesso!"}), 200
