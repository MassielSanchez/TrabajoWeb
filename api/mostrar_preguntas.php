<?php
header("Content-Type: application/json");
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id_usuario'])) {
    $id_usuario = $_POST['id_usuario'];

    // Obtener 3 preguntas aleatorias del usuario
    $sql = "SELECT ps.id AS id_pregunta, ps.texto 
            FROM respuestas_seguridad rs
            JOIN preguntas_seguridad ps ON rs.id_pregunta = ps.id
            WHERE rs.id_usuario = ?
            ORDER BY RAND() LIMIT 3";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "Error en la preparación de la consulta"]);
        exit;
    }

    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $preguntas = [];

        while ($fila = $resultado->fetch_assoc()) {
            $preguntas[] = [
                "id_pregunta" => $fila["id_pregunta"],
                "texto" => $fila["texto"]
            ];
        }

        echo json_encode($preguntas);
    } else {
        echo json_encode(["error" => "No se encontraron preguntas para este usuario."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "ID de usuario no recibido correctamente."]);
}
?>