import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { updateQuestionInDB } from '../../services/api';

export default function TrueFalseScreen() {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const { quizName, quizId, questionId } = useLocalSearchParams();
  const { quizQuestions, updateQuestion, addQuestion } = useQuiz();
  const router = useRouter();

  const questionData = quizQuestions[quizId]?.find(q => q.id === parseInt(questionId)) || {};

  const [question, setQuestion] = useState(questionData.question || '');
  const [selectedAnswer, setSelectedAnswer] = useState(questionData.correctAnswer || null);

  const handleSave = async () => {
    console.log('Saving with:', { question, selectedAnswer });
    if (!question.trim()) {
      setErrorMessage("Question can't be blank");
      setErrorVisible(true);
      return;
    }

    // Explicit true-false validation
    if (selectedAnswer !== 'True' && selectedAnswer !== 'False') {
      setErrorMessage("Please select either True or False");
      setErrorVisible(true);
      return;
    }
  
    if (selectedAnswer === null) {
      setErrorMessage("Please select an answer");
      setErrorVisible(true);
      return;
    }
  
    if (questionId) {
      const response = await updateQuestionInDB(questionId, {
        type: 'true-false',
        question: question.trim(),
        correctAnswer: selectedAnswer.trim(),
        wrongAnswers: [],
        answerContains: '',
        answerEquals: ''
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
        selectedAnswer,
        [],
        '',
        ''
      );
    } else {
      addQuestion(quizId, {
        type: 'true-false',
        question: question.trim(),
        correctAnswer: selectedAnswer,
        quiz_id: parseInt(quizId),
        wrongAnswers: [],
        answerContains: '',
        answerEquals: ''
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
        <Text style={styles.headerTitle}>True or False</Text>
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

      {/* Answer Selection */}
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={[styles.answerOption, selectedAnswer === "True" && styles.selected]}
          onPress={() => setSelectedAnswer("True")}
        >
          <Text style={[styles.answerText, selectedAnswer === "True" && { color: "white" }]}>True</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.answerOption, selectedAnswer === "False" && styles.selected]}
          onPress={() => setSelectedAnswer("False")}
        >
          <Text style={[styles.answerText, selectedAnswer === "False" && { color: "white" }]}>False</Text>
        </TouchableOpacity>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 16 },
  answerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  answerOption: { paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 6 },
  answerText: { fontSize: 16 },
  selected: { 
    backgroundColor: '#009688', 
    borderColor: '#009688',
    color: 'white' // ✅ Text will change to white on selection
  },  
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