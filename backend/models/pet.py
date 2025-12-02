from config import db

class Pet(db.Model):
    __tablename__ = 'pets'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    idade = db.Column(db.Integer)
    especie = db.Column(db.String(50))
    sexo = db.Column(db.Enum('Macho', 'Fêmea'), default='Macho')
    dono_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    foto = db.Column(db.String(255))
    porte = db.Column(db.String(50))
    descricao = db.Column(db.String(500))
    saude = db.Column(db.String(500))

