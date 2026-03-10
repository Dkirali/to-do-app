import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Reward } from '@app-types/index';
import { colors } from '@theme/colors';

interface Props {
  reward: Reward;
  goalsRemaining: number;
}

// TODO (Phase 6): Full implementation with dark blue card, decorative icon
export default function UpcomingRewardBanner({ reward, goalsRemaining }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>UPCOMING REWARD</Text>
      <Text style={styles.title}>{reward.title}</Text>
      <Text style={styles.subtitle}>Complete {goalsRemaining} more goals to unlock</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1A3A6C', borderRadius: 16, padding: 20, marginTop: 8 },
  label: { fontSize: 11, fontWeight: '700', color: '#90CAF9', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#B0C4DE' },
});
