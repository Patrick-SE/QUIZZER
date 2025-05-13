<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['type'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$id = intval($data['id']);
$type = $data['type'];
$question = $data['question'] ?? '';
$correctAnswer = $data['correctAnswer'] ?? '';
$wrongAnswers = $data['wrongAnswers'] ?? [];
$answerContains = $data['answerContains'] ?? '';
$answerEquals = $data['answerEquals'] ?? '';

$wrongAnswersJson = json_encode($wrongAnswers);

// ✅ Use correct DB column names
$sql = "UPDATE questions SET type = ?, question = ?, correct_answer = ?, wrong_answers = ?, answer_contains = ?, answer_equals = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $type, $question, $correctAnswer, $wrongAnswersJson, $answerContains, $answerEquals, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update question", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>