import unittest
from entidades.pessoa import Pessoa

class PessoaTeste(unittest.TestCase):
    
    def setUp(self):
        # Given / Arrange
        self.nome = 'João'
        self.pessoa = Pessoa(nome=self.nome)

    def test_criacao_pessoa(self):
        # When / Act - Executado no setUp

        # Then / Assert
        self.assertEqual(self.pessoa.nome, self.nome)
        self.assertIsNone(self.pessoa.id)
    
    def test_to_dict(self):
        # Given / Arrange
        self.pessoa.id = 1
        dict_esperado = {'id': self.pessoa.id, 'nome': self.pessoa.nome}

        # When / Act & Then / Assert
        self.assertEqual(self.pessoa.to_dict(), dict_esperado)
    
    def test_repr(self):
        # Given / Arrange
        self.pessoa.id = 1
        repr_esperado = f'Pessoa: Id: {self.pessoa.id}, Nome: {self.pessoa.nome}'
        
        # When / Act & Then / Assert
        self.assertEqual(repr(self.pessoa), repr_esperado)

if __name__ == '__main__':
    unittest.main()
