from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from entidades import Conta

conta_bp = Blueprint('conta_bp', __name__)

def buscar_todas_contas():
    with session_scope() as session:
        contas = session.query(Conta).all()
        return [conta.to_dict() for conta in contas]

def buscar_conta_por_id(session, id):
    conta = session.get(Conta, id)

    if conta is None:
        return None, jsonify({'erros': ['Conta não encontrada!']}), 404
    
    return conta, None, None

@conta_bp.route('/contas', methods=['GET'])
def buscar_tudo():
    contas = buscar_todas_contas()

    return jsonify(contas), 200

@conta_bp.route('/contas/<int:id>', methods=['GET'])
def buscar_por_id(id):
    with session_scope() as session:
        conta, erro, status = buscar_conta_por_id(session, id)

        if erro:
            return erro, status
        
        return jsonify(conta.to_dict()), 200
