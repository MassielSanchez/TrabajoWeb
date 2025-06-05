document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const togglePassword = document.getElementById('togglePassword');

    // 1. Mostrar/Ocultar Contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            // Alterna el tipo de input entre 'password' y 'text'
            const type = contrasenaInput.getAttribute('type') === 'password' ? 'text' : 'password';
            contrasenaInput.setAttribute('type', type);

            // Cambia el ícono del ojo
            this.textContent = type === 'password' ? '👁️' : '🔒'; // Puedes usar '🙈' para ojo cerrado también
        });
    }

    // 2. Validación de Formulario al intentar enviar
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            // Previene el envío por defecto para manejar la validación con JS
            event.preventDefault();

            const usuarioValido = validarUsuario(usuarioInput.value);
            const contrasenaValida = validarContrasena(contrasenaInput.value);

            if (usuarioValido && contrasenaValida) {
                // Si ambos son válidos, puedes enviar el formulario o redirigir
                alert('¡Credenciales correctas! Redirigiendo...');
                // Aquí podrías, por ejemplo, hacer una petición AJAX o simplemente:
                this.submit(); // Envía el formulario si todo es correcto
            } else {
                let mensajeError = 'Por favor, corrige los siguientes errores:\n';
                if (!usuarioValido) {
                    mensajeError += '- El usuario debe comenzar con "U" o "u" y tener 8 dígitos (ej: u12345678).\n';
                }
                if (!contrasenaValida) {
                    mensajeError += '- La contraseña debe ser "untos".\n';
                }
                alert(mensajeError); // Muestra una alerta con los errores
            }
        });
    }

    // Función de validación de usuario (más flexible para U/u)
    function validarUsuario(usuario) {
        // Regex para 'U' o 'u' seguido de 8 dígitos
        const regexUsuario = /^[Uu][0-9]{8}$/;
        return regexUsuario.test(usuario);
    }

    // Función de validación de contraseña
    function validarContrasena(contrasena) {
        // La contraseña debe ser exactamente "untos"
        return contrasena === 'untos';
    }

    // Opcional: Validación en tiempo real para el campo de usuario (feedback inmediato)
    if (usuarioInput) {
        usuarioInput.addEventListener('input', function () {
            if (validarUsuario(this.value)) {
                this.style.borderColor = 'green'; // Feedback visual
            } else {
                this.style.borderColor = 'red'; // Feedback visual
            }
        });
    }
});
