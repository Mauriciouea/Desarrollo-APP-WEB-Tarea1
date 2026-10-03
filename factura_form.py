from flask import Blueprint, render_template, request, redirect, url_for, flash
from datetime import date
from extensiones import db
from modelos import Factura, Producto


factura_form_bp = Blueprint("factura_form", __name__)


@factura_form_bp.route("/facturacion")
def facturacion():
    lista_facturas = Factura.query.all()
    return render_template("facturacion.html", facturas=lista_facturas)


@factura_form_bp.route("/facturacion/nuevo", methods=["GET", "POST"])
def nueva_factura():
    if request.method == "POST":
        producto_id = request.form.get("producto_id")
        cantidad = int(request.form.get("cantidad", 1))
        detalle_extra = request.form.get("detalle", "").strip()

        producto = Producto.query.get(producto_id) if producto_id else None
        if not producto:
            flash("⚠️ Debes seleccionar un producto o servicio.", "danger")
            return redirect(url_for("factura_form.nueva_factura"))

        if producto.stock < cantidad:
            flash(f"⚠️ Stock insuficiente. Solo hay {producto.stock} unidades de '{producto.nombre}'.", "danger")
            return redirect(url_for("factura_form.nueva_factura"))

        total = producto.precio * cantidad

        detalle = producto.nombre
        if detalle_extra:
            detalle += f" — {detalle_extra}"

        nueva = Factura(
            numero=request.form.get("numero"),
            cliente=request.form.get("cliente"),
            fecha=request.form.get("fecha"),
            total=total,
            estado=request.form.get("estado"),
            detalle=detalle,
            producto_id=producto.id,
            cantidad=cantidad
        )
        db.session.add(nueva)

        # Descontar stock
        producto.stock -= cantidad
        db.session.commit()

        flash(f"✅ Factura creada. Stock de '{producto.nombre}' reducido a {producto.stock} unidades.", "success")
        return redirect(url_for("factura_form.facturacion"))

    # GET: mostramos formulario con lista de productos
    productos = Producto.query.filter(Producto.stock > 0).all()

    # ✅ Número automático
    ultima_factura = Factura.query.order_by(Factura.id.desc()).first()
    if ultima_factura:
        try:
            partes = ultima_factura.numero.split('-')
            numero_actual = int(partes[1])
            siguiente_numero = f"F001-{numero_actual + 1:06d}"
        except:
            siguiente_numero = "F001-000001"
    else:
        siguiente_numero = "F001-000001"

    return render_template(
        "formulario_factura.html",
        factura=None,
        hoy=date.today().isoformat(),
        productos=productos,
        siguiente_numero=siguiente_numero
    )


@factura_form_bp.route("/facturacion/editar/<int:id>", methods=["GET", "POST"])
def editar_factura(id):
    factura = Factura.query.get_or_404(id)

    if request.method == "POST":
        producto_id = request.form.get("producto_id")
        cantidad_nueva = int(request.form.get("cantidad", 1))
        detalle_extra = request.form.get("detalle", "").strip()

        producto_nuevo = Producto.query.get(producto_id) if producto_id else None
        if not producto_nuevo:
            flash("⚠️ Debes seleccionar un producto o servicio.", "danger")
            return redirect(url_for("factura_form.editar_factura", id=id))

        producto_viejo = Producto.query.get(factura.producto_id) if factura.producto_id else None
        if producto_viejo:
            producto_viejo.stock += factura.cantidad

        if producto_nuevo.stock < cantidad_nueva:
            if producto_viejo:
                producto_viejo.stock -= factura.cantidad
            flash(f"⚠️ Stock insuficiente. Solo hay {producto_nuevo.stock} unidades.", "danger")
            return redirect(url_for("factura_form.editar_factura", id=id))

        producto_nuevo.stock -= cantidad_nueva

        factura.numero = request.form.get("numero")
        factura.cliente = request.form.get("cliente")
        factura.fecha = request.form.get("fecha")
        factura.estado = request.form.get("estado")
        factura.producto_id = producto_nuevo.id
        factura.cantidad = cantidad_nueva
        factura.total = producto_nuevo.precio * cantidad_nueva

        detalle = producto_nuevo.nombre
        if detalle_extra:
            detalle += f" — {detalle_extra}"
        factura.detalle = detalle

        db.session.commit()
        flash("✅ Factura actualizada correctamente.", "success")
        return redirect(url_for("factura_form.facturacion"))

    productos = Producto.query.all()
    return render_template(
        "formulario_factura.html",
        factura=factura,
        hoy=factura.fecha,
        productos=productos,
        siguiente_numero=factura.numero
    )


@factura_form_bp.route("/facturacion/eliminar/<int:id>", methods=["POST"])
def eliminar_factura(id):
    factura = Factura.query.get_or_404(id)

    if factura.producto_id:
        producto = Producto.query.get(factura.producto_id)
        if producto:
            producto.stock += factura.cantidad

    db.session.delete(factura)
    db.session.commit()
    flash("✅ Factura eliminada. Stock restaurado.", "info")
    return redirect(url_for("factura_form.facturacion"))


@factura_form_bp.route("/facturacion/ver/<int:id>")
def ver_factura(id):
    factura = Factura.query.get_or_404(id)

    producto = None
    if factura.producto_id:
        producto = Producto.query.get(factura.producto_id)
    if not producto and factura.detalle:
        producto = Producto.query.filter_by(nombre=factura.detalle).first()
    if not producto:
        producto = Producto.query.filter_by(precio=factura.total).first()
    if producto and not factura.detalle:
        factura.detalle = producto.nombre

    return render_template("factura_detalle.html", factura=factura, producto=producto)