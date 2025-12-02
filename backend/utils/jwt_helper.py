import jwt
from datetime import datetime, timedelta
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "dev123")

# ✅ Gera token com o campo "id" (compatível com decorador)
def gerar_token(usuario_id):
    payload = {
        "id": usuario_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


# ✅ Decorador que exige token para acessar rotas protegidas
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({"mensagem": "Token ausente!"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            usuario_id = data["id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"mensagem": "Token expirado!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"mensagem": "Token inválido!"}), 401

        return f(usuario_id, *args, **kwargs)

    return decorated
