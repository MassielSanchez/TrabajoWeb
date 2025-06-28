// Variable global para almacenar las carreras
let infoCarreras = {};

// Función para construir URL completa de imagen
function construirURLImagen(url) {
    if (!url) return 'img/default-icon.png';
    
    if (url.startsWith('http')) {
        return url;
    }
    
    const baseURL = 'https://intec.sysitinspirate.com/';
    return baseURL + url;
}

// Función para mostrar estado de carga
function mostrarEstadoCarga(grid) {
    grid.innerHTML = `
        <div class="loading-carreras" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
            <div style="font-size: 18px; margin-bottom: 10px;">🔄 Cargando carreras...</div>
            <div style="font-size: 14px;">Conectando con el servidor...</div>
        </div>
    `;
}

// Función para mostrar mensaje cuando no hay carreras
function mostrarSinCarreras(grid) {
    grid.innerHTML = `
        <div class="no-carreras" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
            <h3 style="color: #666; margin-bottom: 15px;">📚 No hay carreras disponibles</h3>
            <p>No se encontraron carreras en la base de datos.</p>
            <button onclick="cargarCarreras()" style="margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                🔄 Recargar
            </button>
        </div>
    `;
}

// Función para mostrar error
function mostrarError(grid, error) {
    console.error('Error completo:', error);
    grid.innerHTML = `
        <div class="error-carreras" style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffeaea; border-radius: 8px; border-left: 4px solid #e74c3c;">
            <h3 style="color: #e74c3c; margin-bottom: 15px;">⚠️ Error al cargar las carreras</h3>
            <p style="color: #666; margin-bottom: 10px;">No se pudieron cargar las carreras desde el servidor.</p>
            <details style="margin: 15px 0; text-align: left;">
                <summary style="cursor: pointer; color: #e74c3c; font-weight: bold;">Ver detalles del error</summary>
                <pre style="background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; margin-top: 10px;">${error.message}</pre>
                <pre style="background: #f1f2f6; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 11px; margin-top: 5px;">Stack: ${error.stack || 'No disponible'}</pre>
            </details>
            <button onclick="cargarCarreras()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                🔄 Reintentar
            </button>
        </div>
    `;
}

// Función para procesar y mostrar carreras
function procesarCarreras(carreras, grid) {
    grid.innerHTML = '';
    infoCarreras = {};

    console.log(`📊 Procesando ${carreras.length} carreras...`);

    carreras.forEach((carrera, index) => {
        console.log(`Procesando carrera ${index + 1}:`, carrera.nombre);
        
        // Crear ID único para la carrera
        const id = carrera.nombre.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Crear el elemento de la tarjeta
        const card = document.createElement('div');
        card.classList.add('carrera', 'carrera-card');
        card.setAttribute('data-carrera', id);
        
        // Construir URLs de imágenes
        const iconoUrl = construirURLImagen(carrera.icono_url);
        const imagenDetalleUrl = construirURLImagen(carrera.imagen_detalle_url);
        
        card.innerHTML = `
            <div class="carrera-imagen-contenedor">
                <img src="${iconoUrl}" 
                     alt="Icono de ${carrera.nombre}" 
                     class="carrera-imagen" 
                     loading="lazy"
                     onerror="this.src='img/default-icon.png';">
            </div>
            <div class="carrera-info">
                <h3>${carrera.nombre}</h3>
                <p class="carrera-descripcion-corta">${carrera.descripcion_corta || 'Descripción no disponible'}</p>
                <div class="carrera-duracion">${carrera.duracion_años} años</div>
            </div>
        `;
        
        grid.appendChild(card);

        // Procesar títulos
        const titulos = carrera.titulos_otorga ? carrera.titulos_otorga.split('\n').filter(t => t.trim()) : [];
        
        // Guardar información completa de la carrera
        infoCarreras[id] = {
            titulo: carrera.nombre,
            descripcion: carrera.descripcion_corta || '',
            descripcionLarga: carrera.descripcion_larga || carrera.descripcion_corta || 'Descripción no disponible',
            imagen: imagenDetalleUrl,
            titulo_otorgado_bachiller: titulos[0] || `Bachiller universitario en ${carrera.nombre}`,
            titulo_otorgado_profesional: titulos[1] || `Título profesional en ${carrera.nombre}`,
            duracion: carrera.duracion_años ? `${carrera.duracion_años} años` : 'No especificada',
            mallaCurricularPDF: construirURLImagen(carrera.malla_curricular_url)
        };
    });

    // Configurar eventos después de crear las tarjetas
    setupCarrerasGrid();
    console.log('✅ Carreras procesadas y mostradas correctamente');
}

