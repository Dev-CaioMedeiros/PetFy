from flask import Blueprint, jsonify, request
from models.produto import Produto
from config import db

loja_routes = Blueprint("loja_routes", __name__)

# ➜ LISTAR TODOS OS PRODUTOS
@loja_routes.route("/produtos", methods=["GET"])
def listar_produtos():
    produtos = Produto.query.all()

    lista = []
    for p in produtos:
        lista.append({
            "id": p.id,
            "nome": p.nome,
            "preco": p.preco,
            "imagem": p.imagem,
            "descricao": p.descricao,
            "favorito": p.favorito,
            "categoria": p.categoria
        })

    return jsonify(lista), 200


# ➜ FAVORITAR / DESFAVORITAR PRODUTO
@loja_routes.route("/produtos/<int:id>/favorito", methods=["PUT"])
def toggle_favorito(id):
    produto = Produto.query.get(id)
    if not produto:
        return jsonify({"mensagem": "Produto não encontrado"}), 404

    produto.favorito = not produto.favorito
    db.session.commit()

    return jsonify({"mensagem": "Favorito atualizado!", "favorito": produto.favorito}), 200
