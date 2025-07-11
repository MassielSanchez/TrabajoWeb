<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json");

include 'conexion.php';

// Validar campos obligatorios
if (!isset($_POST['id'], $_POST['titulo'], $_POST['descripcion'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$id = intval($_POST['id']);
$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$fecha_modificacion = date("Y-m-d H:i:s");
$archivo_nombre = null;

// Verifica si se ha enviado un nuevo archivo para actualizar
if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    $archivo = $_FILES['archivo'];
    $nombreOrig = basename($archivo['name']);
    // Sanear el nombre del archivo para evitar problemas con rutas o caracteres especiales
    $nombreUnico = uniqid() . "_" . pathinfo($nombreOrig, PATHINFO_FILENAME) . "." . pathinfo($nombreOrig, PATHINFO_EXTENSION);
    $rutaDestino = __DIR__ . '/../archivos/' . $nombreUnico; // Asegúrate de que esta ruta es accesible y escribible

    // Mueve el archivo subido al directorio de destino
    if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
        $archivo_nombre = $nombreUnico;
    } else {
        // Si hay un error al mover el archivo, puedes registrarlo y devolver un error específico
        error_log("Error al mover el archivo a: " . $rutaDestino . " - Error: " . $archivo['error']);
        echo json_encode(["status" => "error", "message" => "Error al subir el archivo al servidor."]);
        exit;
    }
}

// Construye la consulta SQL dinámicamente
if ($archivo_nombre) {
    // Si se subió un nuevo archivo, actualiza también el campo 'archivo'
    $sql = "UPDATE materiales SET titulo = ?, descripcion = ?, fecha_modificacion = ?, archivo = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log("Error al preparar la consulta con archivo: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Error al preparar la actualización con archivo."]);
        exit;
    }
    $stmt->bind_param("ssssi", $titulo, $descripcion, $fecha_modificacion, $archivo_nombre, $id);
} else {
    // Si no se subió un nuevo archivo, solo actualiza titulo, descripcion y fecha_modificacion
    $sql = "UPDATE materiales SET titulo = ?, descripcion = ?, fecha_modificacion = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log("Error al preparar la consulta sin archivo: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Error al preparar la actualización sin archivo."]);
        exit;
    }
    $stmt->bind_param("sssi", $titulo, $descripcion, $fecha_modificacion, $id);
}

// Ejecuta la consulta
if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    error_log("Error al ejecutar la actualización: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Error al ejecutar la actualización en la base de datos: " . $stmt->error]);
}

$stmt->close();
$conn->close();

?>