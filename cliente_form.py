from flask import Blueprint, render_template, request, redirect, url_for

cliente_form_bp = Blueprint("cliente_form", __name__)

# Lista de clientes (vive aquí para que tanto el listado como el formulario la compartan)
lista_clientes = [
    {"id": 1, "nombre": "Carlos Andrade", "email": "carlos.andrade@mail.com", "telefono": "0991234567"},
    {"id": 2, "nombre": "María Fernanda López", "email": "mflopez@mail.com", "telefono": "0987654321"},
    {"id": 3, "nombre": "Jorge Ramírez", "email": "jramirez@mail.com", "telefono": "0965412378"},
    {"id": 4, "nombre": "Empresa Textilana S.A.", "email": "contacto@textilana.com", "telefono": "0422345678"},
    {"id": 5, "nombre": "Fernando López.", "email": "fernando.lopez@mail.com", "telefono": "0423456789"},
    {"id": 6, "nombre": "Marcos González", "email": "marcos.gonzalez@mail.com", "telefono": "0423456789"},
]


@cliente_form_bp.route("/clientes")
def clientes():
    return render_template("clientes.html", clientes=lista_clientes)


@cliente_form_bp.route("/clientes/nuevo", methods=["GET", "POST"])
def nuevo_cliente():
    if request.method == "POST":
        nuevo = {
            "id": len(lista_clientes) + 1,
            "nombre": request.form.get("nombre"),
            "email": request.form.get("email"),
            "telefono": request.form.get("telefono"),
        }
        lista_clientes.append(nuevo)
        return redirect(url_for("cliente_form.clientes"))

    return render_template("formulario_cliente.html")