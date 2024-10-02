from flask import Blueprint, jsonify
from session_manager import session_scope
from sqlalchemy import func, cast, String
from entidades import Categoria

categoria_bp = Blueprint('categoria_bp', __name__)

def buscar_todas_categorias():
    with session_scope() as session:
        categorias = session.query(Categoria).order_by(func.lower(cast(Categoria.tipo, String)), Categoria.nome).all()
        return [categoria.to_dict() for categoria in categorias]

def buscar_categoria_por_id(session, id):
    categoria = session.get(Categoria, id)

    if categoria is None:
        return None, jsonify({'erros': ['Categoria não encontrada!']}), 404
    
    return categoria, None, None

@categoria_bp.route('/categorias', methods=['GET'])
def buscar_tudo():
    categorias = buscar_todas_categorias()

    return jsonify(categorias), 200

@categoria_bp.route('/categorias/<int:id>', methods=['GET'])
def buscar_por_id(id):
    with session_scope() as session:
        categoria, erro, status = buscar_categoria_por_id(session, id)

        if erro:
            return erro, status
        
        return jsonify(categoria.to_dict()), 200
