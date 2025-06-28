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

// Log de debugging
function logDebug($message) {
    error_log(date('[Y-m-d H:i:s] ') . $message . PHP_EOL, 3, 'debug_carreras.log');
}

logDebug("=== INICIO DE SOLICITUD ===");
logDebug("Método: " . $_SERVER['REQUEST_METHOD']);
logDebug("URL solicitada: " . $_SERVER['REQUEST_URI']);


// Configuración de la base de datos
$host = '77.37.127.161';
$usuario = 'u430177197_userintec';
$contraseña = 'Rubbi2025.-';
$basededatos = 'u430177197_bdintec';
$puerto = 3306; 

logDebug("Intentando conectar a la base de datos...");

try {
    // Crear conexión PDO con configuración más robusta
    $dsn = "mysql:host=$host;port=$puerto;dbname=$basededatos;charset=utf8mb4";
    $opciones = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 30, // 30 segundos timeout
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ];
    
    $pdo = new PDO($dsn, $usuario, $contraseña, $opciones);
    logDebug("Conexión exitosa a la base de datos");
    
    // Verificar que la tabla existe
    $checkTable = $pdo->prepare("SHOW TABLES LIKE 'carreras'");
    $checkTable->execute();
    $tableExists = $checkTable->fetch();
    
    if (!$tableExists) {
        throw new Exception("La tabla 'carreras' no existe en la base de datos");
    }
    
    logDebug("Tabla 'carreras' encontrada");
    
    // Consulta para obtener las carreras
    $sql = "SELECT 
        id, nombre, descripcion_corta, descripcion_larga,
        duracion_años, icono_url, imagen_detalle_url,
        malla_curricular_url, titulos_otorga, activo
        FROM carreras 
        WHERE activo = 1 
        ORDER BY nombre ASC";
    
    logDebug("Ejecutando consulta: " . $sql);
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $carreras = $stmt->fetchAll();
    
    logDebug("Carreras encontradas: " . count($carreras));
    
    // Log de las primeras carreras para verificar datos
    if (count($carreras) > 0) {
        logDebug("Primera carrera: " . json_encode($carreras[0]));
    }
    
    // Formatear respuesta exitosa
    $response = [
        'success' => true,
        'data' => $carreras,
        'count' => count($carreras),
        'timestamp' => time(),
        'server_time' => date('Y-m-d H:i:s')
    ];
    
    logDebug("Respuesta preparada correctamente");
    
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    logDebug("Error PDO: " . $e->getMessage());
    
    $errorResponse = [
        'success' => false,
        'error' => 'database_error',
        'message' => 'Error al conectar con la base de datos',
        'details' => $e->getMessage(),
        'code' => $e->getCode()
    ];
    
    http_response_code(500);
    echo json_encode($errorResponse, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch(Exception $e) {
    logDebug("Error general: " . $e->getMessage());
    
    $errorResponse = [
        'success' => false,
        'error' => 'server_error', 
        'message' => 'Error interno del servidor',
        'details' => $e->getMessage()
    ];
    
    http_response_code(500);
    echo json_encode($errorResponse, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

logDebug("=== FIN DE SOLICITUD ===");
?>