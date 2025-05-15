import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { updateQuestionInDB } from '../../services/api';

export default function MultipleChoiceScreen() {

  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const { addQuestion } = useQuiz();

  const { quizName, quizId, questionId } = useLocalSearchParams();
  const { quizQuestions, updateQuestion } = useQuiz();
  const router = useRouter();

  const questionData = quizQuestions[quizId]?.find(q => q.id === parseInt(questionId)) || {};

  if (!questionData) {
    return <Text>Error: Question not found.</Text>;
  }

  const [question, setQuestion] = useState(questionData.question || '');
  const [correctAnswer, setCorrectAnswer] = useState(questionData.correctAnswer || '');
  const [wrongAnswer1, setWrongAnswer1] = useState(questionData.wrongAnswers?.[0] || '');
  const [wrongAnswer2, setWrongAnswer2] = useState(questionData.wrongAnswers?.[1] || '');
  const [wrongAnswer3, setWrongAnswer3] = useState(questionData.wrongAnswers?.[2] || '');

  const handleSave = async () => {
    const trimmedQuestion = question.trim();
    const trimmedCorrect = correctAnswer.trim();
    const trimmedWrong1 = wrongAnswer1.trim();
    const trimmedWrong2 = wrongAnswer2.trim();
    const trimmedWrong3 = wrongAnswer3.trim();

    // Validate empty fields
    if (!trimmedQuestion || !trimmedCorrect || !trimmedWrong1 || !trimmedWrong2 || !trimmedWrong3) {
      setErrorMessage("Please fill in the question, correct answer, and all 3 wrong answers.");
      setErrorVisible(true);
      return;
    }

    // Make sure question and answers are not the same
    const formattedQuestion = trimmedQuestion.toLowerCase();
    const answers = [trimmedCorrect, trimmedWrong1, trimmedWrong2, trimmedWrong3].map(ans => ans.toLowerCase());

    if (answers.includes(formattedQuestion)) {
      setErrorMessage("The question and answers must be different.");
      setErrorVisible(true);
      return;
    }

    // All good, proceed with save
    if (questionId) {
      const response = await updateQuestionInDB(questionId, {
        type: 'multiple-choice',
        question: trimmedQuestion,
        correctAnswer: trimmedCorrect,
        wrongAnswers: [trimmedWrong1, trimmedWrong2, trimmedWrong3],
        answerContains: '',
        answerEquals: ''
      });

      console.log('Update response:', response);

      updateQuestion(
        quizId,
        questionId,
        trimmedQuestion,
        trimmedCorrect,
        [trimmedWrong1, trimmedWrong2, trimmedWrong3],
        '',
        ''
      );
    } else {
      addQuestion(quizId, {
        type: 'multiple-choice',
        question: trimmedQuestion,
        correctAnswer: trimmedCorrect,
        wrongAnswers: [trimmedWrong1, trimmedWrong2, trimmedWrong3],
        quiz_id: quizId
      });
    }

    router.push({ pathname: '/(tabs)/quiz-screen', params: { name: quizName, id: quizId } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Multiple Choice</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="save" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      {/* Question Input */}
      <Text style={styles.label}>Question</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Enter question"
      />

      {/* Answer Inputs */}
      <Text style={styles.label}>Correct Answer</Text>
      <View style={styles.answerRow}>
        <TextInput
          style={styles.input}
          value={correctAnswer}
          onChangeText={setCorrectAnswer}
          placeholder="Enter correct answer"
        />
        <Ionicons name="checkmark-circle" size={24} color="green" />
      </View>

      <Text style={styles.label}>Wrong Answers</Text>
      {[
        [wrongAnswer1, setWrongAnswer1],
        [wrongAnswer2, setWrongAnswer2],
        [wrongAnswer3, setWrongAnswer3]
      ].map(([value, setter], index) => (
        <View key={index} style={styles.answerRow}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setter}
            placeholder={`Wrong answer ${index + 1}`}
          />
          <Ionicons name="close-circle" size={24} color="red" />
        </View>
      ))}

      {/* Modal for Validation */}
      <Modal visible={errorVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Validation Error</Text>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, flex: 1 },
  answerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#009688',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});