import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RetakeModal({ visible, onClose, onSelect }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Retake</Text>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('all')}>
            <Ionicons name="refresh-circle" size={24} color="#009688" style={styles.icon} />
            <Text style={styles.optionText}>All Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('wrong')}>
            <Ionicons name="close-circle" size={24} color="#F44336" style={styles.icon} />
            <Text style={styles.optionText}>Wrong Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={{ color: '#009688', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '75%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
  },
  close: {
    marginTop: 20,
    alignItems: 'center',
  },
});