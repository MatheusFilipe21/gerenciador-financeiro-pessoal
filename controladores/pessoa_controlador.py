from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from entidades import Pessoa

pessoa_bp = Blueprint('pessoa_bp', __name__)

@pessoa_bp.route('/pessoas', methods=['GET'])
def buscar_tudo():
    with session_scope() as session:
        pessoas = session.query(Pessoa).all()

        return jsonify([pessoa.to_dict() for pessoa in pessoas]), 200

@pessoa_bp.route('/pessoas/<int:id>', methods=['GET'])
def buscar_por_id(id):
    with session_scope() as session:
        pessoa = session.query(Pessoa).get(id)

        if pessoa is None:
            return jsonify({'mensagem': 'Pessoa não encontrada!'}), 404

        return jsonify(pessoa.to_dict()), 200

@pessoa_bp.route('/pessoas', methods=['POST'])
def criar():
    dados = request.get_json()

    nome = dados.get('nome')

    if not nome:
        return jsonify({'mensagem': 'Nome é obrigatório!'}), 422

    pessoa = Pessoa(nome=nome)

    with session_scope() as session:
        session.add(pessoa)
        # TODO: Nao era para ser necessario esse commit, mas, so esta funcionando assim.
        session.commit()

        location_url = f"{request.host_url.rstrip('/')}{url_for('pessoa_bp.buscar_por_id', id=pessoa.id)}"
    
        return '', 201, {'Location': location_url}
