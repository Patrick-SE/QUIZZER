import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';
import ExamContent from '../components/ExamContent';
import QuizzesContent from '../components/QuizzesContent';

export default function TopTabsScreen() {
  const [activeTab, setActiveTab] = useState('exam');
  const { quizzes, setQuizzes } = useQuiz(); // 💾 This keeps your quizzes alive even when switching tabs

  const renderHeaderRight = () => {
    if (activeTab === 'exam') {
      return (
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="search" size={24} color="white" style={{ marginRight: 16 }} />
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </View>
      );
    }
  };

  const renderScreen = () => {
    if (activeTab === 'exam') return <ExamContent />;
    if (activeTab === 'quizzes') return <QuizzesContent quizzes={quizzes} setQuizzes={setQuizzes} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={{
        backgroundColor: '#009688',
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Quizzer</Text>
        {renderHeaderRight()}
      </View>

      {/* Tab Bar */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      }}>
        <TouchableOpacity onPress={() => setActiveTab('exam')}>
          <Text style={{
            padding: 10,
            fontWeight: 'bold',
            color: activeTab === 'exam' ? '#009688' : '#666',
            borderBottomWidth: activeTab === 'exam' ? 2 : 0,
            borderBottomColor: '#009688'
          }}>
            EXAM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('quizzes')}>
          <Text style={{
            padding: 10,
            fontWeight: 'bold',
            color: activeTab === 'quizzes' ? '#009688' : '#666',
            borderBottomWidth: activeTab === 'quizzes' ? 2 : 0,
            borderBottomColor: '#009688'
          }}>
            QUIZZES
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderScreen()}
    </View>
  );
}