// Función principal para cargar carreras desde la API
async function cargarCarreras() {
    console.log('🚀 Iniciando carga de carreras...');
    
    const grid = document.querySelector('.carreras-grid');
    if (!grid) {
        console.error('❌ No se encontró el elemento .carreras-grid');
        console.log('Elementos con clase carreras encontrados:', document.querySelectorAll('[class*="carrera"]'));
        return;
    }

    console.log('✅ Grid encontrado:', grid);

    // Mostrar estado de carga
    mostrarEstadoCarga(grid);

    const urlCarreras = 'https://intec.sysitinspirate.com/api/carreras.php';

    try {
        console.log('🌐 Petición a:', urlCarreras);
        
        const response = await fetch(urlCarreras, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            mode: 'cors'
        });

        console.log('📡 Estado de respuesta:', response.status, response.statusText);
        console.log('📡 Headers de respuesta:', [...response.headers.entries()]);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Respuesta no es JSON:', text);
            throw new Error('La respuesta del servidor no es JSON válido');
        }

        const data = await response.json();
        console.log('✅ Datos recibidos:', data);

        // Validar estructura de respuesta
        if (!data || typeof data !== 'object') {
            throw new Error('Respuesta inválida del servidor');
        }

        if (!data.success) {
            throw new Error('La API reportó un error: ' + (data.message || 'Error desconocido'));
        }

        if (!Array.isArray(data.data)) {
            throw new Error('Los datos recibidos no tienen el formato esperado');
        }

        if (data.data.length === 0) {
            console.warn('⚠️ No hay carreras en la respuesta');
            mostrarSinCarreras(grid);
            return;
        }

        // Procesar y mostrar carreras
        procesarCarreras(data.data, grid);
        
        // Mostrar mensaje de éxito
        console.log(`✅ ${data.data.length} carreras cargadas correctamente`);

    } catch (error) {
        console.error('❌ Error al cargar carreras:', error);
        mostrarError(grid, error);
    }
}

// Función para crear información detallada de carrera
function crearInfoCarrera(info) {
    const div = document.createElement('div');
    div.classList.add('info-carrera-dinamico');

    let mallaHTML = '';
    if (info.mallaCurricularPDF && info.mallaCurricularPDF !== 'img/default-icon.png') {
        mallaHTML = `<p><a href="${info.mallaCurricularPDF}" target="_blank" class="btn-malla" rel="noopener noreferrer">📄 Ver Malla Curricular</a></p>`;
    }

    div.innerHTML = `
        <div class="info-carrera-contenido">
            <div class="info-texto">
                <p class="descripcion-larga">${info.descripcionLarga}</p>
                <div class="titulos-otorgados">
                    <h4>🎓 Títulos que otorgamos:</h4>
                    <ul>
                        <li><strong>Grado Académico:</strong> ${info.titulo_otorgado_bachiller}</li>
                        <li><strong>Título Profesional:</strong> ${info.titulo_otorgado_profesional}</li>
                    </ul>
                </div>
                <p><strong>⏱️ Duración:</strong> ${info.duracion}</p>
                ${mallaHTML}
            </div>
            <div class="info-imagen">
                <img src="${info.imagen}" alt="Imagen de ${info.titulo}" class="imagen-carrera" 
                     loading="lazy" onerror="this.style.display='none';">
            </div>
        </div>
        <button class="btn-cerrar-info" onclick="this.parentElement.remove()" aria-label="Cerrar información">✕ Cerrar</button>
    `;

    return div;
}

