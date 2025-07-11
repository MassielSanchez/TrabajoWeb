// js/contacto.js
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('.formulario-contacto');
    const btnEnviar = formulario.querySelector('button[type="submit"]');
    const campos = {
        nombre: formulario.querySelector('#nombre'),
        correo: formulario.querySelector('#correo'),
        mensaje: formulario.querySelector('#mensaje')
    };

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo = 'success') {
        // Eliminar mensajes anteriores
        const mensajeAnterior = document.querySelector('.mensaje-formulario');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        // Crear nuevo mensaje
        const divMensaje = document.createElement('div');
        divMensaje.className = `mensaje-formulario mensaje-${tipo}`;
        divMensaje.innerHTML = `
            <p>${mensaje}</p>
            <button onclick="this.parentElement.remove()" class="cerrar-mensaje">&times;</button>
        `;

        // Insertar antes del formulario
        formulario.parentNode.insertBefore(divMensaje, formulario);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (divMensaje.parentNode) {
                divMensaje.remove();
            }
        }, 5000);
    }

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para validar nombre
    function validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
        return regex.test(nombre);
    }

    // Función para limpiar y validar datos
    function validarFormulario() {
        let errores = [];

        // Validar nombre
        const nombre = campos.nombre.value.trim();
        if (!nombre) {
            errores.push('El nombre es requerido');
        } else if (nombre.length > 100) {
            errores.push('El nombre es muy largo (máximo 100 caracteres)');
        } else if (!validarNombre(nombre)) {
            errores.push('El nombre solo puede contener letras, espacios y caracteres válidos (no números)');
        } else if (nombre.length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        }

        // Validar correo
        const correo = campos.correo.value.trim();
        if (!correo) {
            errores.push('El correo electrónico es requerido');
        } else if (!validarEmail(correo)) {
            errores.push('El correo electrónico no es válido');
        } else if (correo.length > 150) {
            errores.push('El correo es muy largo (máximo 150 caracteres)');
        }

        // Validar mensaje
        const mensaje = campos.mensaje.value.trim();
        if (!mensaje) {
            errores.push('El mensaje es requerido');
        } else if (mensaje.length > 1000) {
            errores.push('El mensaje es muy largo (máximo 1000 caracteres)');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            datos: { nombre, correo, mensaje }
        };
    }

    // Función para mostrar estado de carga
    function mostrarCargando(mostrar = true) {
        if (mostrar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';
            btnEnviar.classList.add('enviando');
        } else {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar';
            btnEnviar.classList.remove('enviando');
        }
    }

    // Función para limpiar formulario
    function limpiarFormulario() {
        campos.nombre.value = '';
        campos.correo.value = '';
        campos.mensaje.value = '';
    }

    // Manejar envío del formulario
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar formulario
        const validacion = validarFormulario();
        if (!validacion.valido) {
            mostrarMensaje(validacion.errores.join('<br>'), 'error');
            return;
        }

        // Mostrar estado de carga
        mostrarCargando(true);

        try {
            console.log('Enviando datos:', validacion.datos);
            
            const respuesta = await fetch('https://intec.sysitinspirate.com/api/contacto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(validacion.datos)
            });

            console.log('Respuesta recibida:', respuesta);

            // Verificar si la respuesta es JSON válido
            const contentType = respuesta.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textoRespuesta = await respuesta.text();
                console.error('Respuesta no es JSON:', textoRespuesta);
                throw new Error('La respuesta del servidor no es JSON válido');
            }

            let resultado;
            try {
                resultado = await respuesta.json();
                console.log('Resultado JSON:', resultado);
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                throw new Error('Respuesta inválida del servidor');
            }

            // Verificar si la operación fue exitosa
            if (resultado.success) {
                // Éxito
                mostrarMensaje(resultado.message, 'success');
                limpiarFormulario();
            } else {
                // Error del servidor
                console.error('Error del servidor:', resultado);
                throw new Error(resultado.error || 'Error desconocido del servidor');
            }

        } catch (error) {
            console.error('Error completo:', error);
            
            // Mostrar mensaje más específico según el tipo de error
            let mensajeError = 'Error al enviar el mensaje. ';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                mensajeError += 'Problema de conexión. Verifica tu conexión a internet.';
            } else if (error.message.includes('Respuesta inválida') || error.message.includes('JSON')) {
                mensajeError += 'Error en la respuesta del servidor. Contacta al administrador.';
            } else {
                mensajeError += error.message || 'Por favor, intenta de nuevo o contacta directamente por email.';
            }
            
            mostrarMensaje(mensajeError, 'error');
        } finally {
            // Ocultar estado de carga
            mostrarCargando(false);
        }
    });

    // Agregar validación en tiempo real para todos los campos
    Object.keys(campos).forEach(campo => {
        campos[campo].addEventListener('blur', function() {
            this.classList.remove('error');
            this.classList.remove('valido'); 
            
            if (this.value.trim()) {
                this.classList.add('valido');
            } else {
                this.classList.remove('valido');
            }
        });
    });

    // Validación especial para el campo nombre
    campos.nombre.addEventListener('input', function(e) {
        const valorOriginal = e.target.value;
        const valorLimpio = valorOriginal.replace(/[0-9]/g, '');
        e.target.value = valorLimpio;
        
        if (valorOriginal !== valorLimpio) {
            e.target.classList.add('error');
            setTimeout(() => {
                e.target.classList.remove('error');
            }, 1000);
        } else {
            e.target.classList.remove('error');
        }
    });
});