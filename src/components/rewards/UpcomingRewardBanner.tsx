import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Reward } from '@app-types';
import { typography } from '@theme';

interface Props {
  reward: Reward;
  goalsRemaining: number;
}

export default function UpcomingRewardBanner({ reward, goalsRemaining }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Ghost decorative icon */}
      <View style={styles.ghostIcon} pointerEvents="none">
        <Ionicons
          name={(reward.icon as keyof typeof Ionicons.glyphMap) || 'gift'}
          size={110}
          color="rgba(255,255,255,0.12)"
        />
      </View>

      {/* Content */}
      <Text style={styles.label}>UPCOMING REWARD</Text>
      <Text style={styles.title}>{reward.title}</Text>
      <Text style={styles.subtitle}>
        Complete {goalsRemaining} more goal{goalsRemaining !== 1 ? 's' : ''} to unlock
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1A3A6C',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    overflow: 'hidden',
  },
  ghostIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  label: {
    ...typography.badge,
    color: '#90CAF9',
    marginBottom: 6,
  },
  title: {
    ...typography.heading2,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: '#B0C4DE',
  },
});
