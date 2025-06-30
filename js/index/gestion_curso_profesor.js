function showWeekContent(weekId) {
        // Ocultar todos los contenidos de semana
        const allWeekContents = document.querySelectorAll('.week-content');
        allWeekContents.forEach(content => {
            content.classList.remove('active');
        });

        // Ocultar mensaje por defecto
        const defaultMessage = document.getElementById('default-message');
        defaultMessage.style.display = 'none';

        // Mostrar el contenido de la semana seleccionada
        if (weekId) {
            const selectedWeek = document.getElementById(weekId + '-content');
            if (selectedWeek) {
                selectedWeek.classList.add('active');
            }
        } else {
            // Si no hay selección, mostrar mensaje por defecto
            defaultMessage.style.display = 'block';
        }
    }

    function addMaterial(semana) {
        alert('Funcionalidad para agregar material a ' + semana + ' - Aquí se abriría un modal o formulario');
    }

    // Funcionalidad del menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.barra-lateral');
    const layoutContainer = document.querySelector('.layout-container');

    menuToggle.addEventListener('change', function() {
        if (this.checked) {
            sidebar.classList.add('open');
            layoutContainer.classList.add('menu-open');
        } else {
            sidebar.classList.remove('open');
            layoutContainer.classList.remove('menu-open');
        }
    });

    // Cerrar menú al hacer clic fuera de él en móvil
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && menuToggle.checked) {
            const clickedInsideSidebar = sidebar.contains(event.target);
            const clickedOnHamburger = event.target.closest('.hamburger');
            
            if (!clickedInsideSidebar && !clickedOnHamburger) {
                menuToggle.checked = false;
                sidebar.classList.remove('open');
                layoutContainer.classList.remove('menu-open');
            }
        }
    });