// Función para configurar eventos del grid
function setupCarrerasGrid() {
    const carrerasGrid = document.querySelector('.carreras-grid');
    if (!carrerasGrid) {
        console.warn('⚠️ No se encontró .carreras-grid para configurar eventos');
        return;
    }

    // Remover listeners previos si existen
    const newGrid = carrerasGrid.cloneNode(true);
    carrerasGrid.parentNode.replaceChild(newGrid, carrerasGrid);
    
    // Usar delegación de eventos
    newGrid.addEventListener('click', handleCarreraClick);
    console.log('✅ Event listeners configurados para carreras');
}

// Función para manejar clicks en carreras
function handleCarreraClick(event) {
    const carreraElemento = event.target.closest('.carrera');
    if (!carreraElemento) return;

    const carreraId = carreraElemento.dataset.carrera;
    console.log('🎯 Carrera clickeada:', carreraId);
    
    // Remover información previa si existe
    const existente = document.querySelector('.info-carrera-dinamico');
    if (existente) {
        existente.remove();
    }

    const info = infoCarreras[carreraId];
    if (info) {
        const nuevoInfoDiv = crearInfoCarrera(info);
        carreraElemento.parentNode.insertBefore(nuevoInfoDiv, carreraElemento.nextSibling);
        
        // Scroll suave hacia la información
        setTimeout(() => {
            nuevoInfoDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    } else {
        console.error('❌ No se encontró información para la carrera:', carreraId);
    }
}

// Función de debugging mejorada
function debugCarreras() {
    console.log('🔍 Estado actual de carreras:');
    console.log('Carreras cargadas:', Object.keys(infoCarreras).length);
    console.log('Datos de carreras:', infoCarreras);
    
    const grid = document.querySelector('.carreras-grid');
    const tarjetas = grid ? grid.querySelectorAll('.carrera-card') : [];
    console.log('Tarjetas en el DOM:', tarjetas.length);
    
    // Información adicional de debug
    console.log('Grid element:', grid);
    console.log('Grid innerHTML length:', grid ? grid.innerHTML.length : 0);
    
    // Probar la URL de la API directamente
    console.log('🧪 Probando URL de API...');
    fetch('https://intec.sysitinspirate.com/api/carreras.php')
        .then(response => {
            console.log('API Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('API Response data:', data);
        })
        .catch(error => {
            console.error('API Test error:', error);
        });
    
    return {
        carrerasData: infoCarreras,
        tarjetasCount: tarjetas.length,
        gridElement: grid,
        gridHTML: grid ? grid.innerHTML : null
    };
}

// Función para verificar si el DOM está listo
function domReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// Función de inicialización más robusta
function inicializar() {
    console.log('🚀 Inicializando carreras...');
    console.log('Document ready state:', document.readyState);
    
    // Verificar múltiples veces el grid
    let intentos = 0;
    const maxIntentos = 10;
    
    function buscarGrid() {
        const grid = document.querySelector('.carreras-grid');
        
        if (grid) {
            console.log('✅ Grid encontrado, cargando carreras...');
            cargarCarreras();
            return;
        }
        
        intentos++;
        if (intentos < maxIntentos) {
            console.log(`⏳ Intento ${intentos}/${maxIntentos} - Grid no encontrado, reintentando...`);
            setTimeout(buscarGrid, 500);
        } else {
            console.error('❌ Grid no encontrado después de todos los intentos');
            console.log('Elementos disponibles:', document.querySelectorAll('[class*="carrera"]'));
        }
    }
    
    buscarGrid();
}

// Hacer funciones disponibles globalmente
window.cargarCarreras = cargarCarreras;
window.debugCarreras = debugCarreras;

// Inicialización cuando el DOM esté listo
domReady(inicializar);

// Manejar errores de imágenes
window.addEventListener('error', function(event) {
    if (event.target && event.target.tagName === 'IMG') {
        console.warn('⚠️ Error cargando imagen:', event.target.src);
    }
});

console.log('📝 Script carreras.js cargado completamente');