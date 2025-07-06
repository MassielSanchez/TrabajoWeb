<?php
// api/gestionar_avisos.php

// Inicia la sesión si no está iniciada (puede ser útil para control de acceso en el futuro)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Incluir el archivo de conexión a la base de datos
require_once __DIR__ . '/conexion.php'; // Conexión.php está en la misma carpeta
// Directorio donde se guardarán las imágenes de los avisos
// Asegúrate de que esta carpeta exista y tenga permisos de escritura (ej. 755 o 777 temporalmente para pruebas)
$target_dir = __DIR__ . "/../img/avisos/"; // Ruta relativa desde este script al directorio img/avisos/

// Asegurarse de que el directorio de destino exista
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true); // Crea el directorio si no existe, con permisos recursivos
}

// Función para redirigir con un mensaje
function redirigirConMensaje($mensaje, $tipo) {
    // header("Location: ../vistas/admin_avisos.php?mensaje=" . urlencode($mensaje) . "&tipo=" . urlencode($tipo));
    // Para simplificar y probar, solo muestra el mensaje y detiene la ejecución
    echo json_encode(["success" => ($tipo === 'exito'), "message" => $mensaje]);
    exit();
}

// Verificar si la solicitud es POST y si la acción es "agregar"
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['accion']) && $_POST['accion'] == 'agregar') {

    // 1. Obtener y sanear los datos del formulario
    $titulo = trim($_POST['titulo'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $tipo_aviso = trim($_POST['tipo_aviso'] ?? '');
    $fecha_inicio = trim($_POST['fecha_inicio'] ?? '');
    $fecha_fin = trim($_POST['fecha_fin'] ?? '');

    // 2. Validar que los campos no estén vacíos
    if (empty($titulo) || empty($descripcion) || empty($tipo_aviso) || empty($fecha_inicio) || empty($fecha_fin)) {
        redirigirConMensaje("Todos los campos son obligatorios.", "error");
    }

    // 3. Validar las fechas (opcional, pero buena práctica)
    // Puedes añadir una validación más robusta aquí si es necesario
    if (strtotime($fecha_inicio) === false || strtotime($fecha_fin) === false || strtotime($fecha_inicio) > strtotime($fecha_fin)) {
        redirigirConMensaje("Las fechas ingresadas no son válidas o la fecha de inicio es posterior a la fecha de fin.", "error");
    }

    // 4. Manejar la subida de la imagen
    $imagen_url = ''; // Variable para guardar la ruta final de la imagen
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == UPLOAD_ERR_OK) {
        $file_name = basename($_FILES["imagen"]["name"]);
        $target_file = $target_dir . uniqid() . "_" . $file_name; // Nombre único para evitar colisiones
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Validar tipo de archivo (solo imágenes)
        $check = getimagesize($_FILES["imagen"]["tmp_name"]);
        if ($check === false) {
            redirigirConMensaje("El archivo no es una imagen.", "error");
        }

        // Validar tamaño del archivo (ej. máximo 5MB)
        if ($_FILES["imagen"]["size"] > 5 * 1024 * 1024) { // 5 MB
            redirigirConMensaje("La imagen es demasiado grande. Máximo 5MB.", "error");
        }

        // Permitir ciertos formatos de archivo
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
            redirigirConMensaje("Solo se permiten archivos JPG, JPEG, PNG y GIF.", "error");
        }

        // Mover el archivo subido al directorio de destino
        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
            // Guarda la ruta relativa desde la raíz del sitio web
            // Asumiendo que 'img/' está en la raíz de tu proyecto accesible públicamente
            $imagen_url = "/img/avisos/" . basename($target_file);
        } else {
            redirigirConMensaje("Error al subir la imagen.", "error");
        }
    } else {
        redirigirConMensaje("No se ha subido ninguna imagen o hubo un error en la subida.", "error");
    }

    // 5. Insertar los datos en la base de datos
    if (!empty($imagen_url)) {
        $stmt = $conn->prepare("INSERT INTO avisos (titulo, descripcion, imagen_url, tipo_aviso, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("ssssss", $titulo, $descripcion, $imagen_url, $tipo_aviso, $fecha_inicio, $fecha_fin);

            if ($stmt->execute()) {
                redirigirConMensaje("Aviso agregado con éxito.", "exito");
            } else {
                redirigirConMensaje("Error al guardar el aviso en la base de datos: " . $stmt->error, "error");
            }
            $stmt->close();
        } else {
            redirigirConMensaje("Error en la preparación de la consulta: " . $conn->error, "error");
        }
    } else {
        redirigirConMensaje("La URL de la imagen está vacía, no se puede guardar el aviso.", "error");
    }

} else {
    // Si no es una solicitud POST o la acción no es "agregar", redirigir
    redirigirConMensaje("Acceso no válido al script.", "error");
}

$conn->close();
?>