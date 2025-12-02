from config import db

class Clinica(db.Model):
    __tablename__ = "clinicas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome
        }
