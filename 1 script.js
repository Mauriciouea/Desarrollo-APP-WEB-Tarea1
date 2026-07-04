/**
 * ==============================================
 * SISTEMA DE ADMINISTRACIÓN - AUTENTICACIÓN + GESTIÓN DE SERVICIOS
 * ==============================================
 * 
 * Módulos:
 * 1. Autenticación (Login + Registro de Usuario)
 * 2. Gestión de Servicios (CRUD con validaciones)
 */

// ==============================================
// 1. DOM ELEMENTS - AUTENTICACIÓN
// ==============================================
const btnIniciarSesion = document.getElementById('btnIniciarSesion');
const btnRegistrarse = document.getElementById('btnRegistrarse');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const btnCerrarSesionContainer = document.getElementById('btnCerrarSesionContainer');
const nombreUsuario = document.getElementById('nombreUsuario');
const mensajeSesion = document.getElementById('mensajeSesion');
const mensajeSesionTexto = document.getElementById('mensajeSesionTexto');

// ==============================================
// 2. DOM ELEMENTS - GESTIÓN DE SERVICIOS
// ==============================================
const formRegistro = document.getElementById('formRegistro');
const nombreServicio = document.getElementById('nombreServicio');
const descripcionServicio = document.getElementById('descripcionServicio');
const categoriaServicio = document.getElementById('categoriaServicio');
const nombreContador = document.getElementById('nombreContador');
const descripcionContador = document.getElementById('descripcionContador');
const listaRegistros = document.getElementById('listaRegistros');
const contadorRegistros = document.getElementById('contadorRegistros');
const mensajeVacio = document.getElementById('mensajeVacio');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeExitoTexto = document.getElementById('mensajeExitoTexto');
const btnEliminarTodas = document.getElementById('btnEliminarTodas');

// ==============================================
// 3. DOM ELEMENTS - LOGIN
// ==============================================
const loginForm = document.getElementById('loginForm');
const loginUsuario = document.getElementById('loginUsuario');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const loginErrorTexto = document.getElementById('loginErrorTexto');

// ==============================================
// 4. DOM ELEMENTS - REGISTRO DE USUARIO
// ==============================================
const registroForm = document.getElementById('registroForm');
const regUsuario = document.getElementById('regUsuario');
const regEmail = document.getElementById('regEmail');
const regNombre = document.getElementById('regNombre');
const regTelefono = document.getElementById('regTelefono');
const regPassword = document.getElementById('regPassword');
const regPasswordConfirm = document.getElementById('regPasswordConfirm');
const regUsuarioContador = document.getElementById('regUsuarioContador');
const registroExito = document.getElementById('registroExito');
const registroExitoTexto = document.getElementById('registroExitoTexto');

// Requisitos de contraseña
const reqLongitud = document.getElementById('reqLongitud');
const reqMayuscula = document.getElementById('reqMayuscula');
const reqNumero = document.getElementById('reqNumero');
const reqEspecial = document.getElementById('reqEspecial');

// ==============================================
// 5. ESTADO DE LA APLICACIÓN
// ==============================================
let servicios = [];
let idCounter = 1;

// Usuario actual (simulación)
let usuarioActual = null;

// Base de datos de usuarios (simulada)
let usuarios = [];

// ==============================================
// 6. GESTIÓN DE AUTENTICACIÓN
// ==============================================

/**
 * Inicia sesión del usuario
 */
function iniciarSesion(usuario, password) {
    const usuarioEncontrado = usuarios.find(u =>
        u.usuario === usuario && u.password === password
    );

    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        nombreUsuario.textContent = usuarioEncontrado.nombreCompleto || usuarioEncontrado.usuario;
        
        // Ocultar mensaje de sesión
        mensajeSesion.classList.add('d-none');
        
        // Mostrar botón cerrar sesión
        btnIniciarSesion.classList.add('d-none');
        btnRegistrarse.classList.add('d-none');
        btnCerrarSesionContainer.classList.remove('d-none');
        
        // Cerrar modal
        const modalLogin = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
        if (modalLogin) modalLogin.hide();
        
        // Limpiar errores
        loginError.classList.add('d-none');
        
        return true;
    } else {
        loginErrorTexto.textContent = 'Usuario o contraseña incorrectos.';
        loginError.classList.remove('d-none');
        return false;
    }
}

