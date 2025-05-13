import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext'; // ✅ Import context
import { updateQuestionInDB } from '../../services/api';

export default function EditQuestionScreen() {
  const { quizName, questionId } = useLocalSearchParams();
  const { quizQuestions, updateQuestion } = useQuiz(); // ✅ Get stored questions & update function
  const router = useRouter();

  const questionData = quizQuestions[quizName]?.find(q => q.id == questionId) || {};

  if (!questionData) {
    return <Text>Error: Question data not found.</Text>; // ✅ Prevent rendering an empty object
  }

  const [editedQuestion, setEditedQuestion] = useState(questionData.question || '');
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(questionData.correctAnswer || '');

  const handleSave = async () => {
    // ✅ Call backend to update in MySQL
    const response = await updateQuestionInDB(questionId, {
      question: editedQuestion.trim(),
      correctAnswer: editedCorrectAnswer.trim()
    });

    if (response?.success) {
      // ✅ Update local state in context
      updateQuestion(quizName, questionId, editedQuestion, editedCorrectAnswer);

      // ✅ Navigate back
      router.push({ pathname: '/(tabs)/quiz-screen', params: { name: quizName } });
    } else {
      console.error('❌ Failed to update question in DB');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quizName}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="save" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Question</Text>
      <TextInput 
        style={styles.input}
        value={editedQuestion}
        onChangeText={setEditedQuestion}
      />

      <Text style={styles.label}>Correct Answer</Text>
      <TextInput 
        style={styles.input}
        value={editedCorrectAnswer}
        onChangeText={setEditedCorrectAnswer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  questionItem: {
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
  },
});