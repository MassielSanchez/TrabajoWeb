// js/index/index.js

// Importa la función para inicializar el carrusel
import { initializeCarousel } from './carousel.js';

// Importa la función para configurar el grid de carreras
import { setupCarrerasGrid } from './carreras.js';

// Opcional: Aquí podrías importar otras funciones si tuvieras más componentes JS en tu index
// Por ejemplo, para el menú móvil, o el formulario de contacto, etc.
// import { setupMobileMenu } from './aside.js';
// import { setupContactForm } from './contacto.js';


document.addEventListener('DOMContentLoaded', () => {
    console.log('js/index/index.js: DOMContentLoaded - Initializing page components.');

    // Llama a la función para inicializar el carrusel
    initializeCarousel();

    // Llama a la función para configurar el grid de carreras
    setupCarrerasGrid();

    // Llama a otras funciones si las tuvieras:
    // setupMobileMenu();
    // setupContactForm();
});