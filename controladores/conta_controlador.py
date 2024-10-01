from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from entidades import Conta

conta_bp = Blueprint('conta_bp', __name__)

def buscar_todas_contas():
    with session_scope() as session:
        contas = session.query(Conta).all()
        return [conta.to_dict() for conta in contas]

@conta_bp.route('/contas', methods=['GET'])
def buscar_tudo():
    contas = buscar_todas_contas()

    return jsonify(contas), 200
