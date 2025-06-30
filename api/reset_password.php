<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_usuario = $_POST["id_usuario"];
    $nueva_contrasena = $_POST["nueva_contrasena"];
    $confirmar_contrasena = $_POST["confirmar_contrasena"];

    // Validar que coincidan
    if ($nueva_contrasena !== $confirmar_contrasena) {
        echo "Las contraseñas no coinciden.";
        exit;
    }

    // Validar requisitos de seguridad (8+ caracteres, mayúscula, minúscula, número, símbolo)
    if (!preg_match("/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/", $nueva_contrasena)) {
        echo "La contraseña no cumple con los requisitos de seguridad.";
        exit;
    }

    // Hashear la nueva contraseña
    $contrasena_hash = password_hash($nueva_contrasena, PASSWORD_BCRYPT);

    // Actualizar en la base de datos
    $sql = "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $contrasena_hash, $id_usuario);

    if ($stmt->execute()) {
        // Redirigir al login
        header("Location: ../vistas/login.html?success=1");
        exit();
    } else {
        echo "Error al actualizar la contraseña. Intenta nuevamente.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Acceso no autorizado.";
}
?>