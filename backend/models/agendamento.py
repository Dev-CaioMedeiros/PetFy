from config import db

class Agendamento(db.Model):
    __tablename__ = "agendamentos"

    id = db.Column(db.Integer, primary_key=True)
    
    clinica_id = db.Column(db.Integer, db.ForeignKey("clinicas.id"), nullable=True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)

    data_agendamento = db.Column(db.DateTime, nullable=False)
    descricao = db.Column(db.String(200), nullable=False)

    # 🔹 NOVO: observações da consulta
    observacoes = db.Column(db.Text, nullable=True)

    criado_em = db.Column(db.DateTime, server_default=db.func.now())

    # relacionamentos
    pet = db.relationship("Pet", backref="agendamentos", lazy=True)
    clinica = db.relationship("Clinica", backref="agendamentos", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "clinica_id": self.clinica_id,
            "clinica_nome": self.clinica.nome if self.clinica else None,
            "pet_id": self.pet_id,
            "pet_nome": self.pet.nome if self.pet else None,
            "data": self.data_agendamento.isoformat(),
            "descricao": self.descricao,
            "observacoes": self.observacoes,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }
