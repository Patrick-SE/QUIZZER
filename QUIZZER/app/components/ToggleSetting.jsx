import React from 'react';
import { View, Text, Switch } from 'react-native';
import { colors } from '../../styles/colors';

export default function ToggleSetting({ label, value, onValueChange }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} thumbColor={colors.primary} />
    </View>
  );
}