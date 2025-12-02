from config import db

class Agendamento(db.Model):
    __tablename__ = "agendamentos"

    pet = db.relationship("Pet", backref="agendamentos")
    
    id = db.Column(db.Integer, primary_key=True)
    
    clinica_id = db.Column(db.Integer, db.ForeignKey("clinicas.id"), nullable=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)

    data_agendamento = db.Column(db.DateTime, nullable=False)
    descricao = db.Column(db.String(200), nullable=False)

    criado_em = db.Column(db.DateTime, server_default=db.func.now())

    # relacionamentos opcionais
    pet = db.relationship("Pet", backref="agendamentos", lazy=True)
    clinica = db.relationship("Clinica", backref="agendamentos", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "clinica_id": self.clinica_id,
            "pet_id": self.pet_id,
            "data_agendamento": self.data_agendamento.isoformat(),
            "descricao": self.descricao,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }
