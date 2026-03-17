import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@theme';

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  valueColor?: string;
  badge?: string;
  badgeColor?: string;
  badgeBgColor?: string;
}

export default function MetricCard({
  label,
  value,
  icon,
  iconBgColor = colors.background,
  valueColor = colors.textPrimary,
  badge,
  badgeColor = colors.success,
  badgeBgColor = '#EDFAF2',
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  label: {
    ...typography.badge,
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 28,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    ...typography.badge,
  },
});
