from flask import Blueprint, render_template, request, redirect, url_for

producto_form_bp = Blueprint("producto_form", __name__)

lista_productos = [
    {"nombre": "Consultoría TI", "categoria": "Consultoría", "precio": 250.00, "stock": 15},
    {"nombre": "Diseño de Sitio Web", "categoria": "Diseño", "precio": 480.00, "stock": 8},
    {"nombre": "Licencia Cloud Básica", "categoria": "Infraestructura", "precio": 120.00, "stock": 30},
    {"nombre": "Auditoría de Seguridad", "categoria": "Seguridad", "precio": 350.00, "stock": 5},
    {"nombre": "Desarrollo de App Móvil", "categoria": "Desarrollo", "precio": 900.00, "stock": 3},
]


@producto_form_bp.route("/productos")
def productos():
    return render_template("productos.html", productos=lista_productos)


@producto_form_bp.route("/productos/nuevo", methods=["GET", "POST"])
def nuevo_producto():
    if request.method == "POST":
        nuevo = {
            "nombre": request.form.get("nombre"),
            "categoria": request.form.get("categoria"),
            "precio": float(request.form.get("precio", 0)),
            "stock": int(request.form.get("stock", 0)),
        }
        lista_productos.append(nuevo)
        return redirect(url_for("producto_form.productos"))

    return render_template("formulario_producto.html", producto=None)


@producto_form_bp.route("/productos/editar/<nombre>", methods=["GET", "POST"])
def editar_producto(nombre):
    producto = next((p for p in lista_productos if p["nombre"] == nombre), None)

    if producto is None:
        return f'Producto "{nombre}" no encontrado.', 404

    if request.method == "POST":
        producto["nombre"] = request.form.get("nombre")
        producto["categoria"] = request.form.get("categoria")
        producto["precio"] = float(request.form.get("precio", 0))
        producto["stock"] = int(request.form.get("stock", 0))
        return redirect(url_for("producto_form.productos"))

    return render_template("formulario_producto.html", producto=producto)