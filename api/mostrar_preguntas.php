<?php
header('Content-Type: application/json');
include("conexion.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_usuario = $_POST['id_usuario'];

    $sql = "SELECT rs.id_pregunta, ps.texto 
            FROM respuestas_seguridad rs
            JOIN preguntas_seguridad ps ON rs.id_pregunta = ps.id
            WHERE rs.id_usuario = ?
            ORDER BY RAND() LIMIT 3";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $preguntas = [];

    while ($row = $resultado->fetch_assoc()) {
        $preguntas[] = [
            'id_pregunta' => $row['id_pregunta'],
            'texto' => $row['texto']
        ];
    }

    echo json_encode($preguntas ?: ["error" => "No se encontraron preguntas."]);
}
?>