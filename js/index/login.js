// Simulación de la base de datos de usuarios
// ¡IMPORTANTE!: En un entorno real, estos datos vendrían de un servidor y no estarían en el frontend.
// Las contraseñas NUNCA se guardan en texto plano en una BD real, se usan hashes.
const usersDB = {
    // Usuario de ejemplo para profesor
    "c12345678": {
        password: "profepassword",
        type: "c", // 'c' para profesor (coach)
        securityQuestions: { // Solo si este usuario tiene preguntas de seguridad
            q1: "sol",
            q2: "lima",
            q3: "rodriguez"
        }
    },
    // Usuario de ejemplo para estudiante
    "u87654321": {
        password: "alumnopassword",
        type: "u" // 'u' para estudiante (alumno)
    },
    // Puedes añadir más usuarios aquí para probar, siguiendo el patrón u/c + 8 dígitos
    "c98765432": {
        password: "otroprofesor",
        type: "c"
    },
    "u11223344": {
        password: "otroalumno",
        type: "u"
    }
};

// Función para manejar el login (en login.html)
function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previene el envío del formulario por defecto

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.toLowerCase();
            const password = passwordInput.value;

            // Validación del formato del usuario antes de buscar en la DB
            const userPattern = /[uc][0-9]{8}/;
            if (!userPattern.test(username)) {
                alert('Formato de usuario incorrecto. Debe comenzar con "u" o "c" seguido de 8 dígitos.');
                return; // Detiene la ejecución si el formato es incorrecto
            }

            // Buscar el usuario en nuestra base de datos simulada
            if (usersDB[username] && usersDB[username].password === password) {
                const userType = usersDB[username].type;

                alert('¡Login exitoso! Redirigiendo...');

                // Redirección basada en el tipo de usuario
                if (userType === 'u') {
                    window.location.href = "inicioalumno.html"; // Página de inicio para estudiantes
                } else if (userType === 'c') {
                    window.location.href = "inicioprofesor.html"; // Página de inicio para profesores
                } else {
                    // Fallback si el tipo no está definido o es desconocido (poco probable con el pattern)
                    alert('Tipo de usuario desconocido. Redirigiendo a página general.');
                    window.location.href = "inicio.html"; // Una página de inicio general si existe
                }
            } else {
                alert('Usuario o contraseña incorrectos.');
                // Aquí podrías mostrar un mensaje de error en un elemento específico del HTML
                // Por ejemplo, un <p id="login-error-message" class="error-message"></p>
                // document.getElementById('login-error-message').textContent = 'Usuario o contraseña incorrectos.';
            }
        });
    }
}

// Función para manejar las preguntas de seguridad (en forgot_password.html)
// NOTA: Para que esta función sea útil en forgot_password.html, necesitarías una forma de saber
// qué usuario está intentando recuperar la contraseña antes de pedir las preguntas.
// Generalmente, se pide primero el usuario/email, luego se comprueban las preguntas para ESE usuario.
// Para este demo, sigue asumiendo "emily" si estás usándolo para pruebas,
// pero en un entorno real necesitarías ajustar cómo se determina el targetUser.
function handleSecurityQuestions() {
    const securityQuestionsForm = document.getElementById('securityQuestionsForm');
    const messageDiv = document.getElementById('message'); // El elemento <p> para mensajes

    if (securityQuestionsForm) {
        securityQuestionsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // EJEMPLO: Asumiendo que el usuario que intenta recuperar es "c12345678"
            // En un sistema real, el usuario ingresaría su nombre de usuario o email primero
            // y luego se cargaría este formulario con las preguntas para ESE usuario.
            // Asegúrate de que el usuario exista en usersDB y tenga preguntas de seguridad.
            const targetUser = usersDB["c12345678"]; 

            if (!targetUser || !targetUser.securityQuestions) {
                messageDiv.textContent = "Error: Este usuario no tiene preguntas de seguridad configuradas o no existe.";
                messageDiv.className = 'feedback-message error-message';
                return;
            }

            const q1Answer = document.getElementById('q1').value.toLowerCase().trim();
            const q2Answer = document.getElementById('q2').value.toLowerCase().trim();
            const q3Answer = document.getElementById('q3').value.toLowerCase().trim();

            const correctQ1 = targetUser.securityQuestions.q1.toLowerCase().trim();
            const correctQ2 = targetUser.securityQuestions.q2.toLowerCase().trim();
            const correctQ3 = targetUser.securityQuestions.q3.toLowerCase().trim();

            if (q1Answer === correctQ1 && q2Answer === correctQ2 && q3Answer === correctQ3) {
                messageDiv.textContent = "Respuestas correctas. Redirigiendo para cambiar la contraseña...";
                messageDiv.className = 'feedback-message success-message';
                sessionStorage.setItem('allowPasswordReset', 'true');
                sessionStorage.setItem('resettingUser', "c12345678"); // Guarda el usuario que está reseteando
                setTimeout(() => {
                    window.location.href = "reset_password.html";
                }, 1500);
            } else {
                messageDiv.textContent = "Una o más respuestas son incorrectas. No se puede cambiar la contraseña.";
                messageDiv.className = 'feedback-message error-message';
                sessionStorage.removeItem('allowPasswordReset');
                sessionStorage.removeItem('resettingUser');
            }
        });
    }
}

