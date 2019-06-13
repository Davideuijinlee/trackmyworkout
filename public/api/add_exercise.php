<?php
require_once('functions.php');
require_once('config.php');
require_once('mysqlconnect.php');
set_exception_handler('handleError');

    $output = [
        'success'=> false,
    ];

    $exercise = addslashes($_POST['exercise']);
    $sets = (int)$_POST['sets'];
    $reps = (int)$_POST['reps'];
    $weight = (int)$_POST['weight'];
    $rest = (int)$_POST['rest'];

    $addExerciseQuery = "INSERT INTO `exercises` 
        (`exercise`, `sets`, `reps`, `weight`, `rest`)
        VALUES
        ('$exercise', $sets, $reps, $weight, $rest)";

    $exerciseResult = mysqli_query($conn, $addExerciseQuery);

    if(!$exerciseResult){
        throw new Exception(mysqli_error($conn));
    }

    if(mysqli_affected_rows($conn)===0)
    {
        throw new Exception('Exercise was not added to the table');
    }

    $output['success'] = true;

    print(json_encode($output));
