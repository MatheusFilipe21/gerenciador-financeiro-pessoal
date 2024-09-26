from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from entidades import Pessoa

pessoa_bp = Blueprint('pessoa_bp', __name__)

def buscar_pessoa_por_id(session, id):
    pessoa = session.query(Pessoa).get(id)

    if pessoa is None:
        return None, jsonify({'erros': ['Pessoa não encontrada!']}), 404
    
    return pessoa, None, None

def validar(dados):
    erros = []

    nome = dados.get('nome')

    if not nome:
        erros.append('Nome é obrigatório!')

    if erros:
        return None, jsonify({'erros': erros }), 422
    
    pessoa = Pessoa(nome=nome)

    return pessoa, None, None

@pessoa_bp.route('/pessoas', methods=['GET'])
def buscar_tudo():
    with session_scope() as session:
        pessoas = session.query(Pessoa).all()

        return jsonify([pessoa.to_dict() for pessoa in pessoas]), 200

@pessoa_bp.route('/pessoas/<int:id>', methods=['GET'])
def buscar_por_id(id):
    with session_scope() as session:
        pessoa, erro, status = buscar_pessoa_por_id(session, id)

        if erro:
            return erro, status
        
        return jsonify(pessoa.to_dict()), 200

@pessoa_bp.route('/pessoas', methods=['POST'])
def criar():
    dados = request.get_json()

    pessoa, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        session.add(pessoa)
        # TODO: Nao era para ser necessario esse commit, mas, so esta funcionando assim.
        session.commit()

        location_url = f"{request.host_url.rstrip('/')}{url_for('pessoa_bp.buscar_por_id', id=pessoa.id)}"
    
        return '', 201, {'Location': location_url}

@pessoa_bp.route('/pessoas/<int:id>', methods=['PUT'])
def atualizar(id):
    dados = request.get_json()

    pessoaNovosDados, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        pessoa, erro, status = buscar_pessoa_por_id(session, id)
        
        if erro:
            return erro, status

        pessoa.nome = pessoaNovosDados.nome

        return jsonify(pessoa.to_dict()), 200
