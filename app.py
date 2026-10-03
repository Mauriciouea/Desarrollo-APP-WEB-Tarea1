from flask import Flask, render_template, request, redirect, url_for
from config import Config
from extensiones import db
from modelos import Producto, Proveedor, Cliente, Factura
from producto_form import producto_form_bp
from proveedor_form import proveedor_form_bp
from cliente_form import cliente_form_bp
from factura_form import factura_form_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

# Registrar blueprints
app.register_blueprint(producto_form_bp)
app.register_blueprint(proveedor_form_bp)
app.register_blueprint(cliente_form_bp)
app.register_blueprint(factura_form_bp)


# 🏠 Página principal
@app.route("/")
@app.route("/inicio")
def index():
    return render_template("index.html")


# 📊 Dashboard
@app.route('/')
def index_redirect():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


# 🧩 Menú de gestión (4 cards)
@app.route('/menu')
def menu():
    return render_template('menu.html')


if __name__ == '__main__':
    app.run(debug=True)