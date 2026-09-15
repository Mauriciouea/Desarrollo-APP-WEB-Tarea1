from flask import Blueprint, render_template, request, redirect, url_for

proveedor_form_bp = Blueprint("proveedor_form", __name__)

lista_proveedores = [
    {"nombre": "TechSupply Cía. Ltda.", "producto": "Equipos informáticos", "contacto": "ventas@techsupply.com"},
    {"nombre": "CloudHost Ecuador", "producto": "Servicios de hosting y nube", "contacto": "soporte@cloudhost.ec"},
    {"nombre": "Insumos de Oficina Rex", "producto": "Suministros de oficina", "contacto": "pedidos@rex.com"},
    {"nombre": "SegurData S.A.", "producto": "Software de ciberseguridad", "contacto": "info@segurdata.com"},
]


@proveedor_form_bp.route("/proveedores")
def proveedores():
    return render_template("proveedores.html", proveedores=lista_proveedores)


@proveedor_form_bp.route("/proveedores/nuevo", methods=["GET", "POST"])
def nuevo_proveedor():
    if request.method == "POST":
        nuevo = {
            "nombre": request.form.get("nombre"),
            "producto": request.form.get("producto"),
            "contacto": request.form.get("contacto"),
        }
        lista_proveedores.append(nuevo)
        return redirect(url_for("proveedor_form.proveedores"))

    return render_template("formulario_proveedor.html", proveedor=None)


@proveedor_form_bp.route("/proveedores/editar/<nombre>", methods=["GET", "POST"])
def editar_proveedor(nombre):
    proveedor = next((p for p in lista_proveedores if p["nombre"] == nombre), None)

    if proveedor is None:
        return f'Proveedor "{nombre}" no encontrado.', 404

    if request.method == "POST":
        proveedor["nombre"] = request.form.get("nombre")
        proveedor["producto"] = request.form.get("producto")
        proveedor["contacto"] = request.form.get("contacto")
        return redirect(url_for("proveedor_form.proveedores"))

    return render_template("formulario_proveedor.html", proveedor=proveedor)