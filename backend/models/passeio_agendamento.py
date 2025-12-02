from config import db
from datetime import datetime

class PasseioAgendamento(db.Model):
    __tablename__ = "passeios_agendamentos"

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)
    servico = db.Column(db.String(120), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    pet = db.relationship("Pet", backref="passeios_agendamentos")

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "pet_nome": self.pet.nome if self.pet else None,
            "servico": self.servico,
            "data": self.data.isoformat(),
            "created_at": self.created_at.isoformat()
        }
