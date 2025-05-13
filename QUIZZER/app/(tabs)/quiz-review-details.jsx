import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function QuizReviewDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const question = JSON.parse(params.question || '{}');

  const isCorrect =
    question.type === 'short-text'
      ? (question.answerEquals?.trim().toLowerCase() === question.userAnswer?.trim().toLowerCase() ||
        (question.answerContains &&
          [...question.answerContains.trim().toLowerCase()].some(char =>
            question.userAnswer?.toLowerCase().includes(char))))
      : question.userAnswer === question.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'Review'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Question</Text>
        <Text style={styles.content}>{question.question}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correct Answer</Text>
        <Text style={styles.content}>{question.correctAnswer || question.answerEquals || question.answerContains}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Answer</Text>
        <Text style={styles.content}>{question.userAnswer || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Result</Text>
        <View style={styles.resultRow}>
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={isCorrect ? '#4CAF50' : '#F44336'}
          />
          <Text style={[styles.resultText, { color: isCorrect ? '#4CAF50' : '#F44336' }]}>
            {isCorrect ? 'Correct' : 'Wrong'}
          </Text>
        </View>
      </View>
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
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  label: { fontSize: 14, color: '#999', marginBottom: 5 },
  content: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});