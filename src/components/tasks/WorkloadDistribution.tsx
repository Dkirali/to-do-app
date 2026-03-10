import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task, Category } from '@app-types/index';
import { colors, categoryColor } from '@theme/colors';
import ProgressBar from '@components/ui/ProgressBar';
import { getTaskCountByCategory } from '@utils/progressHelpers';

interface Props {
  tasks: Task[];
}

const CATEGORY_LABELS: Record<Category, string> = {
  work: 'Work',
  gym: 'Gym',
  study: 'Study',
  health: 'Health',
  general: 'General',
};

export default function WorkloadDistribution({ tasks }: Props) {
  const counts = getTaskCountByCategory(tasks);
  const total = tasks.length;
  const categories = Object.keys(counts) as Category[];

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>WORKLOAD DISTRIBUTION</Text>
      <View style={styles.cards}>
        {categories.map((cat) => {
          const count = counts[cat] ?? 0;
          const progress = total > 0 ? count / total : 0;
          const color = categoryColor(cat);
          return (
            <View key={cat} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={[styles.catName, { color }]}>{CATEGORY_LABELS[cat]}</Text>
                <Text style={styles.count}>{count}</Text>
              </View>
              <ProgressBar progress={progress} color={color} height={4} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, marginBottom: 8 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  cards: { gap: 8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: { fontSize: 13, fontWeight: '600' },
  count: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
});
