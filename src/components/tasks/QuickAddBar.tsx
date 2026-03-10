import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';

interface Props {
  onAdd: () => void;
  selectedDate: string;
}

// TODO (Phase 5): Full implementation with modal
export default function QuickAddBar({ onAdd }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput style={styles.input} placeholder="Add a task..." placeholderTextColor={colors.textMuted} editable={false} />
      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Ionicons name="add" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 16, marginBottom: 8 },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary },
  button: { backgroundColor: colors.primary, borderRadius: 999, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
