<?php
session_start();
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id_usuario = $_POST['id_usuario'];
    $contrasena = $_POST['contrasena'];

    $sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 1) {
        $usuario = $resultado->fetch_assoc();

        if (password_verify($contrasena, $usuario['contrasena'])) {
            $_SESSION['usuario'] = $usuario['id_usuario'];
            $_SESSION['tipo'] = $usuario['tipo'];

            if (str_starts_with($id_usuario, 'I')) {
                header("Location: https://intec.sysitinspirate.com/vistas/inicioalumno.html");
                exit();
            } elseif (str_starts_with($id_usuario, 'C')) {
                header("Location: https://intec.sysitinspirate.com/vistas/inicioprofesor.html");
                exit();
            } else {
                header("Location: https://intec.sysitinspirate.com/vistas/login.html?error=tipo");
                exit();
            }
        } else {
            header("Location: https://intec.sysitinspirate.com/vistas/login.html?error=credenciales");
            exit();
        }
    } else {
        header("Location: https://intec.sysitinspirate.com/vistas/login.html?error=credenciales");
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>