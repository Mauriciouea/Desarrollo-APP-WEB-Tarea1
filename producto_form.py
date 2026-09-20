from flask import Blueprint, render_template, request, redirect, url_for
from extensiones import db
from modelos import Producto


producto_form_bp = Blueprint("producto_form", __name__)


# 📋 LISTAR productos (desde la base de datos)
@producto_form_bp.route("/productos")
def productos():
    lista_productos = Producto.query.all()
    return render_template("productos.html", productos=lista_productos)


# ➕ CREAR nuevo producto
@producto_form_bp.route("/productos/nuevo", methods=["GET", "POST"])
def nuevo_producto():
    if request.method == "POST":
        nuevo = Producto(
            nombre=request.form.get("nombre"),
            categoria=request.form.get("categoria"),
            precio=float(request.form.get("precio", 0)),
            stock=int(request.form.get("stock", 0))
        )
        db.session.add(nuevo)
        db.session.commit()
        return redirect(url_for("producto_form.productos"))

    return render_template("formulario_producto.html", producto=None)


# ✏️ EDITAR producto
@producto_form_bp.route("/productos/editar/<int:id>", methods=["GET", "POST"])
def editar_producto(id):
    producto = Producto.query.get_or_404(id)

    if request.method == "POST":
        producto.nombre = request.form.get("nombre")
        producto.categoria = request.form.get("categoria")
        producto.precio = float(request.form.get("precio", 0))
        producto.stock = int(request.form.get("stock", 0))
        db.session.commit()
        return redirect(url_for("producto_form.productos"))

    return render_template("formulario_producto.html", producto=producto)


# 🗑️ ELIMINAR producto
@producto_form_bp.route("/productos/eliminar/<int:id>", methods=["POST"])
def eliminar_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return redirect(url_for("producto_form.productos"))