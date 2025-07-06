<?php
session_start();
header('Content-Type: application/json');
include("conexion.php");

// Validar si existe sesión de profesor
$id_profesor = $_SESSION['id_profesor'] ?? null;

if (!$id_profesor) {
    echo json_encode([
        "error" => true,
        "mensaje" => "No hay sesión activa para el profesor.",
        "debug_session" => $_SESSION
    ]);
    exit();
}

try {
    // Consulta a los cursos del profesor
    $stmt = $conn->prepare("SELECT id_curso, nombre, modalidad, seccion FROM cursos_docente WHERE id_profesor = ?");
    $stmt->execute([$id_profesor]);
    $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($cursos); // ← se envía directamente el arreglo para el frontend
} catch (PDOException $e) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Error en la base de datos",
        "exception" => $e->getMessage()
    ]);
}
?>