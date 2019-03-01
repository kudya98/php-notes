<?php
		if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
			 session_start();
	require_once 'connection.php';
$mysqli = new mysqli($host, $user, $password, $database);
if (isset($_POST['login'])) { $login = $_POST['login']; if ($login == '') { unset($login);} } 
if (isset($_POST['password'])) { $password=$_POST['password']; if ($password =='') { unset($password);} }
try{
if (empty($login) or empty($password))
    {
    throw new Exception("Вы ввели не всю информацию, вернитесь назад и заполните все поля!");
    }
 else {
    $login = stripslashes($login);
    $login = htmlspecialchars($login);
	$password = stripslashes($password);
    $password = htmlspecialchars($password);
    $login = trim($login);
    $password = trim($password);
	$query =("SELECT * FROM users WHERE (login='$login') AND (password='$password')");
	if ($result = mysqli_query($mysqli, $query)) {
    if($result->num_rows === 0)
    {
        throw new Exception("Введённый вами логин или пароль неверный");
    } else while ($row = mysqli_fetch_row($result)) {
    $_SESSION['login']=$row[1]; 
    $_SESSION['id']=$row[0];
    }
    mysqli_free_result($result);
	 echo json_encode(array(
        'user' => array(
            'login' => $_SESSION['login'],
			 'id' => $_SESSION['id']
        ),
    ));
}
			}
		}
		catch (Exception $e) {
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage()
        ),
    ));
}
$mysqli->close();
}
 ?>