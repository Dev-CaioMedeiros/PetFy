from config import db
from datetime import datetime

class PetShopAgendamento(db.Model):
    __tablename__ = "petshop_agendamentos"

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)

    # nome/identificador do serviço (ex: "Banho simples")
    servico = db.Column(db.String(120), nullable=False)

    # opcional: ligar ao id da clínica (caso use várias clínicas/filiais)
    clinica_id = db.Column(db.Integer, db.ForeignKey("clinicas.id"), nullable=True)
    # salvar o nome da clínica no próprio registro (facilita leitura sem join)
    clinica_nome = db.Column(db.String(255), nullable=True)

    data = db.Column(db.DateTime, nullable=False)
    observacoes = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relação com Pet (e opcional Clinica se quiser depois)
    pet = db.relationship("Pet", backref="petshop_agendamentos")
    clinica = db.relationship("Clinica", backref="petshop_agendamentos", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "pet_nome": self.pet.nome if self.pet else None,
            "servico": self.servico,
            "clinica_id": self.clinica_id,
            "clinica_nome": self.clinica_nome or (self.clinica.nome if self.clinica else None),
            "data": self.data.isoformat() if self.data else None,
            "observacoes": self.observacoes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
