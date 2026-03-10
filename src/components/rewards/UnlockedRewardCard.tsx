import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Reward } from '@app-types/index';
import { colors } from '@theme/colors';

interface Props {
  reward: Reward;
  onClaim: (id: string) => void;
}

// TODO (Phase 7): Gold gradient card, confetti animation on claim
export default function UnlockedRewardCard({ reward, onClaim }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{reward.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.subtitle}>{reward.description}</Text>
      </View>
      {!reward.isClaimed && (
        <TouchableOpacity style={styles.claimBtn} onPress={() => onClaim(reward.id)}>
          <Text style={styles.claimText}>Claim</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.rewardGold, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 32, marginRight: 12 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  claimBtn: { backgroundColor: '#FFF', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  claimText: { fontSize: 13, fontWeight: '600', color: colors.rewardGold },
});
