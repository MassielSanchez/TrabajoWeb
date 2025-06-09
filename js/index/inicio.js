// js/inicioprofesor.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('inicioprofesor.js cargado y DOM listo.');

    // --- 1. Funcionalidad del Menú Hamburguesa (si es con JS) ---
    // (Opcional, si tu menú no funciona solo con CSS)
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.barra-lateral');
    const layoutContainer = document.querySelector('.layout-container');

    if (menuToggle && sidebar && layoutContainer) {
        menuToggle.addEventListener('change', () => {
            if (menuToggle.checked) {
                sidebar.classList.add('open');
                layoutContainer.classList.add('menu-open');
            } else {
                sidebar.classList.remove('open');
                layoutContainer.classList.remove('menu-open');
            }
        });

        // Opcional: Cerrar menú si se hace clic fuera (para pantallas más grandes)
        // window.addEventListener('click', (event) => {
        //     if (menuToggle.checked && !sidebar.contains(event.target) && !menuToggle.contains(event.target) && !document.querySelector('.hamburger').contains(event.target)) {
        //         menuToggle.checked = false;
        //         sidebar.classList.remove('open');
        //         layoutContainer.classList.remove('menu-open');
        //     }
        // });
    }

    // --- 2. Lógica para la redirección de "Cerrar sesión" ---
    // (Asumiendo que el botón "Cerrar sesión" tiene la clase 'boton-cerrar')
    const logoutButton = document.querySelector('.boton-cerrar');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Previene la navegación por defecto del enlace
            // Limpia cualquier dato de sesión del usuario
            sessionStorage.removeItem('allowPasswordReset'); // Si usas esta para controlar el reset
            sessionStorage.removeItem('resettingUser');
            // Podrías tener una variable de sesión para el usuario logueado
            // sessionStorage.removeItem('currentUser'); 

            alert('Sesión cerrada. Redirigiendo al login.');
            window.location.href = '../vistas/login.html'; // Redirige a la página de login
        });
    }

    // --- 3. Funcionalidad para las tarjetas de curso (ej. "Gestionar Curso") ---
    // No necesitamos una función aquí si el enlace ya tiene el `href` directamente.
    // La lógica para gestionar el curso se implementará en `gestion_curso_profesor.html`
    // donde se leerá el `cursoId` de la URL.

    // --- 4. Funciones de Carga de Datos (Conceptuales) ---
    // Estas funciones serían necesarias si los cursos no están hardcodeados
    // y quieres cargarlos dinámicamente, o para cargar estudiantes/calificaciones.

    /*
    // Ejemplo de cómo cargar cursos dinámicamente (requeriría un array de cursos en JS)
    function cargarCursosProfesor() {
        const cursosContenedor = document.querySelector('.cursos-contenedor');
        // Simulación de datos de cursos (en un escenario real, vendrían de una API o BD)
        const cursosDelProfesor = [
            { id: '11001', nombre: 'Fundamentos de la Computación', codigo: '11001 - Virtual 24/7', profesor: 'Camila Díaz Rosales', bg: 'bg-info' },
            { id: '11002', nombre: 'Fundamentos de Programación', codigo: '11002 - Virtual 24/7', profesor: 'Wilson Alirio Díaz', bg: 'bg-secondary' },
            // ... más cursos
        ];

        cursosContenedor.innerHTML = ''; // Limpiar el contenedor
        cursosDelProfesor.forEach(curso => {
            const cursoCard = document.createElement('div');
            cursoCard.className = `curso-card ${curso.bg} text-white`; // Añadir text-white para que las letras sean blancas
            cursoCard.innerHTML = `
                <img src="../img/imagen.jpg" alt="${curso.nombre}" class="curso-img">
                <div class="curso-info">
                    <h4>${curso.nombre}</h4>
                    <p>${curso.codigo}</p>
                    <em>${curso.profesor}</em>
                </div>
                <a href="../vistas/gestion_curso_profesor.html?cursoId=${curso.id}" class="btn btn-light btn-sm mt-3">Gestionar Curso</a>
            `;
            cursosContenedor.appendChild(cursoCard);
        });
    }

    // Llama a la función si quieres que los cursos se carguen dinámicamente
    // cargarCursosProfesor();
    */

    // --- 5. Lógica para páginas de detalle de curso (gestion_curso_profesor.html) ---
    // Esta lógica iría en un script *separado* para esa página, por ejemplo, `js/gestioncurso.js`
    // ya que solo se ejecuta cuando estás en esa página.

    /*
    // Ejemplo de cómo obtener el ID del curso de la URL en gestion_curso_profesor.html
    function getCursoIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cursoId');
    }

    if (window.location.pathname.includes('gestion_curso_profesor.html')) {
        const cursoId = getCursoIdFromUrl();
        if (cursoId) {
            console.log(`Cargando datos para el curso: ${cursoId}`);
            // Aquí llamarías a una función para cargar la lista de estudiantes
            // y el material para este curso.
            // cargarDetallesCurso(cursoId);
            // cargarEstudiantesCurso(cursoId);
        } else {
            console.warn('No se encontró cursoId en la URL.');
            // Quizás redirigir a una página de error o a la lista de cursos
        }
    }
    */

});