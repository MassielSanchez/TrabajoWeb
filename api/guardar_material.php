<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'conexion.php';

// Validar campos obligatorios
if (!isset($_POST['curso_id'], $_POST['semana'], $_POST['tipo'], $_POST['titulo'], $_POST['descripcion'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$curso_id       = $_POST['curso_id'];
$semana         = $_POST['semana'];
$tipo           = $_POST['tipo'];
$titulo         = $_POST['titulo'];
$descripcion    = $_POST['descripcion'];
$fecha_creacion = date("Y-m-d");
$archivo_nombre = null;

// Procesar archivo si se envió
if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    $archivo     = $_FILES['archivo'];
    $nombreOrig  = basename($archivo['name']);
    // Generar nombre único y ruta de destino
    $nombreUnico = uniqid() . "_" . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $nombreOrig);
    $rutaDestino = __DIR__ . '/../archivos/' . $nombreUnico;

    if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
        // Guardamos solo el nombre para luego construir la URL en el frontend
        $archivo_nombre = $nombreUnico;
    } else {
        echo json_encode(["status" => "error", "message" => "Error al subir archivo"]);
        exit;
    }
}

// Insertar en la base de datos (modificar tu tabla para incluir campo `archivo`)
$sql = "INSERT INTO materiales 
    (curso_id, semana, tipo, titulo, descripcion, fecha_creacion, archivo) 
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => $conn->error]);
    exit;
}

$stmt->bind_param(
    "issssss",
    $curso_id,
    $semana,
    $tipo,
    $titulo,
    $descripcion,
    $fecha_creacion,
    $archivo_nombre
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>