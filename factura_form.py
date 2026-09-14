from flask import Blueprint, render_template, request, redirect, url_for
from datetime import date

factura_form_bp = Blueprint("factura_form", __name__)

# Lista de facturas (vive aquí para que tanto el listado como el formulario la compartan)
lista_facturas = [
    {"numero": "F001-000123", "cliente": "Carlos Andrade", "fecha": "2026-08-01", "total": 250.00, "estado": "Pagada"},
    {"numero": "F001-000124", "cliente": "María Fernanda López", "fecha": "2026-08-05", "total": 480.00, "estado": "Pendiente"},
    {"numero": "F001-000125", "cliente": "Empresa Textilana S.A.", "fecha": "2026-08-10", "total": 900.00, "estado": "Pagada"},
    {"numero": "F001-000126", "cliente": "Jorge Ramírez", "fecha": "2026-08-13", "total": 120.00, "estado": "Anulada"},
]


@factura_form_bp.route("/facturacion")
def facturacion():
    return render_template("facturacion.html", facturas=lista_facturas)


@factura_form_bp.route("/facturacion/nuevo", methods=["GET", "POST"])
def nueva_factura():
    if request.method == "POST":
        nueva = {
            "numero": request.form.get("numero"),
            "cliente": request.form.get("cliente"),
            "fecha": request.form.get("fecha"),
            "total": float(request.form.get("total", 0)),
            "estado": request.form.get("estado"),
        }
        lista_facturas.append(nueva)
        return redirect(url_for("factura_form.facturacion"))

    return render_template("formulario_facturacion.html", hoy=date.today().isoformat())