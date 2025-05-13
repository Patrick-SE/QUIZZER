<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

// ✅ Handle preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ✅ Get quiz ID from the query string
$quiz_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($quiz_id === 0) {
    echo json_encode(["success" => false, "message" => "Missing or invalid quiz ID"]);
    exit();
}

$sql = "SELECT * FROM questions WHERE quiz_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $quiz_id);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = [
        'id' => $row['id'],
        'quiz_id' => $row['quiz_id'],
        'type' => $row['type'],
        'question' => $row['question'],
        'correctAnswer' => $row['correct_answer'] ?? '',
        'wrongAnswers' => json_decode($row['wrong_answers'] ?? "[]"),
        'answerContains' => $row['answer_contains'] ?? '',
        'answerEquals' => $row['answer_equals'] ?? '',
    ];
}

echo json_encode($questions);

$stmt->close();
$conn->close();
?>