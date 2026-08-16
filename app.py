from flask import Flask, render_template

app = Flask(__name__)


# Página principal - SOLO 4 TARJETAS
@app.route("/")
@app.route("/inicio")
def index():
    return render_template("index.html")


# Dashboard - Iniciar Sesión
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# Módulos del Sistema
@app.route("/productos")
def productos():
    return render_template("productos.html")


@app.route("/clientes")
def clientes():
    return render_template("clientes.html")


@app.route("/proveedores")
def proveedores():
    return render_template("proveedores.html")


@app.route("/facturacion")
def facturacion():
    return render_template("facturacion.html")


if __name__ == "__main__":
    app.run(debug=True)