from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Conta(Base):
    __tablename__ = 'contas'
    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    pessoa_id = Column(Integer, ForeignKey('pessoas.id'), nullable=False)

    pessoa = relationship("Pessoa", back_populates="contas")

    def __init__(self, nome, pessoa_id):
        self.nome = nome
        self.pessoa_id = pessoa_id

    def __repr__(self):
        return f'Conta: Id: {self.id}, Nome: {self.nome}, Pessoa Id: {self.pessoa_id}'

    def to_dict(self, incluir_pessoa=True):
        conta_dict = {
            'id': self.id,
            'nome': self.nome
        }

        if incluir_pessoa and self.pessoa:
            conta_dict['pessoa'] = self.pessoa.to_dict(incluir_contas=False)
        
        return conta_dict
