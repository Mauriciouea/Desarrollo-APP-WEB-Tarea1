from flask import Flask, render_template, request, redirect, url_for
from producto_form import producto_form_bp
from proveedor_form import proveedor_form_bp
from cliente_form import cliente_form_bp
from factura_form import factura_form_bp

app = Flask(__name__)                              # 1️⃣ Primero se crea 'app'
app.register_blueprint(producto_form_bp)           # 2️⃣ Después se registran los blueprints
app.register_blueprint(proveedor_form_bp)
app.register_blueprint(cliente_form_bp)
app.register_blueprint(factura_form_bp)

# Página principal - SOLO 4 TARJETAS
@app.route("/")
@app.route("/inicio")
def index():
    return render_template("index.html")


# Dashboard - Iniciar Sesión
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# ⚠️ La ruta "/productos" (listar) y "/productos/nuevo" (agregar) viven en producto_form.py

# ruta para eliminar producto
@app.route('/productos/eliminar/<nombre>')
def eliminar_producto(nombre):
    return f'Eliminar producto con ID: {nombre} eliminado exitosamente.'


# ruta de editar cliente
@app.route('/clientes/editar/<nombre>')
def editar_cliente(nombre):
    return f'Editar cliente con ID: {nombre} editado exitosamente.'

# ruta para eliminar cliente
@app.route('/clientes/eliminar/<nombre>')
def eliminar_cliente(nombre):
    return f'Eliminar cliente con ID: {nombre} eliminado exitosamente.'


# ⚠️ La ruta "/proveedores" (listar) y "/proveedores/nuevo" (agregar) viven en proveedor_form.py

# ruta para editar proveedor
@app.route('/proveedores/editar/<nombre>')
def editar_proveedor(nombre):
    return f'Editar proveedor con ID: {nombre} editado exitosamente.'

# ruta para eliminar proveedor
@app.route('/proveedores/eliminar/<nombre>')
def eliminar_proveedor(nombre):
    return f'Eliminar proveedor con ID: {nombre} eliminado exitosamente.'

# ruta para editar factura
@app.route('/facturacion/editar/<numero>')
def editar_factura(numero):
    return f'Editar factura con número: {numero} editada exitosamente.'

# ruta para eliminar factura
@app.route('/facturacion/eliminar/<numero>')
def eliminar_factura(numero):
    return f'Eliminar factura con número: {numero} eliminada exitosamente.'


if __name__ == "__main__":
    app.run(debug=True)