// Función para manejar el cambio de contraseña (en reset_password.html)
function handlePasswordReset() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetMessageDiv = document.getElementById('resetMessage');

    const allowReset = sessionStorage.getItem('allowPasswordReset');
    const usernameToReset = sessionStorage.getItem('resettingUser');

    // Verificar si el usuario tiene permiso para resetear la contraseña y si el usuario existe
    if (!allowReset || allowReset !== 'true' || !usernameToReset || !usersDB[usernameToReset]) {
        resetMessageDiv.textContent = "Acceso denegado. No tienes permiso para acceder a esta página directamente.";
        resetMessageDiv.className = 'feedback-message error-message';
        sessionStorage.removeItem('allowPasswordReset');
        sessionStorage.removeItem('resettingUser');
        setTimeout(() => {
            window.location.href = "login.html"; // Redirigir si no hay permiso
        }, 2000);
        return;
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword === "" || confirmPassword === "") {
                resetMessageDiv.textContent = "Por favor, completa ambos campos de contraseña.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            if (newPassword.length < 6) { // Ejemplo de validación de longitud
                resetMessageDiv.textContent = "La nueva contraseña debe tener al menos 6 caracteres.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            if (newPassword !== confirmPassword) {
                resetMessageDiv.textContent = "Las contraseñas no coinciden.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            // Actualizar la contraseña en nuestra simulación de DB
            usersDB[usernameToReset].password = newPassword; 
            
            resetMessageDiv.textContent = `¡Contraseña de "${usernameToReset}" actualizada exitosamente!`;
            resetMessageDiv.className = 'feedback-message success-message';

            // Limpiar el permiso y el usuario de reset y redirigir al login
            sessionStorage.removeItem('allowPasswordReset');
            sessionStorage.removeItem('resettingUser');
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        });
    }
}


// Inicializar funciones según la página actual
document.addEventListener('DOMContentLoaded', () => {
    // Si estás en login.html
    if (document.getElementById('loginForm')) {
        handleLogin();
    }
    // Si estás en forgot_password.html
    if (document.getElementById('securityQuestionsForm')) {
        handleSecurityQuestions();
    }
    // Si estás en reset_password.html
    if (document.getElementById('resetPasswordForm')) {
        handlePasswordReset();
    }
});
// Función para manejar las preguntas de seguridad (en forgot_password.html)
// *** MODIFICADO PARA DAR ACCESO SIEMPRE AL RESET DE CONTRASEÑA EN MODO DEMO ***
function handleSecurityQuestions() {
    const securityQuestionsForm = document.getElementById('securityQuestionsForm');
    const messageDiv = document.getElementById('message');

    if (securityQuestionsForm) {
        securityQuestionsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Comprobamos si los campos están vacíos para al menos simular una "interacción".
            // En este modo demo, cualquier respuesta no vacía se considera correcta.
            const q1Answer = document.getElementById('q1').value.toLowerCase().trim();
            const q2Answer = document.getElementById('q2').value.toLowerCase().trim();
            const q3Answer = document.getElementById('q3').value.toLowerCase().trim();

            if (q1Answer === "" || q2Answer === "" || q3Answer === "") {
                messageDiv.textContent = "Por favor, completa todas las preguntas (modo demo).";
                messageDiv.className = 'feedback-message error-message';
                return;
            }

            // Si los campos no están vacíos, se considera "exitoso" en este modo demo.
            // Siempre asumimos que el usuario que está reseteando es 'c12345678' para el demo.
            const usernameToReset = "c12345678"; // Asumimos este usuario para la simulación
            
            messageDiv.textContent = "Verificación de seguridad exitosa (modo demo). Redirigiendo para cambiar la contraseña...";
            messageDiv.className = 'feedback-message success-message';
            sessionStorage.setItem('allowPasswordReset', 'true');
            sessionStorage.setItem('resettingUser', usernameToReset); // Guarda el usuario "simulado" que está reseteando
            
            setTimeout(() => {
                window.location.href = "reset_password.html";
            }, 1500);
            // *** FIN DE LA MODIFICACIÓN PARA DEMO ***
        });
    }
}