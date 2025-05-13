import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuestionType() {
  const { quizName } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(true);

  const handleSelect = (screen) => {
    setModalVisible(false);
    setTimeout(() => router.push({ pathname: `/(tabs)/${screen}`, params: { quizName } }), 100);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← {quizName}</Text>
        </TouchableOpacity>
      </View>

      {/* Question Type Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Question Type</Text>

            <TouchableOpacity onPress={() => handleSelect('multiple-choice')}>
              <Text style={styles.option}>Multiple Choice</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect('short-text')}>
              <Text style={styles.option}>Short Text</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect('true-false')}>
              <Text style={styles.option}>True or False</Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                router.push({ pathname: '/(tabs)/quiz-screen', params: { name: quizName } });
              }}
              style={styles.backButton}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 20 },
  backText: { fontSize: 16, color: '#009688', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 12, elevation: 10, alignItems: 'center' },
  modalTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  option: { paddingVertical: 12, fontSize: 16, color: '#009688', fontWeight: 'bold' },
  backButton: { marginTop: 20, paddingVertical: 10, width: '100%', alignItems: 'center', borderTopColor: '#ccc', borderTopWidth: 1 },
});