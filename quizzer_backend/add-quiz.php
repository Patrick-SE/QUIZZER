<?php
include 'db.php';

// ✅ Allow all origins (for development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle Preflight Requests (OPTIONS Method)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || empty($data['name'])) {
    echo json_encode(["success" => false, "message" => "Quiz name is required"]);
    exit();
}

$name = $data['name'];

$sql = "INSERT INTO quizzes (name) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);
$stmt->execute();

echo json_encode(["success" => $stmt->affected_rows > 0]);
?>