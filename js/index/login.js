// Simulación de la base de datos de usuarios
const usersDB = {
    "c12345678": {
        password: "profepassword",
        type: "c",
        securityQuestions: {
            q1: "sol",
            q2: "lima",
            q3: "rodriguez"
        }
    },
    "u87654321": {
        password: "alumnopassword",
        type: "u"
    },
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
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.toLowerCase();
            const password = passwordInput.value;

            const userPattern = /[uc][0-9]{8}/;
            if (!userPattern.test(username)) {
                alert('Formato de usuario incorrecto. Debe comenzar con "u" o "c" seguido de 8 dígitos.');
                return;
            }

            if (usersDB[username] && usersDB[username].password === password) {
                const userType = usersDB[username].type;
                alert('¡Login exitoso! Redirigiendo...');
                if (userType === 'u') {
                    window.location.href = "inicioalumno.html";
                } else if (userType === 'c') {
                   window.location.href = "inicioprofesor.html";
                } else {
                    alert('Tipo de usuario desconocido. Redirigiendo a página general.');
                    window.location.href = "inicio.html";
                }
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        });
    }
}

// Función para manejar las preguntas de seguridad (en forgot_password.html)
function handleSecurityQuestions() {
    const securityQuestionsForm = document.getElementById('securityQuestionsForm');
    const messageDiv = document.getElementById('message');

    if (securityQuestionsForm) {
        securityQuestionsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const q1Answer = document.getElementById('q1').value.toLowerCase().trim();
            const q2Answer = document.getElementById('q2').value.toLowerCase().trim();
            const q3Answer = document.getElementById('q3').value.toLowerCase().trim();

            if (q1Answer === "" || q2Answer === "" || q3Answer === "") {
                messageDiv.textContent = "Por favor, completa todas las preguntas (modo demo).";
                messageDiv.className = 'feedback-message error-message';
                return;
            }

            const usernameToReset = "c12345678"; // Asumimos este usuario para la simulación
            
            messageDiv.textContent = "Verificación de seguridad exitosa (modo demo). Redirigiendo para cambiar la contraseña...";
            messageDiv.className = 'feedback-message success-message';
            sessionStorage.setItem('allowPasswordReset', 'true');
            sessionStorage.setItem('resettingUser', usernameToReset);
            
            setTimeout(() => {
                window.location.href = "reset_password.html";
            }, 1500);
        });
    }
}

// Función para manejar el cambio de contraseña (en reset_password.html)
function handlePasswordReset() {
    console.log("handlePasswordReset() se ha ejecutado."); // Debugging
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetMessageDiv = document.getElementById('resetMessage');

    const successModal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');

    const allowReset = sessionStorage.getItem('allowPasswordReset');
    const usernameToReset = sessionStorage.getItem('resettingUser');

    // Verificar si el usuario tiene permiso para resetear la contraseña y si el usuario existe
    if (!allowReset || allowReset !== 'true' || !usernameToReset || !usersDB[usernameToReset]) {
        if(resetMessageDiv) {
            resetMessageDiv.textContent = "Acceso denegado. No tienes permiso para acceder a esta página directamente.";
            resetMessageDiv.className = 'feedback-message error-message';
        }
        sessionStorage.removeItem('allowPasswordReset');
        sessionStorage.removeItem('resettingUser');
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        return;
    }

    if (resetPasswordForm) {
        console.log("Formulario de reset de contraseña (resetPasswordForm) encontrado."); // Debugging
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Evento submit del formulario de reset detectado."); // Debugging

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // 1. Validación de campos vacíos
            if (newPassword === "" || confirmPassword === "") {
                resetMessageDiv.textContent = "Por favor, completa ambos campos de contraseña.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            // 2. Validación de longitud mínima (ejemplo)
            if (newPassword.length < 6) {
                resetMessageDiv.textContent = "La nueva contraseña debe tener al menos 6 caracteres.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            // 3. Validación de coincidencia de contraseñas
            if (newPassword !== confirmPassword) {
                resetMessageDiv.textContent = "Las contraseñas no coinciden. Por favor, asegúrate de que ambos campos sean iguales.";
                resetMessageDiv.className = 'feedback-message error-message';
                return;
            }

            // Si todas las validaciones pasan:
            usersDB[usernameToReset].password = newPassword; 
            
            if (successModal && modalMessage) {
                modalMessage.textContent = `¡Contraseña actualizada correctamente!`;
                successModal.style.display = 'block'; // Usamos block para la animación
                setTimeout(() => {
                    successModal.classList.add('show'); // Añade la clase para activar la animación
                }, 10); 

                // Limpiar sessionStorage y redirigir después de 2 segundos (ajusta el tiempo si quieres)
                setTimeout(() => {
                    successModal.classList.remove('show'); // Quita la clase para la animación de salida
                    setTimeout(() => {
                        successModal.style.display = 'none'; // Oculta el modal al finalizar la animación
                        sessionStorage.removeItem('allowPasswordReset');
                        sessionStorage.removeItem('resettingUser');
                        window.location.href = "login.html"; // Redirige al login
                    }, 500); // Espera a que termine la animación de salida (0.5s)
                }, 2000); // Modal visible por 2 segundos
            } else {
                resetMessageDiv.textContent = `¡Contraseña de "${usernameToReset}" actualizada exitosamente!`;
                resetMessageDiv.className = 'feedback-message success-message';
                sessionStorage.removeItem('allowPasswordReset');
                sessionStorage.removeItem('resettingUser');
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }
        });
    } else {
        console.error("ERROR: Formulario de reset de contraseña (resetPasswordForm) NO encontrado."); // Debugging
    }

    // Asegurarse de que no haya listeners de cierre manuales aquí
    // ya que el cierre es automático ahora.
}

// Inicializar funciones según la página actual
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded: Página cargada."); // Debugging
    if (document.getElementById('loginForm')) {
        console.log("loginForm detectado. Ejecutando handleLogin()."); // Debugging
        handleLogin();
    }
    if (document.getElementById('securityQuestionsForm')) {
        console.log("securityQuestionsForm detectado. Ejecutando handleSecurityQuestions()."); // Debugging
        handleSecurityQuestions();
    }
    if (document.getElementById('resetPasswordForm')) {
        console.log("resetPasswordForm detectado. Ejecutando handlePasswordReset()."); // Debugging
        handlePasswordReset();
    }
})