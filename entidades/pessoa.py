from database import Base
from sqlalchemy import Column, Integer, String

class Pessoa(Base):
    __tablename__ = 'pessoas'
    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)

    def __init__(self, nome):
        self.nome = nome

    def __repr__(self):
        return f'Pessoa: Id: {self.id}, Nome: {self.nome}'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome
        }
