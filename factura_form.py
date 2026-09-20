from flask import Blueprint, render_template, request, redirect, url_for
from datetime import date
from extensiones import db
from modelos import Factura


factura_form_bp = Blueprint("factura_form", __name__)


# 📋 LISTAR facturas
@factura_form_bp.route("/facturacion")
def facturacion():
    lista_facturas = Factura.query.all()
    return render_template("facturacion.html", facturas=lista_facturas)


# ➕ CREAR factura
@factura_form_bp.route("/facturacion/nuevo", methods=["GET", "POST"])
def nueva_factura():
    if request.method == "POST":
        nueva = Factura(
            numero=request.form.get("numero"),
            cliente=request.form.get("cliente"),
            fecha=request.form.get("fecha"),
            total=float(request.form.get("total", 0)),
            estado=request.form.get("estado")
        )
        db.session.add(nueva)
        db.session.commit()
        return redirect(url_for("factura_form.facturacion"))

    return render_template("formulario_factura.html", factura=None, hoy=date.today().isoformat())


# ✏️ EDITAR factura
@factura_form_bp.route("/facturacion/editar/<int:id>", methods=["GET", "POST"])
def editar_factura(id):
    factura = Factura.query.get_or_404(id)

    if request.method == "POST":
        factura.numero = request.form.get("numero")
        factura.cliente = request.form.get("cliente")
        factura.fecha = request.form.get("fecha")
        factura.total = float(request.form.get("total", 0))
        factura.estado = request.form.get("estado")
        db.session.commit()
        return redirect(url_for("factura_form.facturacion"))

    return render_template("formulario_factura.html", factura=factura, hoy=factura.fecha)


# 🗑️ ELIMINAR factura
@factura_form_bp.route("/facturacion/eliminar/<int:id>", methods=["POST"])
def eliminar_factura(id):
    factura = Factura.query.get_or_404(id)
    db.session.delete(factura)
    db.session.commit()
    return redirect(url_for("factura_form.facturacion"))