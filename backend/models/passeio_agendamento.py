# models/passeio_agendamento.py
from config import db
from datetime import datetime

class PasseioAgendamento(db.Model):
    __tablename__ = "passeios_agendamentos"

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)

    servico = db.Column(db.String(120), nullable=False)
    data = db.Column(db.DateTime, nullable=False)

    # novos campos opcionais
    observacoes = db.Column(db.Text, nullable=True)
    walker_name = db.Column(db.String(200), nullable=True)   # quem vai passear
    local = db.Column(db.String(255), nullable=True)         # local do passeio
    clinica_id = db.Column(db.Integer, nullable=True)        # opcional (caso queira vincular)
    clinica_nome = db.Column(db.String(255), nullable=True)  # opcional, só para exibir

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relação com Pet (para pegar nome/foto)
    pet = db.relationship("Pet", backref="passeios_agendamentos")

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "pet_nome": self.pet.nome if self.pet else None,
            "servico": self.servico,
            "data": self.data.isoformat() if self.data else None,
            "observacoes": self.observacoes,
            "walker_name": self.walker_name,
            "local": self.local,
            "clinica_id": self.clinica_id,
            "clinica_nome": self.clinica_nome,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
