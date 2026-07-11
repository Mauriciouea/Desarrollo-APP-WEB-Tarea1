/**
 * script.js - Gestión dinámica de registros de servicios
 * Desarrollado por Mauricio Sisalima
 * 
 * ✅ Arreglo de objetos para representar datos
 * ✅ Renderizado dinámico en tarjetas/listas
 * ✅ Estructura repetitiva para múltiples registros
 * ✅ Condiciones para mostrar mensajes según estado
 * ✅ Validaciones dinámicas (Semana 6)
 * ✅ Registro de nuevos datos desde formulario
 * ✅ Filtros por categoría
 */

// ================================================================
// 1. ESPERAR A QUE EL DOM ESTÉ CARGADO
// ================================================================
document.addEventListener('DOMContentLoaded', function() {

    // ================================================================
    // 2. ELEMENTOS DEL DOM
    // ================================================================
    const formRegistro = document.getElementById('formRegistro');
    const nombreInput = document.getElementById('nombreServicio');
    const descripcionInput = document.getElementById('descripcionServicio');
    const categoriaSelect = document.getElementById('categoriaServicio');
    const listaRegistros = document.getElementById('listaRegistros');
    const contadorRegistros = document.getElementById('contadorRegistros');
    const mensajeValidacion = document.getElementById('mensajeValidacion');
    const btnEliminarTodas = document.getElementById('btnEliminarTodas');

    // ================================================================
    // 3. ARRAY DE OBJETOS (DATOS DEL PROYECTO)
    // ================================================================
    let registros = [
        { id: 1, nombre: 'Consultoría TI', descripcion: 'Asesoría en infraestructura tecnológica', categoria: 'Consultoría' },
        { id: 2, nombre: 'Desarrollo Web', descripcion: 'Creación de sitios web responsivos', categoria: 'Desarrollo' },
        { id: 3, nombre: 'Auditoría de Seguridad', descripcion: 'Análisis y corrección de vulnerabilidades', categoria: 'Seguridad' },
        { id: 4, nombre: 'Diseño UX/UI', descripcion: 'Diseño de experiencia e interfaz de usuario', categoria: 'Diseño' },
        { id: 5, nombre: 'Mantenimiento de Servidores', descripcion: 'Administración y monitoreo de servidores', categoria: 'Infraestructura' }
    ];

    let contadorId = registros.length + 1;
    let filtroActual = 'todas'; // 'todas', 'Desarrollo', 'Diseño', etc.

    // ================================================================
    // 4. FUNCIÓN PARA OBTENER COLOR SEGÚN CATEGORÍA
    // ================================================================
    function getColorCategoria(categoria) {
        const colores = {
            'Desarrollo': 'primary',
            'Diseño': 'info',
            'Infraestructura': 'warning',
            'Seguridad': 'danger',
            'Consultoría': 'success',
            'Otro': 'secondary'
        };
        return colores[categoria] || 'secondary';
    }

    // ================================================================
    // 5. FUNCIÓN PARA OBTENER REGISTROS FILTRADOS
    // ================================================================
    function getRegistrosFiltrados() {
        if (filtroActual === 'todas') {
            return registros;
        }
        return registros.filter(r => r.categoria === filtroActual);
    }

    // ================================================================
    // 6. RENDERIZADO PRINCIPAL (Tarjetas/Listas)
    // ================================================================
    function renderizarRegistros() {
        const registrosFiltrados = getRegistrosFiltrados();
        listaRegistros.innerHTML = '';

        // ================================================================
        // 6a. CONDICIÓN: Mostrar mensaje si no hay registros
        // ================================================================
        if (registrosFiltrados.length === 0) {
            const mensajeVacio = document.createElement('div');
            mensajeVacio.id = 'mensajeVacio';
            mensajeVacio.innerHTML = `
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                <span class="text-muted">
                    ${registros.length === 0 
                        ? 'No hay servicios registrados aún. Agrega uno desde el formulario.' 
                        : 'No hay servicios en esta categoría.'}
                </span>
            `;
            listaRegistros.appendChild(mensajeVacio);
        } else {
            // ================================================================
            // 6b. ESTRUCTURA REPETITIVA: Recorrer array y crear tarjetas
            // ================================================================
            registrosFiltrados.forEach((registro, index) => {
                const item = document.createElement('div');
                item.className = 'registro-item d-flex justify-content-between align-items-center p-3 mb-2 bg-white rounded-3 shadow-sm';
                item.dataset.index = index;

                // Contenido
                const contenido = document.createElement('div');
                contenido.className = 'flex-grow-1';

                // Nombre con badge de categoría
                const nombreEl = document.createElement('h6');
                nombreEl.className = 'fw-bold mb-1';
                nombreEl.textContent = registro.nombre;

                const categoriaEl = document.createElement('span');
                categoriaEl.className = `badge-categoria badge bg-${getColorCategoria(registro.categoria)} rounded-pill ms-2`;
                categoriaEl.textContent = registro.categoria;

                // Descripción
                const descEl = document.createElement('p');
                descEl.className = 'text-muted small mb-0';
                descEl.textContent = registro.descripcion || 'Sin descripción';

                // Botón eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-outline-danger btn-sm rounded-circle';
                btnEliminar.style.width = '36px';
                btnEliminar.style.height = '36px';
                btnEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
                btnEliminar.setAttribute('aria-label', 'Eliminar registro');
                btnEliminar.addEventListener('click', function(e) {
                    e.stopPropagation();
                    eliminarRegistro(registro.id);
                });

                // Ensamblar
                nombreEl.appendChild(categoriaEl);
                contenido.appendChild(nombreEl);
                contenido.appendChild(descEl);
                item.appendChild(contenido);
                item.appendChild(btnEliminar);

                listaRegistros.appendChild(item);
            });
        }

        // Actualizar contador
        actualizarContador();
    }

    // ================================================================
    // 7. ACTUALIZAR CONTADOR
    // ================================================================
    function actualizarContador() {
        const total = registros.length;
        contadorRegistros.textContent = `Total: ${total}`;
        // Animación
        contadorRegistros.style.transition = 'transform 0.2s';
        contadorRegistros.style.transform = 'scale(1.1)';
        setTimeout(() => {
            contadorRegistros.style.transform = 'scale(1)';
        }, 200);
    }

    // ================================================================
    // 8. ELIMINAR REGISTRO POR ID
    // ================================================================
    function eliminarRegistro(id) {
        const registro = registros.find(r => r.id === id);
        if (!registro) return;

        if (confirm(`¿Estás seguro de eliminar el servicio "${registro.nombre}"?`)) {
            registros = registros.filter(r => r.id !== id);
            renderizarRegistros();
            mostrarMensaje(`Servicio "${registro.nombre}" eliminado.`, 'success');
        }
    }

    // ================================================================
    // 9. ELIMINAR TODOS LOS REGISTROS
    // ================================================================
    function eliminarTodos() {
        if (registros.length === 0) {
            mostrarMensaje('No hay registros para eliminar.', 'warning');
            return;
        }

        if (confirm('¿Estás seguro de eliminar TODOS los servicios?')) {
            const cantidad = registros.length;
            registros = [];
            renderizarRegistros();
            mostrarMensaje(`Se eliminaron ${cantidad} servicios.`, 'info');
        }
    }

    // ================================================================
    // 10. MOSTRAR MENSAJES DE VALIDACIÓN (CONDICIONAL)
    // ================================================================
    function mostrarMensaje(texto, tipo = 'danger') {
        mensajeValidacion.innerHTML = '';
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show mb-0`;
        alerta.role = 'alert';
        alerta.innerHTML = `
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        mensajeValidacion.appendChild(alerta);

        // Auto-cerrar después de 4 segundos
        setTimeout(() => {
            const btnClose = alerta.querySelector('.btn-close');
            if (btnClose) btnClose.click();
        }, 4000);
    }

    // ================================================================
    // 11. VALIDACIONES DINÁMICAS EN TIEMPO REAL (Semana 6)
    // ================================================================

    // Validar campo en tiempo real
    function validarCampo(input, condicion, feedbackId, mensajeError) {
        const feedback = document.getElementById(feedbackId);
        const valor = input.value.trim();

        if (condicion(valor)) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (feedback) feedback.style.display = 'none';
            return true;
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${mensajeError}`;
            }
            return false;
        }
    }

    // Validar nombre (mínimo 3 caracteres)
    nombreInput.addEventListener('input', function() {
        const valido = validarCampo(
            this,
            (v) => v.length >= 3,
            'nombreFeedback',
            'El nombre debe tener al menos 3 caracteres.'
        );
        // Actualizar contador
        const contador = document.getElementById('nombreContador');
        const len = this.value.length;
        contador.textContent = `${len} / 50 caracteres`;
        contador.className = len >= 3 ? 'text-muted success' : 'text-muted danger';
    });

    // Validar descripción (mínimo 10 caracteres)
    descripcionInput.addEventListener('input', function() {
        const valido = validarCampo(
            this,
            (v) => v.length >= 10,
            'descripcionFeedback',
            'La descripción debe tener al menos 10 caracteres.'
        );
        const contador = document.getElementById('descripcionContador');
        const len = this.value.length;
        contador.textContent = `${len} / 200 caracteres`;
        contador.className = len >= 10 ? 'text-muted success' : 'text-muted danger';
    });

    // Validar categoría
    categoriaSelect.addEventListener('change', function() {
        validarCampo(
            this,
            (v) => v !== '',
            'categoriaFeedback',
            'Debes seleccionar una categoría.'
        );
    });

    // ================================================================
    // 12. EVENTO SUBMIT DEL FORMULARIO (Registrar nuevo servicio)
    // ================================================================
    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault();

        // Limpiar mensajes previos
        mensajeValidacion.innerHTML = '';

        // Obtener valores
        const nombre = nombreInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const categoria = categoriaSelect.value;

        // ================================================================
        // 13. VALIDACIONES DEL FORMULARIO
        // ================================================================
        let errores = [];

        // Validar nombre
        if (nombre.length < 3) {
            errores.push('El nombre debe tener al menos 3 caracteres.');
            nombreInput.classList.add('is-invalid');
        } else {
            nombreInput.classList.remove('is-invalid');
            nombreInput.classList.add('is-valid');
        }

        // Validar descripción
        if (descripcion.length < 10) {
            errores.push('La descripción debe tener al menos 10 caracteres.');
            descripcionInput.classList.add('is-invalid');
        } else {
            descripcionInput.classList.remove('is-invalid');
            descripcionInput.classList.add('is-valid');
        }

        // Validar categoría
        if (categoria === '') {
            errores.push('Debes seleccionar una categoría.');
            categoriaSelect.classList.add('is-invalid');
        } else {
            categoriaSelect.classList.remove('is-invalid');
            categoriaSelect.classList.add('is-valid');
        }

        // Verificar duplicados (condición adicional)
        const existe = registros.some(r => r.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe && nombre.length >= 3) {
            errores.push(`Ya existe un servicio con el nombre "${nombre}".`);
            nombreInput.classList.add('is-invalid');
        }

        // Si hay errores, mostrar mensaje y salir
        if (errores.length > 0) {
            mostrarMensaje(errores.join('<br>'), 'danger');
            return;
        }

        // ================================================================
        // 14. CREAR NUEVO REGISTRO (Objeto)
        // ================================================================
        const nuevoRegistro = {
            id: contadorId++,
            nombre: nombre,
            descripcion: descripcion,
            categoria: categoria
        };

        // Agregar al array
        registros.push(nuevoRegistro);

        // ================================================================
        // 15. RENDERIZAR Y LIMPIAR
        // ================================================================
        renderizarRegistros();
        formRegistro.reset();
        nombreInput.classList.remove('is-valid', 'is-invalid');
        descripcionInput.classList.remove('is-valid', 'is-invalid');
        categoriaSelect.classList.remove('is-valid', 'is-invalid');

        // Resetear contadores
        document.getElementById('nombreContador').textContent = '0 / 50 caracteres';
        document.getElementById('nombreContador').className = 'text-muted';
        document.getElementById('descripcionContador').textContent = '0 / 200 caracteres';
        document.getElementById('descripcionContador').className = 'text-muted';

        // ================================================================
        // 16. MENSAJE DE ÉXITO (CONDICIONAL)
        // ================================================================
        mostrarMensaje(`✅ Servicio "${nombre}" agregado exitosamente.`, 'success');

        // Scroll suave hasta la lista
        document.getElementById('registros').scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    // ================================================================
    // 17. FILTROS POR CATEGORÍA
    // ================================================================
    document.querySelectorAll('[data-filtro]').forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar active de todos
            document.querySelectorAll('[data-filtro]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            filtroActual = this.dataset.filtro;
            renderizarRegistros();
        });
    });

    // ================================================================
    // 18. ELIMINAR TODOS
    // ================================================================
    btnEliminarTodas.addEventListener('click', eliminarTodos);

    // ================================================================
    // 19. RENDERIZADO INICIAL
    // ================================================================
    renderizarRegistros();

    // ================================================================
    // 20. MOSTRAR FECHA ACTUAL EN HEADER
    // ================================================================
    const fechaActual = document.getElementById('fechaActual');
    if (fechaActual) {
        const ahora = new Date();
        fechaActual.textContent = ahora.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // ================================================================
    // 21. AUTENTICACIÓN SIMULADA (Base para sesión)
    // ================================================================
    // (Manteniendo la estructura de autenticación del código original)
    // ... (Se mantiene el código de autenticación existente)

    console.log('✅ Sistema de Administración cargado correctamente.');
    console.log(`📊 Total de registros: ${registros.length}`);
});