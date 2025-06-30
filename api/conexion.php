<?php
$host = "77.37.127.161";          // IP de tu servidor de base de datos
$user = "u430177197_userintec";   // Usuario MySQL
$pass = "Rubbi2025.-";     // 👈 Reemplaza con la contraseña real
$db   = "u430177197_bdintec";     // Nombre de tu base de datos

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}

// Si todo va bien
// echo "✅ Conexión exitosa a la base de datos";
?>
