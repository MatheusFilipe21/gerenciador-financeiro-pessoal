from flask import Flask
from database import Base, engine
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

def iniciar_banco_de_dados():
    Base.metadata.create_all(bind=engine)

def registrar_blueprints():
    from controladores import app_bp
    from controladores import pessoa_bp

    app.register_blueprint(app_bp)

    prefixo_api = '/api'
    
    app.register_blueprint(pessoa_bp, url_prefix=prefixo_api)

if __name__ == '__main__':
    registrar_blueprints()

    iniciar_banco_de_dados()

    app.run(debug=True)
