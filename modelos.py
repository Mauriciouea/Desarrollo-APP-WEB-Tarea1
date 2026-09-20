from extensiones import db


class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(100))
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)


class Proveedor(db.Model):
    __tablename__ = 'proveedores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    producto = db.Column(db.String(100))
    contacto = db.Column(db.String(100))


class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))          # ✅ Agregada
    telefono = db.Column(db.String(20))        # ✅ Agregada


class Factura(db.Model):
    __tablename__ = 'facturas'
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(50), nullable=False)
    cliente = db.Column(db.String(100))        # ✅ Agregada
    fecha = db.Column(db.String(20))           # ✅ Agregada (como texto para simplificar)
    total = db.Column(db.Float, default=0.0)   # ✅ Agregada
    estado = db.Column(db.String(20))          # ✅ Agregada