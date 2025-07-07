    // Estado global
const state = {
    currentCourse: null,
    currentWeek: '',
    courses: {
    "11001": {
        nombre: "Fundamentos de la Computación",
        tipo: "Presencial",
        semanas: 16,
        color: "primary",
        materiales: {}
    },
    "11002": {
        nombre: "Fundamentos de Programación",
        tipo: "Presencial",
        semanas: 16,
        color: "text-light",
        materiales: {}
    },
    "11003": {
        nombre: "Cátedra Institucional",
        tipo: "Virtual 24/7",
        semanas: 16,
        color: "warning",
        materiales: {}
    },
    "11004": {
        nombre: "Álgebra",
        tipo: "Presencial",
        semanas: 16,
        color: "success",
        materiales: {}
    },
    "11005": {
        nombre: "Introducción a la Ingeniería de Sistemas ",
        tipo: "Presencial",
        semanas: 16,
        color: "danger",
        materiales: {}
    },
    "11006": {
        nombre: " Lectoescritura Académica ",
        tipo: "Virtual 24/7",
        semanas: 16,
        color: "text",
        materiales: {}
    },
    "11007": {
        nombre: "Pensamiento Algorítmico ",
        tipo: "Presencial",
        semanas: 16,
        color: "purple",
        materiales: {}
    }
    },
    formTypes: ['tarea', 'ppt', 'video', 'foro']
};

function saveToLocalStorage() {
    localStorage.setItem('coursesState', JSON.stringify({
        currentCourse: state.currentCourse,
        courses: state.courses
    }));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('coursesState');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Conservamos los datos iniciales pero actualizamos los materiales
        for (const cursoId in parsed.courses) {
            if (state.courses[cursoId]) {
                state.courses[cursoId].materiales = parsed.courses[cursoId].materiales || {};
            }
        }
        if (parsed.currentCourse && state.courses[parsed.currentCourse]) {
            state.currentCourse = parsed.currentCourse;
        }
    }
}

// Inicializar datos del curso al cargar
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('cursoId');
    
    if (!cursoId || !state.courses[cursoId]) {
        window.location.href = "inicioprofesor.html";
        return;
    }

    // Cargar datos guardados primero
    loadFromLocalStorage();
    
    // Establecer curso actual
    state.currentCourse = cursoId;
    
    // Inicializar semanas
    initSemanas(state.courses[cursoId].semanas);
    
    // Actualizar UI
    updateCourseUI();
});

function initSemanas(totalSemanas) {
    const weekSelect = document.getElementById('weekSelect');
    weekSelect.innerHTML = '<option value="">-- Seleccione una Semana --</option>';
    
    for (let i = 1; i <= totalSemanas; i++) {
        weekSelect.innerHTML += `<option value="week${i}">Semana ${i}</option>`;
    }
}

function updateCourseUI() {
    const curso = state.courses[state.currentCourse];
    document.getElementById('curso-titulo').textContent = curso.nombre;
    document.getElementById('curso-codigo').textContent = `Ambiente: ${state.currentCourse}`;
    
    // Opcional: Cambiar color según el curso
    document.documentElement.style.setProperty(
        '--color-primary', 
        `var(--bs-${cursosData[state.currentCourse]?.color || 'primary'})`
    );
}

// Funciones principales
function showWeekContent(weekValue) {
    hideAllForms();
    document.getElementById('default-message').style.display = 'none';
    document.querySelectorAll('.materials-list').forEach(list => list.classList.remove('active'));
    
    if (weekValue) {
        state.currentWeek = weekValue;
        document.getElementById('materialButtons').classList.add('active');
        
        // Inicializar semana si no existe
        if (!state.courses[state.currentCourse].materiales[weekValue]) {
            state.courses[state.currentCourse].materiales[weekValue] = [];
        }
        
        document.getElementById(`${weekValue}-materials`).classList.add('active');
        updateMaterialsView();
    } else {
        document.getElementById('materialButtons').classList.remove('active');
        state.currentWeek = '';
        document.getElementById('default-message').style.display = 'block';
    }
}

function addMaterial(type) {
    if (!state.currentWeek) {
        alert('Selecciona una semana primero.');
        return;
    }
    
    // Oculta todos los formularios y mensajes
    hideAllForms();
    document.getElementById('default-message').style.display = 'none';
    document.querySelectorAll('.materials-list').forEach(list => {
        list.classList.remove('active');
    });
    
    // Muestra el formulario seleccionado
    const formId = `${type}-form`;
    document.getElementById(formId).classList.add('active');
}

