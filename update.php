<?php require_once 'connection.php';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$id = $_POST['id'];
$title = $_POST['title'];
$content = $_POST['content'];
if ($id == -1) {$sql = "insert into notes values(default,'Гость',now(),'$title','$content')" ;$result = $conn->query($sql);}
else  {$sql = "update notes set title='$title',content='$content' where id = $id" ;$result = $conn->query($sql);};
$conn->close();
?>