import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { updateQuestionInDB } from '../../services/api';

export default function ShortTextScreen() {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const { quizName, quizId, questionId } = useLocalSearchParams();
  const { quizQuestions, updateQuestion, addQuestion } = useQuiz();
  const router = useRouter();

  const questionData = quizQuestions[quizId]?.find(q => q.id === parseInt(questionId)) || {};
  
  const [question, setQuestion] = useState(questionData.question || '');
  const [answerContains, setAnswerContains] = useState(questionData.answerContains || '');
  const [answerEquals, setAnswerEquals] = useState(questionData.answerEquals || '');

  const handleSave = async () => {
    if (!question.trim()) {
      setErrorMessage("Question can't be blank");
      setErrorVisible(true);
      return;
    }
  
    // ✅ Ensure only one answer type is stored
    let updatedAnswerContains = answerContains.trim();
    let updatedAnswerEquals = answerEquals.trim();
  
    if (updatedAnswerContains) updatedAnswerEquals = '';
    else if (updatedAnswerEquals)  updatedAnswerContains = '';
  
    if (questionId) {
      const response = await updateQuestionInDB(questionId, {
        type: 'short-text',
        question: question.trim(),
        correctAnswer: '',
        wrongAnswers: [],
        answerContains: updatedAnswerContains,
        answerEquals: updatedAnswerEquals
      });

      if (!response.success) {
        setErrorMessage("Failed to update question in database");
        setErrorVisible(true);
        return;
      }

      updateQuestion(
        quizId,
        questionId,
        question,
        '',
        [],
        updatedAnswerContains,
        updatedAnswerEquals
      );
    } else {
      addQuestion(quizId, {
        type: 'short-text',
        question,
        answerContains: updatedAnswerContains,
        answerEquals: updatedAnswerEquals,
        quiz_id: parseInt(quizId),
      });
    }
  
    router.push({ pathname: '/(tabs)/quiz-screen', params: { name: quizName, id: quizId } });
  };  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/quiz-screen', params: { name: quizName } })}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Short Text</Text>
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

      {/* Answer Contains */}
      <Text style={styles.label}>Correct if the answer contains</Text>
      <View style={styles.answerRow}>
        <TextInput
          style={styles.input}
          value={answerContains}
          onChangeText={setAnswerContains}
          placeholder="Enter accepted words"
        />
        <Ionicons name="checkmark-circle-outline" size={24} color="purple" />
      </View>

      {/* Answer Equals */}
      <Text style={styles.label}>Correct if the answer is equal to</Text>
      <View style={styles.answerRow}>
        <TextInput
          style={styles.input}
          value={answerEquals}
          onChangeText={setAnswerEquals}
          placeholder="Enter exact answer"
        />
        <Ionicons name="checkmark-circle" size={24} color="green" />
      </View>

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