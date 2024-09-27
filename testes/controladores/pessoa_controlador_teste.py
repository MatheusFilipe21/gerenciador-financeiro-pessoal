import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from session_manager import session_scope
from controladores.pessoa_controlador import pessoa_bp
from entidades.pessoa import Pessoa
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(pessoa_bp)
db = SQLAlchemy(app)

class PessoaControladorTeste(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = app.test_client()
        cls.app_context = app.app_context()
        cls.app_context.push()
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()
    
    def setUp(self):
        with session_scope() as session:
            session.query(Pessoa).delete()

            # Given / Arrange
            self.url_base = '/pessoas'
            self.nome = 'João'
            self.respostaPost = self.app.post(self.url_base, json={'nome': self.nome})
            self.pessoa_id = self.respostaPost.headers['Location'].split('/')[-1]

    def test_criar_pessoa(self):
        # When / Act - Executado no setUp

        # Then / Assert
        self.assertEqual(self.respostaPost.status_code, 201)
        self.assertIn('Location', self.respostaPost.headers)
    
    def test_criar_pessoa_sem_nome(self):
        # When / Act
        resposta = self.app.post(self.url_base, json={'nome': ''})

        # Then / Assert
        self.assertEqual(resposta.status_code, 422)

    def test_buscar_tudo(self):
        # When / Act
        reposta = self.app.get(self.url_base)
        pessoas = reposta.get_json()

        # Then / Assert
        self.assertEqual(reposta.status_code, 200)
        self.assertEqual(len(pessoas), 1)
        self.assertEqual(pessoas[0]['nome'], self.nome)

    def test_buscar_por_id(self):
        # When / Act
        resposta = self.app.get(f'{self.url_base}/{self.pessoa_id}')

        # Then / Assert
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.get_json()['nome'], self.nome)
    
    def test_buscar_por_id_inexistente(self):
        # When / Act
        resposta = self.app.get(f'{self.url_base}/99999')
        
        # Then / Assert
        self.assertEqual(resposta.status_code, 404)

    def test_atualizar_pessoa(self):
        # Given / Arrange
        nomeAtualizado = 'João Atualizado'

        # When / Act
        resposta = self.app.put(f'{self.url_base}/{self.pessoa_id}', json={'nome': nomeAtualizado})

        # Then / Assert
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.get_json()['nome'], nomeAtualizado)
    
    def test_atualizar_pessoa_inexistente(self):
        # Given / Arrange
        nomeAtualizado = 'João Atualizado'

        # When / Act
        resposta = self.app.put(f'{self.url_base}/99999', json={'nome': nomeAtualizado})

        # Then / Assert
        self.assertEqual(resposta.status_code, 404)

    def test_atualizar_pessoa_sem_nome(self):
        # When / Act
        resposta = self.app.put(f'{self.url_base}/{self.pessoa_id}', json={'nome': ''})

        # Then / Assert
        self.assertEqual(resposta.status_code, 422)

    def test_deletar_pessoa(self):
        # When / Act
        resposta = self.app.delete(f'{self.url_base}/{self.pessoa_id}')
        
        # Then / Assert
        self.assertEqual(resposta.status_code, 204)

    def test_deletar_pessoa_inexistente(self):
        # When / Act
        resposta = self.app.delete(f'{self.url_base}/99999')

        # Then / Assert
        self.assertEqual(resposta.status_code, 404)

if __name__ == '__main__':
    unittest.main()
