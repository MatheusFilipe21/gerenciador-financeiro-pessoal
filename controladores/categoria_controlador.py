from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from sqlalchemy import func, cast, String
from entidades import Categoria
from enums import TipoCategoria

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

def validar(dados):
    erros = []

    nome = dados.get('nome')
    tipo = dados.get('tipo')

    if not nome:
        erros.append('Nome é obrigatório!')

    if not tipo:
        erros.append('Tipo é obrigatório!')
    elif tipo not in TipoCategoria.__members__:
        erros.append(f'Tipo inválido! As opções válidas são: {", ".join(TipoCategoria.__members__.keys())}')

    if erros:
        return None, jsonify({'erros': erros }), 422
    
    categoria = Categoria(nome=nome, tipo=TipoCategoria[tipo])

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

@categoria_bp.route('/categorias', methods=['POST'])
def criar():
    dados = request.get_json()

    categoria, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        session.add(categoria)
        # TODO: Nao era para ser necessario esse commit, mas, so esta funcionando assim.
        session.commit()

        location_url = f"{request.host_url.rstrip('/')}{url_for('categoria_bp.buscar_por_id', id=categoria.id)}"
    
        return '', 201, {'Location': location_url}

@categoria_bp.route('/categorias/<int:id>', methods=['PUT'])
def atualizar(id):
    dados = request.get_json()

    categoriaNovosDados, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        categoria, erro, status = buscar_categoria_por_id(session, id)
        
        if erro:
            return erro, status

        categoria.nome = categoriaNovosDados.nome

        return jsonify(categoria.to_dict()), 200

@categoria_bp.route('/categorias/<int:id>', methods=['DELETE'])
def deletar(id):
    with session_scope() as session:
        categoria, erro, status = buscar_categoria_por_id(session, id)

        if erro:
            return erro, status

        session.delete(categoria)

        return '', 204
