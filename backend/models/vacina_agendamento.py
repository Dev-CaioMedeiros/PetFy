# models/vacina_agendamento.py
from datetime import datetime
from config import db

class VacinaAgendamento(db.Model):
    __tablename__ = "vacinas_agendamentos"

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)
    vacina = db.Column(db.String(120), nullable=False)

    # opcional: clinica
    clinica_id = db.Column(db.Integer, db.ForeignKey("clinicas.id"), nullable=True)
    clinica_nome = db.Column(db.String(255), nullable=True)

    data = db.Column(db.DateTime, nullable=False)
    observacoes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relação com Pet (para pegar nome/foto)
    pet = db.relationship("Pet", backref="vacinas_agendamentos")
    clinica = db.relationship("Clinica", backref="vacinas_agendamentos", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "pet_nome": self.pet.nome if self.pet else None,
            "vacina": self.vacina,
            "clinica_id": self.clinica_id,
            "clinica_nome": self.clinica_nome or (self.clinica.nome if self.clinica else None),
            "data": self.data.isoformat() if self.data else None,
            "observacoes": self.observacoes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
