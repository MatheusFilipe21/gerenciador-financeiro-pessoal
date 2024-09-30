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
