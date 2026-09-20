import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:

    SECRET_KEY = "clave-secreta-SolucionesDigitales"

    # ⚠️ Cambia 'TU_CONTRASEÑA' por la contraseña real de tu usuario root de MySQL
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:MarceMao%24H1920.@localhost/SolucionesDigitales"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False