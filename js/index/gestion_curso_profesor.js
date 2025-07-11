    // Estado global
const state = {
    currentCourse: null,
    currentWeek: '',
    editingMaterial: null,
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
    cargarMaterialesDesdeServidor();
    
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

    // Limpiar el estado de edición
    state.editingMaterial = null;
    
    // Oculta todos los formularios y mensajes
    hideAllForms();
    document.getElementById('default-message').style.display = 'none';
    document.querySelectorAll('.materials-list').forEach(list => {
        list.classList.remove('active');
    });
    
    // Limpiar el formulario antes de mostrarlo
    resetForm(type);
    
    // Actualizar el título del formulario
    updateFormTitle(type, false);

    // Muestra el formulario seleccionado
    const formId = `${type}-form`;
    document.getElementById(formId).classList.add('active');
}

// Función para editar materiales
function editMaterial(materialId) {
    const curso = state.courses[state.currentCourse];
    let material = null;
    let materialWeek = null;
    
    // Buscar el material en todas las semanas
    for (const week in curso.materiales) {

        console.log("Buscando material con ID:", materialId);
        console.log("Materiales semana", week, curso.materiales[week]);
        
        const foundMaterial = curso.materiales[week].find(m => parseInt(m.id) === parseInt(materialId));
        if (foundMaterial) {
            material = foundMaterial;
            materialWeek = week;
            break;
        }
    }
    
    if (!material) {
        alert('Material no encontrado');
        return;
    }
    
    // Establecer el material en edición
    state.editingMaterial = {
        id: materialId,
        week: materialWeek,
        type: material.type
    };
    
    // Asegurarse de que estamos en la semana correcta
    if (state.currentWeek !== materialWeek) {
        document.getElementById('weekSelect').value = materialWeek;
        showWeekContent(materialWeek);
    }
    
    // Ocultar formularios y listas
    hideAllForms();
    document.getElementById('default-message').style.display = 'none';
    document.querySelectorAll('.materials-list').forEach(list => {
        list.classList.remove('active');
    });
    
    // Cargar datos en el formulario
    loadMaterialDataIntoForm(material);
    
    // Actualizar el título del formulario
    updateFormTitle(material.type, true);
    
    // Mostrar el formulario
    const form = document.getElementById(`${material.type}-form`);
    form.classList.remove('hidden'); // 👈 quitar clase que oculta
    form.classList.add('active'); 
}

// Nueva función para cargar datos en el formulario
function loadMaterialDataIntoForm(material) {
    const type = material.type;
    
    if (type === 'tarea') {
        document.getElementById('tarea-title').value = material.name;
        document.getElementById('tarea-description').value = material.description;
    } else if (type === 'ppt') {
        document.getElementById('ppt-title').value = material.name;
    } else if (type === 'video') {
        document.getElementById('video-title').value = material.name;
        document.getElementById('video-url').value = material.description !== 'Video subido' ? material.description : '';
    } else if (type === 'foro') {
        document.getElementById('foro-title').value = material.name;
        document.getElementById('foro-description').value = material.description;
    }
}

// Nueva función para actualizar el título del formulario
function updateFormTitle(type, isEditing) {
    const titles = {
        'tarea': isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea',
        'ppt': isEditing ? 'Editar Presentación' : 'Subir Presentación',
        'video': isEditing ? 'Editar Video' : 'Agregar Video',
        'foro': isEditing ? 'Editar Foro' : 'Nuevo Foro'
    };
    
    const formTitle = document.querySelector(`#${type}-form h3`);
    if (formTitle) {
        const icon = formTitle.querySelector('i').outerHTML;
        formTitle.innerHTML = `${icon} ${titles[type]}`;
    }
    
    // Actualizar el texto del botón
    const button = document.querySelector(`#${type}-form .btn-primary`);
    if (button) {
        button.textContent = isEditing ? 'Actualizar' : getButtonText(type);
    }
}

function getButtonText(type) {
    const texts = {
        'tarea': 'Publicar',
        'ppt': 'Subir',
        'video': 'Guardar',
        'foro': 'Crear'
    };
    return texts[type] || 'Guardar';
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

    // Verificar si estamos editando o creando
    if (state.editingMaterial) {
        // Actualizar material existente
        updateExistingMaterial(title, description, type);
    } else {
        // Crear nuevo material
        createNewMaterial(title, description, type, form);
    }
    
    updateMaterialsView();
    hideForm(type);
    resetForm(type);
    saveToLocalStorage();
    
    // Limpiar el estado de edición
    state.editingMaterial = null;
}

