<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_usuario = $_POST["id_usuario"];
    $nueva_contrasena = $_POST["nueva_contrasena"];
    $confirmar_contrasena = $_POST["confirmar_contrasena"];

    // Validar que no esté vacío
    if (empty($nueva_contrasena) || empty($confirmar_contrasena)) {
        echo "<script>alert('Por favor completa todos los campos.'); window.history.back();</script>";
        exit();
    }

    // Validar que coincidan
    if ($nueva_contrasena !== $confirmar_contrasena) {
        echo "<script>alert('Las contraseñas no coinciden.'); window.history.back();</script>";
        exit();
    }

    // Validar fuerza mínima de la contraseña (ejemplo simple)
    if (strlen($nueva_contrasena) < 6 || !preg_match("/[A-Z]/", $nueva_contrasena) || !preg_match("/[0-9]/", $nueva_contrasena)) {
        echo "<script>alert('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.'); window.history.back();</script>";
        exit();
    }

    // Encriptar y actualizar
    $hash = password_hash($nueva_contrasena, PASSWORD_DEFAULT);

    $sql = "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $hash, $id_usuario);

    if ($stmt->execute()) {
        echo "<script>alert('Contraseña actualizada correctamente.'); window.location.href = '../vistas/login.html';</script>";
    } else {
        echo "<script>alert('Error al actualizar la contraseña.'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../vistas/login.html");
    exit();
}