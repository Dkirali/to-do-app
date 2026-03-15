import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Reward } from '@app-types/index';
import { colors } from '@theme/colors';

interface Props {
  reward: Reward;
  onClaim: (id: string) => void;
}

export default function UnlockedRewardCard({ reward, onClaim }: Props) {
  return (
    <View style={styles.card}>
      {/* Decorative diagonal lines */}
      <View style={styles.decorLine1} />
      <View style={styles.decorLine2} />

      <View style={styles.row}>
        {/* Icon circle */}
        <View style={styles.iconCircle}>
          <Ionicons name={reward.icon as any} size={26} color="rgba(255,255,255,0.95)" />
        </View>

        {/* Text */}
        <View style={styles.content}>
          <Text style={styles.title}>{reward.title.toUpperCase()}</Text>
          <Text style={styles.subtitle}>{reward.description}</Text>
        </View>

        {/* Claim button */}
        {!reward.isClaimed ? (
          <TouchableOpacity
            style={styles.claimBtn}
            onPress={() => onClaim(reward.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.claimText}>Claim</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.claimedBadge}>
            <Text style={styles.claimedText}>Claimed ✓</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const GOLD = colors.rewardGold;

const styles = StyleSheet.create({
  card: {
    backgroundColor: GOLD,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  // Subtle diagonal decoration lines
  decorLine1: {
    position: 'absolute',
    width: 160,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: 30,
    right: -20,
    transform: [{ rotate: '-30deg' }],
  },
  decorLine2: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: 20,
    right: 10,
    transform: [{ rotate: '-30deg' }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  content: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
  },
  claimBtn: {
    backgroundColor: '#FFF',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  claimText: {
    fontSize: 14,
    fontWeight: '700',
    color: GOLD,
  },
  claimedBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  claimedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
