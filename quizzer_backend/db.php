<?php
$host = "localhost"; // Change if using an online server
$user = "root"; // Default MySQL user (change if needed)
$password = ""; // Default is empty for local servers
$database = "quizzer_db"; // Your MySQL database name

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json'); // Ensure JSON response
?>