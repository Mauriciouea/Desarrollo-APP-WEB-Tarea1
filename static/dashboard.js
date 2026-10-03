/**
 * dashboard.js - Lógica del Dashboard
 */

console.log('🚀 dashboard.js CARGADO correctamente');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM listo');

    // ✅ VERIFICAR SESIÓN
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    console.log('👤 Usuario activo desde localStorage:', usuarioActivo);

    if (!usuarioActivo) {
        alert('⚠️ Debes iniciar sesión para acceder al dashboard.');
        window.location.href = '/';
        return;
    }

    // ✅ MOSTRAR NOMBRE EN EL HEADER
    const elementoNombre = document.getElementById('nombreUsuarioDash');
    if (elementoNombre) {
        const nombreMostrar = 
            usuarioActivo.nombreCompleto || 
            usuarioActivo.nombre || 
            usuarioActivo.usuario || 
            'Usuario';
        
        elementoNombre.textContent = nombreMostrar;
        console.log('✅ Nombre actualizado a:', nombreMostrar);
    }

    // ✅ MANEJAR CLICS EN LAS TARJETAS
    document.querySelectorAll('[data-opcion]').forEach(card => {
        card.addEventListener('click', function() {
            const opcion = this.dataset.opcion;
            console.log('🖱️ Clic en opción:', opcion);

            switch (opcion) {
                case 'inicio':
                    alert('📊 Panel de Inicio - Próximamente');
                    break;

                case 'servicios':
                    // ✅ Ir a la página del menú con las 4 cards
                    window.location.href = '/menu';
                    break;

                case 'perfil':
                    alert(
                        `👤 Mi Perfil\n\n` +
                        `Usuario: ${usuarioActivo.usuario}\n` +
                        `Nombre: ${usuarioActivo.nombreCompleto}\n` +
                        `Email: ${usuarioActivo.email}\n` +
                        `Teléfono: ${usuarioActivo.telefono || 'No registrado'}`
                    );
                    break;

                case 'reportes':
                    alert('📈 Reportes - Próximamente');
                    break;

                case 'config':
                    alert('⚙️ Configuración - Próximamente');
                    break;

                case 'logout':
                    if (confirm('¿Estás seguro de cerrar sesión?')) {
                        localStorage.removeItem('usuarioActivo');
                        window.location.href = '/';
                    }
                    break;
            }
        });
    });
});