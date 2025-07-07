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

    // Función para mostrar mensaje de error debajo de un campo específico
    function mostrarMensajeCampo(campoElement, mensaje, tipo = 'error-campo') {
        // Eliminar mensaje anterior para este campo
        const mensajeAnteriorCampo = campoElement.nextElementSibling;
        if (mensajeAnteriorCampo && mensajeAnteriorCampo.classList.contains('mensaje-error-campo')) {
            mensajeAnteriorCampo.remove();
        }

        const divMensaje = document.createElement('div');
        divMensaje.className = `mensaje-error-campo mensaje-${tipo}`;
        divMensaje.textContent = mensaje;
        campoElement.parentNode.insertBefore(divMensaje, campoElement.nextSibling);

        // Auto-eliminar después de 2 segundos
        setTimeout(() => {
            if (divMensaje.parentNode) {
                divMensaje.remove();
            }
        }, 2000);
    }

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para validar nombre (solo letras, espacios, acentos, ñ, guiones y apostrofes, sin números)
    function validarNombre(nombre) {
        // Permite letras, espacios, acentos, ñ, guiones y apostrofes. NO permite números.
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
            const respuesta = await fetch('contacto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validacion.datos)
            });

            // Verificar si la respuesta es JSON válido
            let resultado;
            try {
                resultado = await respuesta.json();
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                throw new Error('Respuesta inválida del servidor');
            }

            if (respuesta.ok && resultado.success) {
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
            } else if (error.message.includes('Respuesta inválida')) {
                mensajeError += 'Error en la respuesta del servidor.';
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
            // Limpia clases de error/valido para evitar que persistan si el usuario corrige
            this.classList.remove('error');
            this.classList.remove('valido'); 
            
            // Re-evalúa si el campo tiene contenido para aplicar 'valido'
            if (this.value.trim()) {
                this.classList.add('valido');
            } else {
                this.classList.remove('valido');
            }
        });
    });

    // Validación especial para el campo nombre (evitar números mientras se escribe y mostrar feedback)
    campos.nombre.addEventListener('input', function(e) {
        const valorOriginal = e.target.value;
        // Eliminar números del input en tiempo real
        const valorLimpio = valorOriginal.replace(/[0-9]/g, '');
        e.target.value = valorLimpio;
        
        // Si el valor original contenía números, activa la clase de error y la animación
        if (valorOriginal !== valorLimpio) {
            e.target.classList.add('error');
            // Elimina la clase de error después de un breve tiempo para el efecto visual
            setTimeout(() => {
                e.target.classList.remove('error');
            }, 1000); // 1 segundo
        } else {
            // Si no hay números, asegúrate de que la clase 'error' se retire
            e.target.classList.remove('error');
        }
    });
});