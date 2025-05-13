import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RetakeModal({ visible, onClose, onSelect }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Retake</Text>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('all')}>
            <Text>🔁 All questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('wrong')}>
            <Text>❌ Wrong questions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={{ color: '#009688' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modal: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '70%'
  },
  title: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 15
  },
  option: {
    paddingVertical: 10
  },
  close: {
    marginTop: 15, alignItems: 'center'
  }
});