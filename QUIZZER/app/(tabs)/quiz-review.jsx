import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function QuizReview() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const allAnswers = JSON.parse(params.allAnswers || '[]');

  const handlePress = (item) => {
    router.push({
      pathname: '/(tabs)/quiz-review-details',
      params: { question: JSON.stringify(item) }
    });
  };

  const renderItem = ({ item }) => {
    const isCorrect =
      item.type === 'short-text'
        ? (item.answerEquals?.trim().toLowerCase() === item.userAnswer?.trim().toLowerCase() ||
          (item.answerContains &&
            [...item.answerContains.trim().toLowerCase()].some(char =>
              item.userAnswer?.toLowerCase().includes(char))))
        : item.userAnswer === item.correctAnswer;

    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={isCorrect ? '#4CAF50' : '#F44336'}
          style={styles.icon}
        />
        <Text style={styles.questionText}>{item.question}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/top-tabs' })}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'Review'}</Text>
      </View>

      <FlatList
        data={allAnswers}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  icon: {
    marginRight: 10
  },
  questionText: {
    fontSize: 16,
    color: '#333'
  }
});