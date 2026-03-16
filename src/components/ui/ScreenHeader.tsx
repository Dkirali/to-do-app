import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme';

interface Props {
  title: string;           // e.g. "March 2026"
  subtitle?: string;       // defaults to "Weekly Planner"
  onTitlePress?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle = 'Weekly Planner',
  onTitlePress,
  onSearch,
  onNotifications,
}: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onTitlePress} activeOpacity={onTitlePress ? 0.6 : 1} style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <Text style={styles.heading}>{title}</Text>
          {onTitlePress && (
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} style={styles.titleChevron} />
          )}
        </View>
        <Text style={styles.subheading}>{subtitle}</Text>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconPill} onPress={onSearch} activeOpacity={0.7}>
          <Ionicons name="search" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconPill} onPress={onNotifications} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  titleChevron: {
    marginTop: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconPill: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.notificationBadge,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
});
