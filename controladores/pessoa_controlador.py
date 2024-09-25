from flask import Blueprint, jsonify, request
from database import db_session
from entidades import Pessoa

pessoa_bp = Blueprint('pessoa_bp', __name__)

@pessoa_bp.route('/pessoas', methods=['POST'])
def criar():
    dados = request.get_json()

    nome = dados.get('nome')

    if not nome:
        return jsonify({'mensagem': 'Nome é obrigatório!'}), 422

    pessoa = Pessoa(nome=nome)

    db_session.add(pessoa)
    
    db_session.commit()
    
    return '', 201
