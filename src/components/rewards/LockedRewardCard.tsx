import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Reward } from '@app-types/index';
import { colors } from '@theme/colors';
import ProgressBar from '@components/ui/ProgressBar';

interface Props {
  reward: Reward;
  currentValue: number;
  targetValue: number;
  targetType?: 'tasks' | 'hours';
  colorVariant?: 'beige' | 'pink';
}

export default function LockedRewardCard({
  reward,
  currentValue,
  targetValue,
  targetType = 'tasks',
  colorVariant = 'beige',
}: Props) {
  const progress = targetValue > 0 ? currentValue / targetValue : 0;
  const remaining = Math.max(0, targetValue - currentValue);
  const unit = targetType === 'hours' ? 'hours' : 'Tasks';
  const remainingLabel = remaining === 0
    ? 'Goal reached!'
    : targetType === 'hours'
      ? `${remaining} more hour${remaining === 1 ? '' : 's'}`
      : `${remaining} more to go`;

  const bg = colorVariant === 'pink' ? colors.rewardLocked2 : colors.rewardLocked1;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      {/* Header row: icon + text + lock */}
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={reward.icon as any} size={22} color="rgba(255,255,255,0.9)" />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{reward.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{reward.description}</Text>
        </View>
        <View style={styles.lockCircle}>
          <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.7)" />
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>PROGRESS</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressCount}>
            {currentValue}/{targetValue}{' '}
            <Text style={styles.progressUnit}>{unit}</Text>
          </Text>
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>{remainingLabel}</Text>
          </View>
        </View>
        <ProgressBar progress={progress} color={colors.primary} height={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
  },
  lockCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: { gap: 6 },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  progressUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
  },
  remainingBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});
