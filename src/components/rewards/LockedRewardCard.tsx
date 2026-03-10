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
}

// TODO (Phase 7): Muted background cards with lock overlay, progress bar
export default function LockedRewardCard({ reward, currentValue, targetValue }: Props) {
  const progress = targetValue > 0 ? currentValue / targetValue : 0;
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{reward.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.subtitle}>{reward.description}</Text>
        <Text style={styles.progressLabel}>PROGRESS</Text>
        <ProgressBar progress={progress} color={colors.primary} height={4} />
        <Text style={styles.count}>{currentValue} / {targetValue}</Text>
      </View>
      <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.rewardLocked1, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 28, marginRight: 12 },
  content: { flex: 1, marginRight: 8 },
  title: { fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  progressLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 },
  count: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
