<?php
    require_once('functions.php');
    require_once('config.php');
    require_once('mysqlconnect.php');
    set_exception_handler('handleError');

    $json_input = file_get_contents("php://input");
    $input = json_decode($json_input, true);

    $output = [
        'success'=> false,
    ];

    $exercise = $input['exercise'];
    $sets = (int)$input['sets'];
    $reps = (int)$input['reps'];
    $weight = (int)$input['weight'];
    $rest = (int)$input['rest'];

    $addExerciseQuery = "INSERT INTO `exercises` 
        (`exercise`, `sets`, `reps`, `weight`, `rest`)
        VALUES
        ($exercise, $sets, $reps, $weight, $rest)";

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
