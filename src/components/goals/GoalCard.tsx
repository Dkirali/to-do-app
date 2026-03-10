import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Goal } from '@app-types/index';
import { colors } from '@theme/colors';
import ProgressBar from '@components/ui/ProgressBar';

interface Props {
  goal: Goal;
}

// TODO (Phase 6): Full implementation with icon, reward row, motivation text
export default function GoalCard({ goal }: Props) {
  const progress = goal.targetValue > 0 ? goal.currentValue / goal.targetValue : 0;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{goal.title}</Text>
      <ProgressBar progress={progress} color={colors.primary} height={6} />
      <Text style={styles.count}>{goal.currentValue} / {goal.targetValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 8 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  count: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
