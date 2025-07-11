<?php
// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Detectar origen dinámicamente
$origen = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origen");
header("Access-Control-Allow-Credentials: true");

// CORS y tipo de contenido
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

// Manejar solicitud OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Incluir conexión
require_once 'conexion.php';
    
    // Consulta SQL
$sql = "SELECT 
    id, nombre, descripcion_corta, descripcion_larga,
    duracion_años, icono_url, imagen_detalle_url,
    malla_curricular_url, titulos_otorga, activo
    FROM carreras 
    WHERE activo = 1 
    ORDER BY nombre ASC";

$resultado = $conn->query($sql);

if ($resultado) {
    $carreras = [];

    while ($fila = $resultado->fetch_assoc()) {
        $carreras[] = $fila;
    }

    echo json_encode([
        'success' => true,
        'data' => $carreras,
        'count' => count($carreras),
        'timestamp' => time(),
        'server_time' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    $resultado->free();
} else {
    echo json_encode([
        'success' => false,
        'error' => 'db_error',
        'message' => 'Error al ejecutar la consulta',
        'details' => $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

$conn->close();
?>