<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Connect to the database
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Missing question ID"]);
    exit;
}

$questionId = intval($data['id']);

// Step 1: Delete the question
$deleteQuery = "DELETE FROM questions WHERE id = ?";
$stmt = $conn->prepare($deleteQuery);
$stmt->bind_param("i", $questionId);
$success = $stmt->execute();
$stmt->close();

if (!$success) {
    echo json_encode(["success" => false, "message" => "Failed to delete question"]);
    exit;
}

// Step 2: Reset IDs to 1, 2, 3... globally
$conn->query("SET @count = 0");
$conn->query("UPDATE questions SET id = @count := @count + 1 ORDER BY id");

// Step 3: Reset AUTO_INCREMENT to match the new max ID
$conn->query("ALTER TABLE questions AUTO_INCREMENT = 1");

echo json_encode(["success" => true, "message" => "Question deleted and IDs reset"]);

?>