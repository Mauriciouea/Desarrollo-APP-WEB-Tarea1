from flask import Blueprint, render_template, request, redirect, url_for
from datetime import date

factura_form_bp = Blueprint("factura_form", __name__)

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

    return render_template("formulario_factura.html", factura=None, hoy=date.today().isoformat())


@factura_form_bp.route("/facturacion/editar/<numero>", methods=["GET", "POST"])
def editar_factura(numero):
    factura = next((f for f in lista_facturas if f["numero"] == numero), None)

    if factura is None:
        return f'Factura "{numero}" no encontrada.', 404

    if request.method == "POST":
        factura["numero"] = request.form.get("numero")
        factura["cliente"] = request.form.get("cliente")
        factura["fecha"] = request.form.get("fecha")
        factura["total"] = float(request.form.get("total", 0))
        factura["estado"] = request.form.get("estado")
        return redirect(url_for("factura_form.facturacion"))

    return render_template("formulario_factura.html", factura=factura, hoy=factura["fecha"])