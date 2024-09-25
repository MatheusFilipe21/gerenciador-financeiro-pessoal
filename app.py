from flask import Flask
from database import Base, db_session, engine
from entidades.pessoa import Pessoa
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

def iniciar_banco_de_dados():
    Base.metadata.create_all(bind=engine)
    db_session.commit()

def registrar_blueprints():
    from controladores import pessoa_bp
    
    app.register_blueprint(pessoa_bp)

if __name__ == '__main__':
    registrar_blueprints()

    iniciar_banco_de_dados()

    app.run(debug=True)