function updateExistingMaterial(title, description, type) {
    const curso = state.courses[state.currentCourse];
    const materialWeek = state.editingMaterial.week;
    const materialId = state.editingMaterial.id;

    const materialIndex = curso.materiales[materialWeek].findIndex(m => parseInt(m.id) === parseInt(materialId));
    
    if (materialIndex !== -1) {
        curso.materiales[materialWeek][materialIndex].name = title;
        curso.materiales[materialWeek][materialIndex].description = description;
        curso.materiales[materialWeek][materialIndex].lastModified = new Date().toLocaleDateString('es-ES');
    }

    // Preparar FormData para enviar los datos, incluyendo el archivo si existe
    const formData = new FormData();
    formData.append('id', materialId);
    formData.append('titulo', title);
    formData.append('descripcion', description);

    // Obtener el input de archivo correspondiente al formulario que se está editando
    const form = document.getElementById(`${type}-form`);
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
        formData.append('archivo', fileInput.files[0]); 
    }

    // Actualizar también en la base de datos remota
    fetch('https://intec.sysitinspirate.com/api/actualizar_material.php', {
        method: 'POST',
        body: formData 
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            console.log(' Material actualizado en la base de datos');
            updateMaterialsView();
            saveToLocalStorage();
        } else {
            console.error(' Error al actualizar en la base de datos:', data.message);
            alert('Error al actualizar el material: ' + data.message); // Notificar al usuario
        }
    })
    .catch(err => {
        console.error(' Error de red al actualizar:', err);
        alert('No se pudo conectar con el servidor para actualizar el material.'); // Notificar al usuario
    })
    .finally(() => {
        state.editingMaterial = null;
        hideForm(type);
        resetForm(type);
    });
}

function cargarMaterialesDesdeServidor() {
    fetch(`https://intec.sysitinspirate.com/api/obtener_materiales.php?curso_id=${state.currentCourse}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                const materiales = data.materiales;
                for (const item of materiales) {
                    const semana = item.semana;
                    if (!state.courses[state.currentCourse].materiales[semana]) {
                        state.courses[state.currentCourse].materiales[semana] = [];
                    }
                    state.courses[state.currentCourse].materiales[semana].push({
                        id: parseInt(item.id),
                        type: item.tipo,
                        name: item.titulo,
                        description: item.descripcion,
                        date: item.fecha_creacion,
                        lastModified: item.fecha_modificacion || null,
                        files: []
                    });
                }
                updateMaterialsView();
            } else {
                console.error('Error al cargar materiales:', data.message);
            }
        })
        .catch(err => console.error('Error de conexión al servidor:', err));
}

function createNewMaterial(title, description, type, form) {
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
 
    const material = {
        id: Date.now(), // ID temporal
        type,
        name: title,
        description,
        date: new Date().toLocaleDateString('es-ES'),
        files: file ? [file.name] : []
    };

    // Guardar en el curso y semana actual
    if (!state.courses[state.currentCourse].materiales[state.currentWeek]) {
        state.courses[state.currentCourse].materiales[state.currentWeek] = [];
    }
    state.courses[state.currentCourse].materiales[state.currentWeek].push(material);

    // Guardar en el servidor
    const formData = new FormData();
    formData.append('curso_id', state.currentCourse);
    formData.append('semana', state.currentWeek);
    formData.append('tipo', type);
    formData.append('titulo', title);
    formData.append('descripcion', description);
    if (file) {
        formData.append('archivo', file); // Agregar el archivo real
    }

    // Guardar también en la base de datos remota
    fetch('https://intec.sysitinspirate.com/api/guardar_material.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            // Reemplazar ID temporal
            const nuevosMateriales = state.courses[state.currentCourse].materiales[state.currentWeek];
            if (nuevosMateriales && nuevosMateriales.length > 0) {
                nuevosMateriales[nuevosMateriales.length - 1].id = parseInt(data.id);
            }
            updateMaterialsView();
            console.log(' Material guardado con archivo. ID:', data.id);
        } else {
            console.error(' Error al guardar material:', data.message);
        }
    })
    .catch(err => console.error(' Error de red:', err));
}

// Funciones auxiliares
function hideAllForms() {
    state.formTypes.forEach(type => {
        const formId = `${type}-form`;
        const form = document.getElementById(formId);
        form.classList.remove('active');
        form.classList.add('hidden');
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
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    } else if (type === 'ppt') {
        document.getElementById('ppt-title').value = '';
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    } else if (type === 'video') {
        document.getElementById('video-title').value = '';
        document.getElementById('video-url').value = '';
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
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
    const lastModified = material.lastModified ? 
        `<small>Modificado: ${material.lastModified}</small>` : '';
    
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
                        ${lastModified}
                        ${material.files?.length ? `<small>Archivos: ${material.files.length}</small>` : ''}
                    </div>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-outline-primary" 
                            onclick="editMaterial(${material.id})">
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

// Función de edición antigua 
function editMaterialPrompt(materialId) {
    // Redirigir a la nueva función de edición
    editMaterial(materialId);
}

function deleteMaterial(materialId) {
    if (confirm('¿Estás seguro de eliminar este material?')) {
        fetch('https://intec.sysitinspirate.com/api/eliminar_material.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: materialId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // 1. Eliminar del estado local
                const curso = state.courses[state.currentCourse];
                for (const week in curso.materiales) {
                    const index = curso.materiales[week].findIndex(m => parseInt(m.id) === parseInt(materialId));
                    if (index !== -1) {
                        curso.materiales[week].splice(index, 1);
                        break;
                    }
                }

                // 2. Actualizar vista local
                updateMaterialsView();
                saveToLocalStorage();

                // 3. Mostrar mensaje opcional
                console.log(" Material eliminado correctamente.");
            } else {
                alert('Error al eliminar en la base de datos: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error al conectar con el servidor:', err);
            alert('No se pudo conectar con el servidor');
        });
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
});