/**
 * Cierra sesión del usuario
 */
function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        usuarioActual = null;
        nombreUsuario.textContent = 'Invitado';
        
        btnIniciarSesion.classList.remove('d-none');
        btnRegistrarse.classList.remove('d-none');
        btnCerrarSesionContainer.classList.add('d-none');
        
        // Mostrar mensaje de sesión
        mensajeSesionTexto.textContent = 'Debes iniciar sesión para gestionar servicios.';
        mensajeSesion.classList.remove('d-none');
        
        // Limpiar servicios del usuario
        servicios = [];
        renderizarServicios();
    }
}

/**
 * Registra un nuevo usuario
 */
function registrarUsuario(usuario, email, nombreCompleto, telefono, password) {
    // Verificar si el usuario ya existe
    if (usuarios.find(u => u.usuario === usuario)) {
        registroExitoTexto.textContent = '⚠️ El nombre de usuario ya está en uso.';
        registroExito.className = 'alert alert-danger mt-3';
        registroExito.classList.remove('d-none');
        return false;
    }

    // Verificar si el email ya está registrado
    if (usuarios.find(u => u.email === email)) {
        registroExitoTexto.textContent = '⚠️ El correo electrónico ya está registrado.';
        registroExito.className = 'alert alert-danger mt-3';
        registroExito.classList.remove('d-none');
        return false;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        usuario,
        email,
        nombreCompleto,
        telefono: telefono || '',
        password
    };

    usuarios.push(nuevoUsuario);
    
    // Mostrar mensaje de éxito
    registroExitoTexto.textContent = `✅ Perfil creado exitosamente. ¡Bienvenido ${nombreCompleto}!`;
    registroExito.className = 'alert alert-success mt-3';
    registroExito.classList.remove('d-none');
    
    // Limpiar formulario
    registroForm.reset();
    limpiarValidacionesRegistro();
    
    return true;
}

// ==============================================
// 7. VALIDACIONES DEL FORMULARIO DE SERVICIOS
// ==============================================

/**
 * Valida un campo específico
 */
function validarCampo(input, tipo, valor, feedbackElement) {
    let esValido = false;
    let mensaje = '';

    switch (tipo) {
        case 'nombre':
            const nombreTrim = valor.trim();
            if (nombreTrim.length === 0) {
                mensaje = 'El nombre del servicio es obligatorio.';
            } else if (nombreTrim.length < 3) {
                mensaje = 'El nombre debe tener al menos 3 caracteres.';
            } else if (nombreTrim.length > 50) {
                mensaje = 'El nombre no puede exceder los 50 caracteres.';
            } else {
                esValido = true;
            }
            break;

        case 'descripcion':
            const descTrim = valor.trim();
            if (descTrim.length === 0) {
                mensaje = 'La descripción es obligatoria.';
            } else if (descTrim.length < 10) {
                mensaje = 'La descripción debe tener al menos 10 caracteres.';
            } else if (descTrim.length > 200) {
                mensaje = 'La descripción no puede exceder los 200 caracteres.';
            } else {
                esValido = true;
            }
            break;

        case 'categoria':
            if (!valor || valor === '') {
                mensaje = 'Debes seleccionar una categoría.';
            } else {
                esValido = true;
            }
            break;

        default:
            esValido = true;
    }

    if (esValido) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (feedbackElement) {
            feedbackElement.style.display = 'none';
        }
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (feedbackElement) {
            feedbackElement.textContent = `⚠️ ${mensaje}`;
            feedbackElement.style.display = 'block';
        }
    }

    return esValido;
}

/**
 * Actualiza contadores de caracteres
 */
function actualizarContadores() {
    const nombreLength = nombreServicio.value.length;
    const descLength = descripcionServicio.value.length;

    nombreContador.textContent = `${nombreLength} / 50 caracteres`;
    nombreContador.classList.remove('danger', 'success');
    if (nombreLength > 40) nombreContador.classList.add('danger');
    else if (nombreLength >= 3) nombreContador.classList.add('success');

    descripcionContador.textContent = `${descLength} / 200 caracteres`;
    descripcionContador.classList.remove('danger', 'success');
    if (descLength > 150) descripcionContador.classList.add('danger');
    else if (descLength >= 10) descripcionContador.classList.add('success');
}

