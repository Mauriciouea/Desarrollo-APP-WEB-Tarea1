from flask import Blueprint, render_template, request, redirect, url_for
from extensiones import db
from modelos import Proveedor


proveedor_form_bp = Blueprint("proveedor_form", __name__)


@proveedor_form_bp.route("/proveedores")
def proveedores():
    lista_proveedores = Proveedor.query.all()
    return render_template("proveedores.html", proveedores=lista_proveedores)


@proveedor_form_bp.route("/proveedores/nuevo", methods=["GET", "POST"])
def nuevo_proveedor():
    if request.method == "POST":
        nuevo = Proveedor(
            nombre=request.form.get("nombre"),
            producto=request.form.get("producto"),
            contacto=request.form.get("contacto")
        )
        db.session.add(nuevo)
        db.session.commit()
        return redirect(url_for("proveedor_form.proveedores"))

    return render_template("formulario_proveedor.html", proveedor=None)


@proveedor_form_bp.route("/proveedores/editar/<int:id>", methods=["GET", "POST"])
def editar_proveedor(id):
    proveedor = Proveedor.query.get_or_404(id)

    if request.method == "POST":
        proveedor.nombre = request.form.get("nombre")
        proveedor.producto = request.form.get("producto")
        proveedor.contacto = request.form.get("contacto")
        db.session.commit()
        return redirect(url_for("proveedor_form.proveedores"))

    return render_template("formulario_proveedor.html", proveedor=proveedor)


@proveedor_form_bp.route("/proveedores/eliminar/<int:id>", methods=["POST"])
def eliminar_proveedor(id):
    proveedor = Proveedor.query.get_or_404(id)
    db.session.delete(proveedor)
    db.session.commit()
    return redirect(url_for("proveedor_form.proveedores"))