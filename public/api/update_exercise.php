<?php
require_once('functions.php');
require_once('config.php');
require_once('mysqlconnect.php');
set_exception_handler('handleError');

    $output = [
        'success'=> false,
    ];

    $id = $_POST['id'];
    $timestamp = strtotime($_POST['date']);
    $date = date("Y-m-d H:i:s", $timestamp);
    $exercise = addslashes($_POST['exercise']);
    $sets = (int)$_POST['sets'];
    $reps = (int)$_POST['reps'];
    $weight = (int)$_POST['weight'];
    $rest = (int)$_POST['rest'];

    
    $updateQuery = "UPDATE `exercises` SET `date` = '$date', `exercise` = '$exercise', `sets`= '$sets', `reps` = '$reps', `weight` = '$weight', `rest` = '$rest'
    WHERE `id` = '$id'";

    $exerciseResult = mysqli_query($conn, $updateQuery);

    if(!$exerciseResult){
        throw new Exception(mysqli_error($conn));
    }

    if(mysqli_affected_rows($conn)===0)
    {
        throw new Exception('Exercise failed to update');
    }

    $output['success'] = true;

    print(json_encode($output));
