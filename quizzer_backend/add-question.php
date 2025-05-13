<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->quiz_id) &&
    isset($data->type) &&
    isset($data->question)
) {
    $quiz_id = $data->quiz_id;
    $type = $data->type;
    $question = $data->question;

    // Optional fields (based on type)
    $correct_answer = $data->correctAnswer ?? null;
    $wrong_answers = isset($data->wrongAnswers) ? json_encode($data->wrongAnswers) : null;
    $answer_contains = $data->answerContains ?? null;
    $answer_equals = $data->answerEquals ?? null;

    $stmt = $conn->prepare("INSERT INTO questions (quiz_id, type, question, correct_answer, wrong_answers, answer_contains, answer_equals)
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $quiz_id, $type, $question, $correct_answer, $wrong_answers, $answer_contains, $answer_equals);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
}

$conn->close();
?>