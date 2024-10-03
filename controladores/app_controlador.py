from flask import Blueprint, render_template

app_bp = Blueprint('app_bp', __name__)

@app_bp.route('/')
def dashboard():
    return render_template('dashboard.html')

@app_bp.route('/pessoas')
def pessoas():
    from controladores.pessoa_controlador import buscar_todas_pessoas

    pessoas = buscar_todas_pessoas()

    return render_template('pessoas.html', pessoas=pessoas)

@app_bp.route('/contas')
def contas():
    from controladores.conta_controlador import buscar_todas_contas

    contas = buscar_todas_contas()

    return render_template('contas.html', contas=contas)

@app_bp.route('/categorias')
def categorias():
    from controladores.categoria_controlador import buscar_todas_categorias
    categorias = buscar_todas_categorias()
    return render_template('categorias.html', categorias=categorias)
