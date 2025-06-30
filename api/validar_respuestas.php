<?php
session_start();
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_usuario = $_POST['id_usuario'];
    $respuestas = [];

    for ($i = 1; $i <= 3; $i++) {
        if (!isset($_POST["respuesta$i"], $_POST["id_pregunta$i"])) {
            echo "<script>alert('Faltan respuestas.'); window.history.back();</script>";
            exit();
        }

        $respuestas[] = [
            'id_pregunta' => $_POST["id_pregunta$i"],
            'respuesta' => $_POST["respuesta$i"]
        ];
    }

    $validas = 0;

    foreach ($respuestas as $r) {
        $sql = "SELECT respuesta FROM respuestas_seguridad WHERE id_usuario = ? AND id_pregunta = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $id_usuario, $r['id_pregunta']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 1) {
            $stmt->bind_result($hash);
            $stmt->fetch();

            if (password_verify(trim($r['respuesta']), $hash)) {
                $validas++;
            }
        }

        $stmt->close();
    }

    if ($validas === 3) {
        $_SESSION['reset_user'] = $id_usuario;
        header("Location: reset_password.html");
        exit();
    } else {
        echo "<script>alert('Una o más respuestas son incorrectas.'); window.history.back();</script>";
        exit();
    }
} else {
    header("Location: login.html");
    exit();
}