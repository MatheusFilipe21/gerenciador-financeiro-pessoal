from flask import Blueprint, jsonify
from session_manager import session_scope
from sqlalchemy import func, cast, String
from entidades import Categoria

categoria_bp = Blueprint('categoria_bp', __name__)

def buscar_todas_categorias():
    with session_scope() as session:
        categorias = session.query(Categoria).order_by(func.lower(cast(Categoria.tipo, String)), Categoria.nome).all()
        return [categoria.to_dict() for categoria in categorias]

@categoria_bp.route('/categorias', methods=['GET'])
def buscar_tudo():
    categorias = buscar_todas_categorias()

    return jsonify(categorias), 200