function saveMaterial(type) {
    const form = document.getElementById(`${type}-form`);
    let title, description;
    
    // Obtener valores según el tipo de formulario
    if (type === 'tarea') {
        title = document.getElementById('tarea-title').value;
        description = document.getElementById('tarea-description').value;
    } else if (type === 'ppt') {
        title = document.getElementById('ppt-title').value;
        description = 'Presentación subida';
    } else if (type === 'video') {
        title = document.getElementById('video-title').value;
        description = document.getElementById('video-url').value || 'Video subido';
    } else if (type === 'foro') {
        title = document.getElementById('foro-title').value;
        description = document.getElementById('foro-description').value;
    }

    if (!title) {
        alert('El título es obligatorio');
        return;
    }

    const material = {
        id: Date.now(),
        type: type,
        name: title,
        description: description,
        date: new Date().toLocaleDateString('es-ES'),
        files: ['ppt', 'tarea'].includes(type) ? 
            Array.from(form.querySelector('input[type="file"]').files) : []
    };

    // Guardar en el curso y semana actual
    if (!state.courses[state.currentCourse].materiales[state.currentWeek]) {
        state.courses[state.currentCourse].materiales[state.currentWeek] = [];
    }
    
    state.courses[state.currentCourse].materiales[state.currentWeek].push(material);
    updateMaterialsView();
    hideForm(type);
    resetForm(type);
    saveToLocalStorage();
}



// Funciones auxiliares
function hideAllForms() {
    state.formTypes.forEach(type => {
        const formId = `${type}-form`;
        document.getElementById(formId).classList.remove('active');
    });
}

function hideForm(type) {
    const formId = `${type}-form`;
    document.getElementById(formId).classList.remove('active');
    
    if (state.currentWeek) {
        document.getElementById(`${state.currentWeek}-materials`).classList.add('active');
    }
}

function resetForm(type) {
    const form = document.getElementById(`${type}-form`);
    
    if (type === 'tarea') {
        document.getElementById('tarea-title').value = '';
        document.getElementById('tarea-description').value = '';
        form.querySelector('input[type="file"]').value = '';
    } else if (type === 'ppt') {
        document.getElementById('ppt-title').value = '';
        form.querySelector('input[type="file"]').value = '';
    } else if (type === 'video') {
        document.getElementById('video-title').value = '';
        document.getElementById('video-url').value = '';
        form.querySelector('input[type="file"]').value = '';
    } else if (type === 'foro') {
        document.getElementById('foro-title').value = '';
        document.getElementById('foro-description').value = '';
    }
}

function updateMaterialsView() {
    if (!state.currentWeek || !state.currentCourse) return;
    
    const weekContent = document.getElementById(`${state.currentWeek}-content`);
    const curso = state.courses[state.currentCourse];
    const materiales = curso.materiales[state.currentWeek] || [];
    
    weekContent.innerHTML = materiales.length ? 
        materiales.map(createMaterialCard).join('') : 
        createEmptyState();
}

function createMaterialCard(material) {
    return `
        <div class="material-item" data-id="${material.id}">
            <div class="material-header">
                <div class="material-content">
                    <div class="file-type-icon file-type-${material.type}">
                        <i class="fas fa-${getIconForType(material.type)}"></i>
                    </div>
                    <div class="material-info">
                        <h4>${material.name}</h4>
                        <p>${material.description}</p>
                        <small>Creado: ${material.date}</small>
                        ${material.files?.length ? `<small>Archivos: ${material.files.length}</small>` : ''}
                    </div>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-outline-primary" 
                            onclick="editMaterialPrompt(${material.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="deleteMaterial(${material.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No hay materiales aún</h3>
            <p>Agrega el primer material educativo para esta semana.</p>
        </div>
    `;
}

// Funciones de gestión de materiales
function editMaterialPrompt(materialId) {
    const curso = state.courses[state.currentCourse];
    for (const week in curso.materiales) {
        const material = curso.materiales[week].find(m => m.id === materialId);
        if (material) {
            const newName = prompt('Nuevo nombre:', material.name);
            if (newName) {
                material.name = newName;
                const newDesc = prompt('Nueva descripción:', material.description);
                if (newDesc !== null) material.description = newDesc;
                updateMaterialsView();
                saveToLocalStorage();
            }
            break;
        }
    }
}

function deleteMaterial(materialId) {
    if (confirm('¿Estás seguro de eliminar este material?')) {
        const curso = state.courses[state.currentCourse];
        for (const week in curso.materiales) {
            const index = curso.materiales[week].findIndex(m => m.id === materialId);
            if (index !== -1) {
                curso.materiales[week].splice(index, 1);
                updateMaterialsView();
                saveToLocalStorage();
                break;
            }
        }
    }
}

// Helper
function getIconForType(type) {
    const icons = {
        'tarea': 'tasks',
        'foro': 'comments',
        'ppt': 'file-powerpoint',
        'video': 'video'
    };
    return icons[type] || 'file';
}

// Inicialización (opcional)
document.addEventListener('DOMContentLoaded', () => {
    // Puedes agregar inicializaciones aquí si es necesario
});