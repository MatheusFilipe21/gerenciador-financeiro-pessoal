from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Pessoa(Base):
    __tablename__ = 'pessoas'
    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)

    contas = relationship("Conta", back_populates="pessoa", cascade="all, delete-orphan")

    def __init__(self, nome):
        self.nome = nome

    def __repr__(self):
        return f'Pessoa: Id: {self.id}, Nome: {self.nome}'
    
    def to_dict(self, incluir_contas=True):
        pessoa_dict = {
            'id': self.id,
            'nome': self.nome
        }

        if incluir_contas and self.contas:
            pessoa_dict['contas'] = [conta.to_dict(incluir_pessoa=False) for conta in self.contas]

        return pessoa_dict
