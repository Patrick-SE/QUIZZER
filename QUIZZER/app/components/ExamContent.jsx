import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Add this to ExamContent.jsx
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext'; // ✅ Access stored quizzes

export default function ExamContent() {
  const { quizzes, selectedQuizzes, updateSelectedQuizzes } = useQuiz();
  const [modalVisible, setModalVisible] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true); // ✅ Toggle correct answers visibility 

  const router = useRouter();

  // ✅ Handle quiz selection toggle
  // const toggleQuizSelection = (quizName) => {
  //   updateSelectedQuizzes(selectedQuizzes.includes(quizName)
  //     ? selectedQuizzes.filter(q => q !== quizName)
  //     : [...selectedQuizzes, quizName]
  //   );
  // };
  const toggleQuizSelection = (quiz) => {
    updateSelectedQuizzes(
      selectedQuizzes.find(q => q.id === quiz.id)
        ? selectedQuizzes.filter(q => q.id !== quiz.id)
        : [...selectedQuizzes, quiz]
    );
  };

  const startQuiz = () => {
    const quizIds = selectedQuizzes.map(q => q.id.toString());
    router.push({
      pathname: '/(tabs)/quiz-taking',
      params: { quizzes: JSON.stringify(quizIds) }
    });
  };

  return (
    <View style={styles.container}>
      {/* Quiz Selection */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quizSelection}>
        <Text style={styles.label}>Quizzes</Text>
        {/* <Text style={styles.selectedQuizText}>
          {selectedQuizzes.length ? selectedQuizzes.join(', ') : 'Tap to choose quizzes'}
        </Text> */}
        <Text style={styles.selectedQuizText}>
          {selectedQuizzes.length ? selectedQuizzes.map(q => q.name).join(', ') : 'Tap to choose quizzes'}
        </Text>
      </TouchableOpacity>

      {/* Show Answers Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Show correct answers</Text>
        <Switch value={showAnswers} onValueChange={setShowAnswers} />
      </View>

      {/* Sort Option */}
      <TouchableOpacity style={styles.quizSelection}>
        <Text style={styles.label}>Sort questions by</Text>
        <Text style={styles.selectedQuizText}>Creation date</Text>
      </TouchableOpacity>

      {/* FAB Play Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={startQuiz}
        // onPress={() => router.push({ pathname: '/(tabs)/quiz-taking', params: { quizzes: selectedQuizzes } })}
      >
        <Ionicons name="play-circle" size={80} color="#009688" />
      </TouchableOpacity>

      {/* Quiz Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={quizzes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleQuizSelection(item)} style={styles.modalItem}>
                  {/* <Ionicons name={selectedQuizzes.includes(item) ? "checkbox" : "square-outline"} size={24} color="#009688" /> */}
                  <Ionicons name={selectedQuizzes.find(q => q.id === item.id) ? "checkbox" : "square-outline"} size={24} color="#009688" />
                  <Text style={styles.quizName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  quizSelection: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  label: { fontSize: 16, fontWeight: 'bold' },
  selectedQuizText: { fontSize: 16, color: '#666' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  fab: { position: 'absolute', bottom: 15, right: 15 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 12, elevation: 10 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  quizName: { fontSize: 16, marginLeft: 10 },
  modalButton: { backgroundColor: '#009688', paddingVertical: 10, alignItems: 'center', marginTop: 10, borderRadius: 6 },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});