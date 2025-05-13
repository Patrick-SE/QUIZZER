<?php
include 'db.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM quizzes";
$result = $conn->query($sql);

$quizzes = [];

while ($row = $result->fetch_assoc()) {
    $quizzes[] = $row;
}

echo json_encode($quizzes);
?>