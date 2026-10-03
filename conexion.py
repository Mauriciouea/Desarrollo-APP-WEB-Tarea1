import os
import pymysql
from dotenv import load_dotenv

# ✅ Cargar el .env con ruta explícita
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))


def obtener_conexion():
    try:
        conexion = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),   # Ahora sí lo leerá
            database=os.getenv('DB_NAME', 'SolucionesDigitales'),
            cursorclass=pymysql.cursors.DictCursor
        )
        return conexion
    except pymysql.Error as err:
        print(f"❌ Error al conectar a la base de datos: {err}")
        return None