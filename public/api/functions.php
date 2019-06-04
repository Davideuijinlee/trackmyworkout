<?php

if (!function_exists('handleError')) {
    function handleError($error)
    {
        $output = [
            'success' => false,
            'error' => $error->getMessage()
        ];
        $json_output = json_encode($output);
        print($json_output);
    };
};

if (!function_exists('handleCors')) {
    function handleCors()
    {
        header("Access-Control-Allow-Origin: *");
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
            exit();
        }
    }
}
