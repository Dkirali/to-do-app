import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task, Category } from '@app-types/index';
import { colors } from '@theme/colors';

interface Props {
  tasks: Task[];
}

// TODO (Phase 5): Full implementation with per-category bars
export default function WorkloadDistribution({ tasks }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>WORKLOAD DISTRIBUTION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});