/**
 * Valida todo el formulario de servicios
 */
function validarFormularioCompleto() {
    const nombreValido = validarCampo(
        nombreServicio,
        'nombre',
        nombreServicio.value,
        document.getElementById('nombreFeedback')
    );

    const descripcionValido = validarCampo(
        descripcionServicio,
        'descripcion',
        descripcionServicio.value,
        document.getElementById('descripcionFeedback')
    );

    const categoriaValido = validarCampo(
        categoriaServicio,
        'categoria',
        categoriaServicio.value,
        document.getElementById('categoriaFeedback')
    );

    return nombreValido && descripcionValido && categoriaValido;
}

// ==============================================
// 8. GESTIÓN DE SERVICIOS (CRUD)
// ==============================================

/**
 * Renderiza la lista de servicios
 */
function renderizarServicios(filtro = 'todas') {
    const serviciosFiltrados = filtro === 'todas'
        ? servicios
        : servicios.filter(s => s.categoria === filtro);

    contadorRegistros.textContent = `Total: ${servicios.length}`;

    if (serviciosFiltrados.length === 0) {
        const mensaje = filtro === 'todas'
            ? 'No hay servicios registrados aún.'
            : 'No hay servicios con esta categoría.';
        listaRegistros.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                ${mensaje} ${filtro === 'todas' ? 'Agrega uno desde el formulario.' : 'Cambia el filtro para ver otros.'}
            </div>
        `;
        return;
    }

    let html = '';
    serviciosFiltrados.forEach((servicio) => {
        const categoriaColors = {
            'Desarrollo': 'primary',
            'Diseño': 'info',
            'Infraestructura': 'warning',
            'Seguridad': 'danger',
            'Consultoría': 'success',
            'Otro': 'secondary'
        };
        const color = categoriaColors[servicio.categoria] || 'secondary';

        html += `
            <div class="registro-item p-3 mb-2 bg-white rounded-3 d-flex justify-content-between align-items-center" data-id="${servicio.id}">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <strong>${escapeHTML(servicio.nombre)}</strong>
                        <span class="badge bg-${color} badge-categoria">${servicio.categoria}</span>
                    </div>
                    <div class="text-muted small">${escapeHTML(servicio.descripcion)}</div>
                    <div class="text-muted small mt-1">
                        <i class="bi bi-clock"></i> ${servicio.fecha}
                    </div>
                </div>
                <button class="btn-eliminar ms-2" data-id="${servicio.id}" title="Eliminar servicio">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        `;
    });

    listaRegistros.innerHTML = html;

    // Eventos para botones eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            eliminarServicio(id);
        });
    });
}

/**
 * Escapa caracteres especiales
 */
function escapeHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Agrega un nuevo servicio
 */
function agregarServicio(nombre, descripcion, categoria) {
    // Verificar si hay sesión iniciada
    if (!usuarioActual) {
        mensajeSesionTexto.textContent = '⚠️ Debes iniciar sesión para agregar servicios.';
        mensajeSesion.classList.remove('d-none');
        return false;
    }

    const nuevoServicio = {
        id: idCounter++,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria,
        fecha: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    servicios.push(nuevoServicio);
    renderizarServicios();
    actualizarContadores();

    // Mostrar mensaje de éxito
    mensajeExitoTexto.textContent = `"${nuevoServicio.nombre}" registrado correctamente.`;
    mensajeExito.classList.remove('d-none');
    setTimeout(() => {
        mensajeExito.classList.add('d-none');
    }, 4000);

    // Limpiar formulario
    limpiarFormulario();
    return true;
}

/**
 * Elimina un servicio por ID
 */
function eliminarServicio(id) {
    if (!usuarioActual) {
        mensajeSesionTexto.textContent = '⚠️ Debes iniciar sesión para eliminar servicios.';
        mensajeSesion.classList.remove('d-none');
        return;
    }

    const servicioEliminado = servicios.find(s => s.id === id);
    servicios = servicios.filter(s => s.id !== id);
    renderizarServicios();

    if (servicioEliminado) {
        mensajeExitoTexto.textContent = `"${servicioEliminado.nombre}" eliminado.`;
        mensajeExito.classList.remove('d-none');
        mensajeExito.className = 'alert alert-danger mt-3';
        setTimeout(() => {
            mensajeExito.classList.add('d-none');
            mensajeExito.className = 'alert alert-success mt-3 d-none';
        }, 3000);
    }
}

/**
 * Elimina todos los servicios
 */
function eliminarTodosServicios() {
    if (!usuarioActual) {
        mensajeSesionTexto.textContent = '⚠️ Debes iniciar sesión para eliminar servicios.';
        mensajeSesion.classList.remove('d-none');
        return;
    }

    if (servicios.length === 0) return;

    if (confirm(`¿Estás seguro de eliminar todos los ${servicios.length} servicios?`)) {
        servicios = [];
        renderizarServicios();
        mensajeExitoTexto.textContent = 'Todos los servicios han sido eliminados.';
        mensajeExito.classList.remove('d-none');
        mensajeExito.className = 'alert alert-danger mt-3';
        setTimeout(() => {
            mensajeExito.classList.add('d-none');
            mensajeExito.className = 'alert alert-success mt-3 d-none';
        }, 3000);
    }
}

/**
 * Limpia el formulario y los estados de validación
 */
function limpiarFormulario() {
    formRegistro.reset();
    nombreServicio.classList.remove('is-valid', 'is-invalid');
    descripcionServicio.classList.remove('is-valid', 'is-invalid');
    categoriaServicio.classList.remove('is-valid', 'is-invalid');
    document.querySelectorAll('#formRegistro .invalid-feedback, #formRegistro .valid-feedback').forEach(el => {
        el.style.display = 'none';
    });
    actualizarContadores();
}

// ==============================================
// 9. VALIDACIONES DE REGISTRO DE USUARIO
// ==============================================

/**
 * Valida la contraseña y muestra los requisitos
 */
function validarPassword(password) {
    const tieneLongitud = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Actualizar requisitos visuales
    actualizarRequisito(reqLongitud, tieneLongitud, 'Mínimo 8 caracteres');
    actualizarRequisito(reqMayuscula, tieneMayuscula, 'Al menos 1 letra mayúscula');
    actualizarRequisito(reqNumero, tieneNumero, 'Al menos 1 número');
    actualizarRequisito(reqEspecial, tieneEspecial, 'Al menos 1 carácter especial (@, #, $, %, etc.)');

    return tieneLongitud && tieneMayuscula && tieneNumero && tieneEspecial;
}

function actualizarRequisito(elemento, cumple, texto) {
    const icono = cumple ? 'bi-check-circle-fill' : 'bi-circle';
    const clase = cumple ? 'cumplido' : 'incumplido';
    elemento.className = clase;
    elemento.innerHTML = `<i class="bi ${icono}"></i> ${texto}`;
}

/**
 * Limpia validaciones del registro
 */
function limpiarValidacionesRegistro() {
    document.querySelectorAll('#registroForm .form-control').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
    });
    document.querySelectorAll('#registroForm .invalid-feedback, #registroForm .valid-feedback').forEach(el => {
        el.style.display = 'none';
    });
    // Resetear requisitos de contraseña
    [reqLongitud, reqMayuscula, reqNumero, reqEspecial].forEach(el => {
        el.className = 'text-muted';
        el.innerHTML = `<i class="bi bi-circle"></i> ${el.textContent.trim()}`;
    });
}

// ==============================================
// 10. EVENTOS
// ==============================================

// --- Eventos de Autenticación ---
btnIniciarSesion.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalLogin'));
    modal.show();
    loginError.classList.add('d-none');
    loginForm.reset();
    loginUsuario.classList.remove('is-invalid');
    loginPassword.classList.remove('is-invalid');
});

btnRegistrarse.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalRegistro'));
    modal.show();
    registroExito.classList.add('d-none');
    registroForm.reset();
    limpiarValidacionesRegistro();
});

btnCerrarSesion.addEventListener('click', cerrarSesion);

// --- Evento: Login ---
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = loginUsuario.value.trim();
    const password = loginPassword.value.trim();

    let valido = true;

    if (!usuario) {
        loginUsuario.classList.add('is-invalid');
        document.getElementById('loginUsuarioFeedback').style.display = 'block';
        valido = false;
    } else {
        loginUsuario.classList.remove('is-invalid');
        document.getElementById('loginUsuarioFeedback').style.display = 'none';
    }

    if (!password) {
        loginPassword.classList.add('is-invalid');
        document.getElementById('loginPasswordFeedback').style.display = 'block';
        valido = false;
    } else {
        loginPassword.classList.remove('is-invalid');
        document.getElementById('loginPasswordFeedback').style.display = 'none';
    }

    if (valido) {
        iniciarSesion(usuario, password);
    }
});

// --- Evento: Registro de Usuario ---
registroForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = regUsuario.value.trim();
    const email = regEmail.value.trim();
    const nombre = regNombre.value.trim();
    const telefono = regTelefono.value.trim();
    const password = regPassword.value;
    const passwordConfirm = regPasswordConfirm.value;

    let valido = true;

    // Validar usuario
    if (usuario.length < 3) {
        regUsuario.classList.add('is-invalid');
        document.getElementById('regUsuarioFeedback').style.display = 'block';
        valido = false;
    } else {
        regUsuario.classList.remove('is-invalid');
        regUsuario.classList.add('is-valid');
        document.getElementById('regUsuarioFeedback').style.display = 'none';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        regEmail.classList.add('is-invalid');
        document.getElementById('regEmailFeedback').style.display = 'block';
        valido = false;
    } else {
        regEmail.classList.remove('is-invalid');
        regEmail.classList.add('is-valid');
        document.getElementById('regEmailFeedback').style.display = 'none';
    }

    // Validar nombre
    if (nombre.length < 3) {
        regNombre.classList.add('is-invalid');
        document.getElementById('regNombreFeedback').style.display = 'block';
        valido = false;
    } else {
        regNombre.classList.remove('is-invalid');
        regNombre.classList.add('is-valid');
        document.getElementById('regNombreFeedback').style.display = 'none';
    }

    // Validar contraseña
    const passwordValida = validarPassword(password);
    if (!passwordValida) {
        regPassword.classList.add('is-invalid');
        document.getElementById('regPasswordFeedback').style.display = 'block';
        valido = false;
    } else {
        regPassword.classList.remove('is-invalid');
        regPassword.classList.add('is-valid');
        document.getElementById('regPasswordFeedback').style.display = 'none';
    }

    // Validar confirmación de contraseña
    if (password !== passwordConfirm || passwordConfirm.length === 0) {
        regPasswordConfirm.classList.add('is-invalid');
        document.getElementById('regPasswordConfirmFeedback').style.display = 'block';
        valido = false;
    } else {
        regPasswordConfirm.classList.remove('is-invalid');
        regPasswordConfirm.classList.add('is-valid');
        document.getElementById('regPasswordConfirmFeedback').style.display = 'none';
    }

    if (valido) {
        registrarUsuario(usuario, email, nombre, telefono, password);
    }
});

// --- Eventos del formulario de servicios ---
formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();

    // Verificar sesión
    if (!usuarioActual) {
        mensajeSesionTexto.textContent = '⚠️ Debes iniciar sesión para agregar servicios.';
        mensajeSesion.classList.remove('d-none');
        return;
    }

    if (validarFormularioCompleto()) {
        const nombre = nombreServicio.value;
        const descripcion = descripcionServicio.value;
        const categoria = categoriaServicio.value;
        agregarServicio(nombre, descripcion, categoria);
    } else {
        mensajeExitoTexto.textContent = 'Corrige los errores en el formulario.';
        mensajeExito.classList.remove('d-none');
        mensajeExito.className = 'alert alert-danger mt-3';
        setTimeout(() => {
            mensajeExito.classList.add('d-none');
            mensajeExito.className = 'alert alert-success mt-3 d-none';
        }, 4000);
    }
});

// Validaciones en tiempo real (input, blur)
nombreServicio.addEventListener('input', function() {
    validarCampo(this, 'nombre', this.value, document.getElementById('nombreFeedback'));
    actualizarContadores();
});

nombreServicio.addEventListener('blur', function() {
    validarCampo(this, 'nombre', this.value, document.getElementById('nombreFeedback'));
    actualizarContadores();
});

descripcionServicio.addEventListener('input', function() {
    validarCampo(this, 'descripcion', this.value, document.getElementById('descripcionFeedback'));
    actualizarContadores();
});

descripcionServicio.addEventListener('blur', function() {
    validarCampo(this, 'descripcion', this.value, document.getElementById('descripcionFeedback'));
    actualizarContadores();
});

categoriaServicio.addEventListener('change', function() {
    validarCampo(this, 'categoria', this.value, document.getElementById('categoriaFeedback'));
});

// --- Evento: reset del formulario ---
formRegistro.addEventListener('reset', function(e) {
    setTimeout(() => {
        limpiarFormulario();
        mensajeExito.classList.add('d-none');
    }, 50);
});

// --- Filtros por categoría ---
document.querySelectorAll('[data-filtro]').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('[data-filtro]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filtro = this.dataset.filtro;
        renderizarServicios(filtro);
    });
});

// --- Botón eliminar todas ---
btnEliminarTodas.addEventListener('click', eliminarTodosServicios);

// --- Validaciones de registro en tiempo real ---
regUsuario.addEventListener('input', function() {
    if (this.value.length >= 3) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        document.getElementById('regUsuarioFeedback').style.display = 'none';
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
            document.getElementById('regUsuarioFeedback').style.display = 'block';
        }
    }
    regUsuarioContador.textContent = `${this.value.length} / 20 caracteres`;
});

regEmail.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        document.getElementById('regEmailFeedback').style.display = 'none';
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
            document.getElementById('regEmailFeedback').style.display = 'block';
        }
    }
});

regNombre.addEventListener('input', function() {
    if (this.value.length >= 3) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        document.getElementById('regNombreFeedback').style.display = 'none';
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
            document.getElementById('regNombreFeedback').style.display = 'block';
        }
    }
});

regPassword.addEventListener('input', function() {
    validarPassword(this.value);
    if (validarPassword(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        document.getElementById('regPasswordFeedback').style.display = 'none';
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
            document.getElementById('regPasswordFeedback').style.display = 'block';
        }
    }
    // Verificar coincidencia si ya hay algo en confirmación
    if (regPasswordConfirm.value.length > 0) {
        if (this.value === regPasswordConfirm.value) {
            regPasswordConfirm.classList.remove('is-invalid');
            regPasswordConfirm.classList.add('is-valid');
            document.getElementById('regPasswordConfirmFeedback').style.display = 'none';
        } else {
            regPasswordConfirm.classList.remove('is-valid');
            regPasswordConfirm.classList.add('is-invalid');
            document.getElementById('regPasswordConfirmFeedback').style.display = 'block';
        }
    }
});

regPasswordConfirm.addEventListener('input', function() {
    if (this.value === regPassword.value && this.value.length > 0) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        document.getElementById('regPasswordConfirmFeedback').style.display = 'none';
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
            document.getElementById('regPasswordConfirmFeedback').style.display = 'block';
        }
    }
});

// ==============================================
// 11. INICIALIZACIÓN
// ==============================================
function init() {
    // Inicializar contadores
    actualizarContadores();
    
    // Renderizar servicios (vacío al inicio)
    renderizarServicios();
    
    // Mostrar mensaje de sesión si no hay usuario
    if (!usuarioActual) {
        mensajeSesionTexto.textContent = 'Debes iniciar sesión para gestionar servicios.';
        mensajeSesion.classList.remove('d-none');
    }
    
    console.log('📋 Sistema de Administración inicializado correctamente.');
    console.log('💡 Características:');
    console.log('   ✅ Autenticación (Login + Registro)');
    console.log('   ✅ Validaciones en tiempo real (input, blur)');
    console.log('   ✅ Campos obligatorios con longitud mínima');
    console.log('   ✅ Contraseña: 8 caracteres, mayúscula, número, especial');
    console.log('   ✅ Mensajes dinámicos de error/éxito');
    console.log('   ✅ Clases Bootstrap is-valid / is-invalid');
    console.log('   ✅ CRUD completo: Crear, Mostrar, Contar, Eliminar');
    console.log('   ✅ Filtros por categoría');
    console.log(`   📌 ${servicios.length} servicios cargados.`);
    console.log(`   👤 Usuarios registrados: ${usuarios.length}`);
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}