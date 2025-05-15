import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import { updateQuiz } from '../../services/api';

export default function EditQuiz() {
  const { name } = useLocalSearchParams();
  const [newName, setNewName] = useState(name || '');
  const router = useRouter();
  const { quizzes } = useQuiz();

  const handleSave = async () => {
    if (name && newName.trim()) {
      console.log("Renaming quiz:", name, "New Name:", newName);
  
      const quizToUpdate = quizzes.find(q => q.name === name);
      if (!quizToUpdate) {
        console.error("Quiz not found!");
        return;
      }
  
      const success = await updateQuiz(quizToUpdate.id, newName.trim());
      console.log("Raw API Response:", success);
  
      if (success) {
        router.replace({ pathname: '/(tabs)/quiz-screen', params: { name: newName.trim(), id: quizToUpdate.id.toString() } });
      } else {
        console.error("Failed to update quiz in MySQL!");
      }
    }
  };   

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Quiz</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="save" size={24} color="#009688" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
        placeholder="Enter new quiz name"
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
});