import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { deleteQuestion } from "../../services/api";

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [quizName, setQuizName] = useState(params.name || '');
  const [quizId, setQuizId] = useState(params.id || '');
  const { quizQuestions, removeQuestion } = useQuiz();

  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch latest from context using quizId instead of quizName
  const questions = quizQuestions[quizId] || [];

  useEffect(() => {
    if (params.name) setQuizName(params.name);
    if (params.id) setQuizId(params.id);
  }, [params.name, params.id]);

  const handleSelect = (screen) => {
    setModalVisible(false);
    setTimeout(() => router.push({
      pathname: `/(tabs)/${screen}`,
      params: { quizName, quizId }
    }), 100);
  };

  const handleDeleteQuestion = async () => {
    console.log("🧪 Delete button pressed");

    if (selectedQuestion) {
      console.log("Selected question ID:", selectedQuestion?.id);
      const success = await deleteQuestion(selectedQuestion.id);
      console.log("Delete response:", success);

      setConfirmDeleteModalVisible(false);
      setSelectedQuestion(null);

      if (success) {
        removeQuestion(quizId, selectedQuestion.id);
      } else {
        console.error("❌ Failed to delete question");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/top-tabs' })}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quizName}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="pencil" size={24} color="black" style={{ marginRight: 16 }} />
          <Ionicons name="search" size={24} color="black" />
        </View>
      </View>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Text style={styles.placeholder}>No questions yet</Text>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {

            // Update the answer display logic to be more robust
            let answerDisplay = 'No answer';
            if (item.type === 'short-text') {
              answerDisplay = item.answerEquals || item.answerContains || 'No answer';
            } else if (item.type === 'true-false') {
              // Explicit true-false handling
              if (item.correctAnswer === true || item.correctAnswer === 'true' || item.correctAnswer === 'True') {
                answerDisplay = 'True';
              } else if (item.correctAnswer === false || item.correctAnswer === 'false' || item.correctAnswer === 'False') {
                answerDisplay = 'False';
              } else {
                answerDisplay = 'No answer';
              }
            } else if (item.type === 'multiple-choice') {
              answerDisplay = item.correctAnswer || 'No answer';
            }

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: `/(tabs)/${item.type}`,
                    params: { quizName, quizId, questionId: item.id },
                  })
                }
                onLongPress={() => {
                  setSelectedQuestion(item);
                  setConfirmDeleteModalVisible(true);
                }}
              >
                <View style={[styles.questionItem, styles.questionSeparator]}>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={[styles.answerText, styles.answerHighlight]}>
                    {answerDisplay}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal: Choose Question Type */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Question Type</Text>

            <TouchableOpacity onPress={() => handleSelect('multiple-choice')}>
              <Text style={styles.option}>Multiple Choice</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect('short-text')}>
              <Text style={styles.option}>Short Text</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect('true-false')}>
              <Text style={styles.option}>True or False</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal visible={confirmDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this question?
            </Text>
            <Text style={{ fontStyle: 'italic', marginVertical: 10 }}>
              "{selectedQuestion?.question}"
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]} 
                onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#F44336' }]} 
                onPress={handleDeleteQuestion}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#009688',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  placeholder: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
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
    marginBottom: 12,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#009688',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  questionSeparator: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  answerHighlight: {
    color: '#009688',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
    modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  modalText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});