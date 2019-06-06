<?php
require_once('functions.php');
require_once('config.php');
require_once('mysqlconnect.php');
set_exception_handler('handleError');

$output = [
    'success'=> false,
];

$query = "SELECT `id`, `date`, `exercise`, `sets`, `reps`, `weight`, `rest` FROM `exercises`
    ORDER BY `date` DESC";

$result = mysqli_query($conn, $query);

if (!$result) {
  throw new Exception('invalid query: ' . mysqli_error($conn));
}

$output = [
    'success'=> true
];

$output= [];

while ($row = mysqli_fetch_assoc($result)) {
  $parent = $row['date'];
  $timestamp = strtotime($parent);

  $date = date('n/j/y', $timestamp);
  $time = date('h:i a', $timestamp);

    $output[] = [
    'id' => $row['id'],
    'date' => $date,
    'exercise' => $row['exercise'],
    'sets' => $row['sets'],
    'reps' => $row['reps'],
    'weight' => $row['weight'],
    'rest' => $row['rest']
    ];

};

print_r(json_encode($output));
