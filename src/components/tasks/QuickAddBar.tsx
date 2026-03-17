import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors, typography } from '@theme';
import { useTaskStore } from '@store';

export default function QuickAddBar() {
  const { selectedDate, setQuickAddOpen } = useTaskStore();
  const dateLabel = format(new Date(selectedDate + 'T12:00:00'), 'MMM d');

  return (
    <TouchableOpacity style={styles.bar} onPress={() => setQuickAddOpen(true)} activeOpacity={0.8}>
      <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.barIcon} />
      <Text style={styles.placeholder}>Add a task for {dateLabel}...</Text>
      <View style={styles.addButton}>
        <Ionicons name="add" size={20} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  barIcon: { marginRight: 8 },
  placeholder: { flex: 1, ...typography.body, color: colors.textMuted },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
