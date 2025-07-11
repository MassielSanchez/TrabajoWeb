<?php
// contacto.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// Configuración de la base de datos
$host = '77.37.127.161';
$username = 'u430177197_userintec';  
$password = 'Rubbi2025.-';           
$dbname = 'u430177197_bdintec';      
$puerto = 3306;

// Función para registrar errores
function logError($message) {
    error_log(date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL, 3, 'contact_errors.log');
}

try {
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;port=$puerto;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    // Obtener datos del formulario
    $input_raw = file_get_contents('php://input');
    
    if (empty($input_raw)) {
        throw new Exception('No se recibieron datos');
    }
    
    $input = json_decode($input_raw, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }
    
    // Validar datos
    if (!isset($input['nombre']) || !isset($input['correo']) || !isset($input['mensaje'])) {
        throw new Exception('Faltan datos requeridos');
    }
    
    $nombre = trim($input['nombre']);
    $correo = trim($input['correo']);
    $mensaje = trim($input['mensaje']);
    
    // Validaciones
    if (empty($nombre)) {
        throw new Exception('El nombre es requerido');
    }
    
    if (strlen($nombre) < 2) {
        throw new Exception('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\'-]+$/u', $nombre)) {
        throw new Exception('El nombre solo puede contener letras, espacios y caracteres válidos (no números)');
    }
    
    if (empty($correo) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('El correo electrónico no es válido');
    }
    
    if (empty($mensaje)) {
        throw new Exception('El mensaje es requerido');
    }
    
    // Limitar longitud de campos
    if (strlen($nombre) > 100) {
        throw new Exception('El nombre es muy largo (máximo 100 caracteres)');
    }
    
    if (strlen($correo) > 150) {
        throw new Exception('El correo es muy largo (máximo 150 caracteres)');
    }
    
    if (strlen($mensaje) > 1000) {
        throw new Exception('El mensaje es muy largo (máximo 1000 caracteres)');
    }
    
    // Obtener información adicional
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Verificar si la tabla existe (opcional, para debugging)
    $stmt_check = $pdo->query("SHOW TABLES LIKE 'contactos'");
    if ($stmt_check->rowCount() == 0) {
        throw new Exception('La tabla contactos no existe en la base de datos');
    }
    
    // Insertar en la base de datos
    $stmt = $pdo->prepare("
        INSERT INTO contactos (nombre, correo, mensaje, ip_address, user_agent, fecha_creacion) 
        VALUES (:nombre, :correo, :mensaje, :ip_address, :user_agent, NOW())
    ");
    
    $result = $stmt->execute([
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':mensaje' => $mensaje,
        ':ip_address' => $ip_address,
        ':user_agent' => $user_agent
    ]);
    
    if (!$result) {
        throw new Exception('Error al insertar en la base de datos');
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.'
    ]);
    
} catch (PDOException $e) {
    logError('PDO Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos',
        'details' => $e->getMessage()
    ]);
} catch (Exception $e) {
    logError('General Error: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>