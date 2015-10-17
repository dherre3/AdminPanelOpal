<?php

$var=file_get_contents("php://input");
$data = array();

parse_str($var, $data);
foreach ($data as $key => $value){
    var_dump($data['Request']);
  if($key=='Messages'){
    echo 'boom';
    }
}
    


include 'authenticate.php';
include 'patients.php';
include 'messages.php';
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'Authenticate':
            insert();
            break;
        case 'GetPatients':
            allPatients();
            break;
        case 'FindPatient':
        	findPatient();
        	break;
        case 'Messages':
        	getMessages();
        	break;
    }

}

?>