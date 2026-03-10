import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Task } from '@app-types/index';
import { colors } from '@theme/colors';
import CategoryBadge from '@components/ui/CategoryBadge';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// TODO (Phase 5): Full implementation with animated checkbox, swipe actions
export default function TaskCard({ task, onComplete }: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onComplete(task.id)} />
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.meta}>
          <CategoryBadge category={task.category} />
          <Text style={styles.time}>{task.time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, marginRight: 12 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  time: { fontSize: 13, color: colors.textSecondary },
});
