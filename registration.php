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
			if($_POST['login']=='Гость') throw new Exception("Не вводи это имя"); 
	$query =("SELECT * FROM users WHERE (login='$login')");
	if ($result = mysqli_query($mysqli, $query)) {
    if($result->num_rows === 0)
    {
		$query =("INSERT INTO users VALUES(default,'$login','$password')");
       $result = mysqli_query($mysqli, $query);
	   throw new Exception("Пользователь создан");
    } else  {
		  throw new Exception("Данное имя занято");
    }
	
    mysqli_free_result($result);
	}
 }
	}catch (Exception $e) {
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage()
        ),
    ));
}
$mysqli->close();
			
}
 ?>