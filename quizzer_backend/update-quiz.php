<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || empty($data['name'])) {
    echo json_encode(["success" => false, "message" => "Quiz ID and new name are required"]);
    exit();
}

$id = intval($data['id']);
$newName = $data['name'];

error_log("Received ID: $id, New Name: $newName"); // ✅ Debugging log

$sql = "UPDATE quizzes SET name = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $newName, $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Quiz renamed successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Quiz rename failed!", "error" => $conn->error]);
}
?>