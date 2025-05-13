import { View, Text, StyleSheet } from 'react-native';

export default function SettingItem({ title, children }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});