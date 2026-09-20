from flask import Blueprint, render_template, request, redirect, url_for
from extensiones import db
from modelos import Cliente


cliente_form_bp = Blueprint("cliente_form", __name__)


# 📋 LISTAR clientes
@cliente_form_bp.route("/clientes")
def clientes():
    lista_clientes = Cliente.query.all()
    return render_template("clientes.html", clientes=lista_clientes)


# ➕ CREAR cliente
@cliente_form_bp.route("/clientes/nuevo", methods=["GET", "POST"])
def nuevo_cliente():
    if request.method == "POST":
        nuevo = Cliente(
            nombre=request.form.get("nombre"),
            email=request.form.get("email"),
            telefono=request.form.get("telefono")
        )
        db.session.add(nuevo)
        db.session.commit()
        return redirect(url_for("cliente_form.clientes"))

    return render_template("formulario_cliente.html", cliente=None)


# ✏️ EDITAR cliente
@cliente_form_bp.route("/clientes/editar/<int:id>", methods=["GET", "POST"])
def editar_cliente(id):
    cliente = Cliente.query.get_or_404(id)

    if request.method == "POST":
        cliente.nombre = request.form.get("nombre")
        cliente.email = request.form.get("email")
        cliente.telefono = request.form.get("telefono")
        db.session.commit()
        return redirect(url_for("cliente_form.clientes"))

    return render_template("formulario_cliente.html", cliente=cliente)


# 🗑️ ELIMINAR cliente
@cliente_form_bp.route("/clientes/eliminar/<int:id>", methods=["POST"])
def eliminar_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    db.session.delete(cliente)
    db.session.commit()
    return redirect(url_for("cliente_form.clientes"))