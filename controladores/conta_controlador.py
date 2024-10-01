from flask import Blueprint, jsonify, request, url_for
from session_manager import session_scope
from entidades import Conta
from controladores.pessoa_controlador import buscar_pessoa_por_id

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

def validar(dados):
    erros = []

    nome = dados.get('nome')
    pessoa_dados = dados.get('pessoa')

    if not nome:
        erros.append('Nome é obrigatório!')

    if not pessoa_dados or not pessoa_dados.get('id'):
        erros.append('Pessoa é obrigatória e deve conter um id!')

    if erros:
        return None, jsonify({'erros': erros }), 422

    pessoa_id = pessoa_dados['id']

    with session_scope() as session:
        pessoa, erro, status = buscar_pessoa_por_id(session, pessoa_id)
        
        if erro:
            return None, erro, status

    conta = Conta(nome=nome, pessoa_id=pessoa_id)

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

@conta_bp.route('/contas', methods=['POST'])
def criar():
    dados = request.get_json()

    conta, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        session.add(conta)
        # TODO: Nao era para ser necessario esse commit, mas, so esta funcionando assim.
        session.commit()

        location_url = f"{request.host_url.rstrip('/')}{url_for('conta_bp.buscar_por_id', id=conta.id)}"
    
        return '', 201, {'Location': location_url}

@conta_bp.route('/contas/<int:id>', methods=['PUT'])
def atualizar(id):
    dados = request.get_json()

    contaNovosDados, erro, status = validar(dados)

    if erro:
        return erro, status

    with session_scope() as session:
        conta, erro, status = buscar_conta_por_id(session, id)
        
        if erro:
            return erro, status

        conta.nome = contaNovosDados.nome
        conta.pessoa_id = contaNovosDados.pessoa_id

        return jsonify(conta.to_dict()), 200

@conta_bp.route('/contas/<int:id>', methods=['DELETE'])
def deletar(id):
    with session_scope() as session:
        conta, erro, status = buscar_conta_por_id(session, id)

        if erro:
            return erro, status

        session.delete(conta)

        return '', 204
