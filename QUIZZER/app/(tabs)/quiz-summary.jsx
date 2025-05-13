import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import RetakeModal from '../components/RetakeModal';

export default function QuizSummary() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const correctAnswers = JSON.parse(params.correctAnswers || '[]');
  const wrongAnswers = JSON.parse(params.wrongAnswers || '[]');
  const allAnswers = JSON.parse(params.allAnswers || '[]');

  const [modalVisible, setModalVisible] = useState(false);

  // const handleReview = () => {
  //   router.push({
  //     pathname: '/(tabs)/quiz-review',
  //     params: { allAnswers: JSON.stringify(allAnswers) }
  //   });
  // };

  const handleRetake = (type) => {
    setModalVisible(false);
    const questionsToRetake = type === 'all' ? allAnswers : wrongAnswers;

    router.replace({
      pathname: '/(tabs)/quiz-taking',
      params: {
        quizzes: JSON.stringify(questionsToRetake.map(q => q.quiz_id)) || '[]',
        questions: JSON.stringify(questionsToRetake)
      }
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/top-tabs' })}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'Summary'}</Text>
      </View>

      <Text style={styles.stat}>Correct: {correctAnswers.length}</Text>
      <Text style={styles.stat}>Wrong: {wrongAnswers.length}</Text>

      <TouchableOpacity style={styles.button} onPress={() => {
        router.push({
          pathname: '/(tabs)/quiz-review',
          params: { allAnswers: JSON.stringify(allAnswers) }
        });
      }}>
        <Text style={styles.buttonText}>Review</Text>
      </TouchableOpacity>

      {wrongAnswers.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      )}

      <RetakeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleRetake}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
    padding: 5,
  },
  stat: { fontSize: 16, marginVertical: 5 },
  button: {
    backgroundColor: '#009688',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontSize: 16 },

});