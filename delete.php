<?php require_once 'connection.php';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$id = $_POST['id'];
$sql = "delete from notes where id=$id";
$result = $conn->query($sql);

$conn->close();
?>