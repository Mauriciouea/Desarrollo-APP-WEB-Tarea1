/**
 * script.js - Gestión dinámica de registros de servicios
 * Desarrollado por Mauricio Sisalima
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // ================================================================
    // 1. Elementos del DOM
    // ================================================================
    const formRegistro = document.getElementById('formRegistro');
    const nombreInput = document.getElementById('nombreServicio');
    const descripcionInput = document.getElementById('descripcionServicio');
    const categoriaSelect = document.getElementById('categoriaServicio');
    const listaRegistros = document.getElementById('listaRegistros');
    const contadorRegistros = document.getElementById('contadorRegistros');
    const mensajeValidacion = document.getElementById('mensajeValidacion');

    // ================================================================
    // 2. Array para almacenar los registros
    // ================================================================
    let registros = [];

    // ================================================================
    // 3. Función para renderizar la lista de registros
    // ================================================================
    function renderizarRegistros() {
        // Limpiar el contenedor (excepto el mensaje de vacío)
        listaRegistros.innerHTML = '';

        if (registros.length === 0) {
            // Mostrar mensaje de vacío
            const mensajeVacio = document.createElement('div');
            mensajeVacio.className = 'text-center text-muted py-4';
            mensajeVacio.id = 'mensajeVacio';
            mensajeVacio.innerHTML = `
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                No hay servicios registrados aún. Agrega uno desde el formulario.
            `;
            listaRegistros.appendChild(mensajeVacio);
        } else {
            // Recorrer el array y crear cada elemento
            registros.forEach((registro, index) => {
                // Crear el contenedor principal del registro (usando clases de Bootstrap)
                const item = document.createElement('div');
                item.className = 'registro-item d-flex justify-content-between align-items-center p-3 mb-2 bg-white rounded-3 shadow-sm';
                item.dataset.index = index;

                // Contenido del registro
                const contenido = document.createElement('div');
                contenido.className = 'flex-grow-1';

                // Nombre
                const nombreEl = document.createElement('h6');
                nombreEl.className = 'fw-bold mb-1';
                nombreEl.textContent = registro.nombre;

                // Categoría (badge)
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
                btnEliminar.addEventListener('click', function() {
                    eliminarRegistro(index);
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
    // 4. Función para obtener color según categoría
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
    // 5. Función para actualizar el contador
    // ================================================================
    function actualizarContador() {
        contadorRegistros.textContent = `Total: ${registros.length}`;
        // Añadir animación sutil al contador
        contadorRegistros.style.transition = 'transform 0.2s';
        contadorRegistros.style.transform = 'scale(1.1)';
        setTimeout(() => {
            contadorRegistros.style.transform = 'scale(1)';
        }, 200);
    }

    // ================================================================
    // 6. Función para eliminar un registro
    // ================================================================
    function eliminarRegistro(index) {
        if (confirm(`¿Estás seguro de eliminar el servicio "${registros[index].nombre}"?`)) {
            registros.splice(index, 1);
            renderizarRegistros();

            // Mostrar mensaje de confirmación
            mostrarMensaje('Registro eliminado correctamente.', 'success');
        }
    }

    // ================================================================
    // 7. Función para mostrar mensajes de validación
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
    // 8. Evento submit del formulario
    // ================================================================
    formRegistro.addEventListener('submit', function(event) {
        // Prevenir recarga de página
        event.preventDefault();

        // Limpiar mensajes previos
        mensajeValidacion.innerHTML = '';

        // Obtener valores
        const nombre = nombreInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const categoria = categoriaSelect.value;

        // ================================================================
        // 9. Validaciones
        // ================================================================
        let errores = [];

        if (nombre === '') {
            errores.push('El nombre del servicio es obligatorio.');
            nombreInput.classList.add('is-invalid');
        } else {
            nombreInput.classList.remove('is-invalid');
        }

        if (descripcion === '') {
            errores.push('La descripción del servicio es obligatoria.');
            descripcionInput.classList.add('is-invalid');
        } else {
            descripcionInput.classList.remove('is-invalid');
        }

        // Validar que no haya un servicio con el mismo nombre (opcional)
        const existe = registros.some(r => r.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe && nombre !== '') {
            errores.push(`Ya existe un servicio con el nombre "${nombre}".`);
            nombreInput.classList.add('is-invalid');
        }

        // Si hay errores, mostrarlos y salir
        if (errores.length > 0) {
            mostrarMensaje(errores.join('<br>'), 'danger');
            return;
        }

        // ================================================================
        // 10. Crear el nuevo registro
        // ================================================================
        const nuevoRegistro = {
            nombre: nombre,
            descripcion: descripcion,
            categoria: categoria
        };

        // Agregar al array
        registros.push(nuevoRegistro);

        // ================================================================
        // 11. Renderizar la lista actualizada
        // ================================================================
        renderizarRegistros();

        // ================================================================
        // 12. Limpiar el formulario
        // ================================================================
        formRegistro.reset();
        nombreInput.classList.remove('is-invalid');
        descripcionInput.classList.remove('is-invalid');

        // ================================================================
        // 13. Mostrar mensaje de éxito
        // ================================================================
        mostrarMensaje(`Servicio "${nombre}" agregado exitosamente.`, 'success');

        // Scroll suave hasta la lista
        document.getElementById('registros').scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    // ================================================================
    // 14. Renderizado inicial
    // ================================================================
    renderizarRegistros();

    // ================================================================
    // 15. Limpiar validaciones al escribir
    // ================================================================
    nombreInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
    descripcionInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });

});