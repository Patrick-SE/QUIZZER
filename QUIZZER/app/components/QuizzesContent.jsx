import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { addQuiz, deleteQuiz, fetchQuizzes, addQuestion as addQuestionToDB, fetchQuestions } from "../../services/api";

export default function QuizzesContent() {
  const { quizzes, setQuizzes, quizQuestions } = useQuiz(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setQuizzes(prevQuizzes => [...prevQuizzes]);
  
  }, [quizQuestions]); 

  const loadQuizzes = async () => {
    const data = await fetchQuizzes();
    console.log("Quizzes from MySQL:", data);
    setQuizzes(data);
  };

  const handleAddQuiz = async () => {
    if (quizName.trim() !== '') {
        const success = await addQuiz(quizName.trim());
        if (success) {
            loadQuizzes();
            setQuizName('');
            setModalVisible(false);
        }
    }
  };  

  const handleCancel = () => {
    setQuizName('');
    setModalVisible(false);
  };

  const handleDeleteQuiz = async () => {
    if (selectedQuiz) {
      console.log("Attempting to delete quiz:", selectedQuiz.id);
  
      const success = await deleteQuiz(selectedQuiz.id);
      console.log("Quiz deletion success:", success);
  
      if (success) {
        setConfirmDeleteModalVisible(false);
        setActionModalVisible(false);
        setSelectedQuiz(null);
  
        await loadQuizzes();
      } else {
        console.error("Failed to delete quiz!");
      }
    }
  };

  const addQuestion = async (quizId, questionData) => {
    const success = await addQuestionToDB(quizId, questionData);
    if (!success) {
      console.error("❌ Failed to save question to database");
      return;
    }

    // Fetch the updated list of questions from the DB
    const updatedQuestions = await fetchQuestions(quizId);

    setQuizQuestions(prev => ({
      ...prev,
      [quizId]: updatedQuestions
    }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/quiz-screen', params: { name: item.name, id: item.id.toString() }, })  }
            onLongPress={() => {
              setSelectedQuiz(item);
              setActionModalVisible(true);
            }}
          >
            <View style={styles.quizItem}>
              <Text style={styles.quizTitle}>{item.name}</Text>
              <Text style={styles.questionCount}>
                {quizQuestions[item.id] ? quizQuestions[item.id].length : 0} questions
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Quiz Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz name</Text>
            <TextInput
              placeholder="Enter quiz name"
              value={quizName}
              onChangeText={setQuizName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddQuiz}>
                <Text style={styles.save}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalContent}>
            <Text style={[styles.modalTitle]}>{selectedQuiz?.name}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setActionModalVisible(false);
                router.push({ pathname: '/(tabs)/edit-quiz', params: { name: selectedQuiz.name } });
              }}
            >
              <Text style={styles.save}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setConfirmDeleteModalVisible(true);
              }}
            >
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActionModalVisible(false)}>
              <Text style={[styles.cancel, {marginRight: 0, paddingVertical: 10,}]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        visible={confirmDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete quiz?</Text>
            <Text>{selectedQuiz?.name}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteQuiz}>
                <Text style={[styles.save, { color: 'red' }]}>Delete</Text>
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
  },
  quizItem: {
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  actionModalContent: {
    backgroundColor: '#fff',
    width: '70%',
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
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancel: {
    marginRight: 20,
    color: '#888',
    fontWeight: 'bold',
  },
  save: {
    color: '#009688',
    fontWeight: 'bold',
  },
  actionButton: {
    paddingVertical: 10,
  },
});