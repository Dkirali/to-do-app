import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Goal } from '@app-types';
import { colors, categoryColor, typography } from '@theme';
import ProgressBar from '@components/ui/ProgressBar';

interface Props {
  goal: Goal;
  rewardTitle?: string;
}

function goalIconName(category: string): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'gym':
    case 'health':  return 'barbell';
    case 'work':    return 'briefcase';
    case 'study':   return 'book';
    default:        return 'checkmark-done';
  }
}

function categoryLabel(goal: Goal): string {
  if (goal.category === 'general') return 'WEEKLY GOAL';
  return `${goal.category.toUpperCase()} CATEGORY`;
}

function countDisplay(goal: Goal): string {
  return goal.targetType === 'hours'
    ? `${goal.currentValue} / ${goal.targetValue}h`
    : `${goal.currentValue} / ${goal.targetValue}`;
}

export default function GoalCard({ goal, rewardTitle }: Props) {
  const progress = goal.targetValue > 0
    ? Math.min(goal.currentValue / goal.targetValue, 1)
    : 0;
  const pct = Math.round(progress * 100);
  const accent = categoryColor(goal.category);

  return (
    <View style={styles.card}>
      {/* Row 1: icon + title/label + percentage */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accent}18` }]}>
          <Ionicons name={goalIconName(goal.category)} size={22} color={accent} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={[styles.categoryLabel, { color: accent }]}>
            {categoryLabel(goal)}
          </Text>
        </View>
        <Text style={[styles.pct, { color: accent }]}>{pct}%</Text>
      </View>

      {/* Row 2: progress bar */}
      <ProgressBar progress={progress} color={accent} height={8} />

      {/* Row 3: reward/motivation + count */}
      <View style={styles.bottomRow}>
        <View style={styles.bottomLeft}>
          {rewardTitle ? (
            <View style={styles.rewardRow}>
              <Ionicons name="gift-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Reward: {rewardTitle}</Text>
            </View>
          ) : goal.motivationText ? (
            <Text style={styles.metaText}>{goal.motivationText}</Text>
          ) : null}
        </View>
        <Text style={styles.count}>{countDisplay(goal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...typography.heading4,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryLabel: {
    ...typography.badge,
  },
  pct: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomLeft: {
    flex: 1,
    marginRight: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  count: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
