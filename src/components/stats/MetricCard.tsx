import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

// TODO (Phase 8): Full implementation with delta badges and color variants
export default function MetricCard({ label, value, icon, badge, badgeColor }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeColor ?? colors.success }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F3F7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  content: { flex: 1 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
});
