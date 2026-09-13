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
    lista_productos = [
        {"nombre": "Consultoría TI", "categoria": "Consultoría", "precio": 250.00, "stock": 15},
        {"nombre": "Diseño de Sitio Web", "categoria": "Diseño", "precio": 480.00, "stock": 8},
        {"nombre": "Licencia Cloud Básica", "categoria": "Infraestructura", "precio": 120.00, "stock": 30},
        {"nombre": "Auditoría de Seguridad", "categoria": "Seguridad", "precio": 350.00, "stock": 5},
        {"nombre": "Desarrollo de App Móvil", "categoria": "Desarrollo", "precio": 900.00, "stock": 3},
    ]
    return render_template("productos.html", productos=lista_productos)


@app.route("/clientes")
def clientes():
    lista_clientes = [
        {"nombre": "Carlos Andrade", "email": "carlos.andrade@mail.com", "telefono": "0991234567"},
        {"nombre": "María Fernanda López", "email": "mflopez@mail.com", "telefono": "0987654321"},
        {"nombre": "Jorge Ramírez", "email": "jramirez@mail.com", "telefono": "0965412378"},
        {"nombre": "Empresa Textilana S.A.", "email": "contacto@textilana.com", "telefono": "0422345678"},
        {'nombre': "Fernando López.", "email": "fernando.lopez@mail.com", "telefono": "0423456789"},
        {'nombre': "Marcos González", "email": "marcos.gonzalez@mail.com", "telefono": "0423456789"}
    ]
    return render_template("clientes.html", clientes=lista_clientes)

#ruta de editar cliente
@app.route('/clientes/editar/<nombre>')
def editar_cliente(nombre):
    # Aquí puedes agregar la lógica para editar un cliente según su ID
    return f'Editar cliente con ID: {nombre} editado exitosamente.'

#ruta para eliminar cliente
@app.route('/clientes/eliminar/<nombre>')
def eliminar_cliente(nombre):
    # Aquí puedes agregar la lógica para eliminar un cliente según su ID
    return f'Eliminar cliente con ID: {nombre} eliminado exitosamente.'


@app.route("/proveedores")
def proveedores():
    lista_proveedores = [
        {"nombre": "TechSupply Cía. Ltda.", "producto": "Equipos informáticos", "contacto": "ventas@techsupply.com"},
        {"nombre": "CloudHost Ecuador", "producto": "Servicios de hosting y nube", "contacto": "soporte@cloudhost.ec"},
        {"nombre": "Insumos de Oficina Rex", "producto": "Suministros de oficina", "contacto": "pedidos@rex.com"},
        {"nombre": "SegurData S.A.", "producto": "Software de ciberseguridad", "contacto": "info@segurdata.com"},
    ]
    return render_template("proveedores.html", proveedores=lista_proveedores)


@app.route("/facturacion")
def facturacion():
    lista_facturas = [
        {"numero": "F001-000123", "cliente": "Carlos Andrade", "fecha": "2026-08-01", "total": 250.00, "estado": "Pagada"},
        {"numero": "F001-000124", "cliente": "María Fernanda López", "fecha": "2026-08-05", "total": 480.00, "estado": "Pendiente"},
        {"numero": "F001-000125", "cliente": "Empresa Textilana S.A.", "fecha": "2026-08-10", "total": 900.00, "estado": "Pagada"},
        {"numero": "F001-000126", "cliente": "Jorge Ramírez", "fecha": "2026-08-13", "total": 120.00, "estado": "Anulada"},
    ]
    return render_template("facturacion.html", facturas=lista_facturas)


if __name__ == "__main__":
    app.run(debug=True)