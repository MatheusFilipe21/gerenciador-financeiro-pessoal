from database import Base
from sqlalchemy import Column, Integer, String, Enum
from enums import TipoCategoria

class Categoria(Base):
    __tablename__ = 'categorias'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    tipo = Column(Enum(TipoCategoria), nullable=False)

    def __init__(self, nome, tipo):
        self.nome = nome
        self.tipo = tipo

    def __repr__(self):
        return f'Categoria: Id: {self.id}, Nome: {self.nome}, Tipo: {self.tipo}'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'tipo': self.tipo.value
        }
