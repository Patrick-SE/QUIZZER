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

// ✅ Get input data
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Quiz ID is required"]);
    exit();
}

$quizId = intval($data['id']);

// ✅ Delete the quiz
$sql = "DELETE FROM quizzes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $quizId);
$stmt->execute();

// ✅ Shift IDs down to remove gaps
$conn->query("SET @num = 0");
$conn->query("UPDATE quizzes SET id = @num := @num + 1 ORDER BY id");

// ✅ Reset AUTO_INCREMENT to maintain sequence
$conn->query("ALTER TABLE quizzes AUTO_INCREMENT = 1");

echo json_encode(["success" => true, "message" => "Quiz deleted and IDs reordered"]);
?>