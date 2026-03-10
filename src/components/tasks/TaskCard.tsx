import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActionSheetIOS,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Task } from '@app-types/index';
import { colors } from '@theme/colors';
import CategoryBadge from '@components/ui/CategoryBadge';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onComplete, onEdit, onDelete }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  function handleComplete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onComplete(task.id));
  }

  function handleMenu() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Edit', 'Delete'], destructiveButtonIndex: 2, cancelButtonIndex: 0 },
        (i) => {
          if (i === 1) onEdit(task);
          if (i === 2) onDelete(task.id);
        }
      );
    } else {
      Alert.alert('Options', '', [
        { text: 'Edit', onPress: () => onEdit(task) },
        { text: 'Delete', onPress: () => onDelete(task.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  if (task.completed) {
    return (
      <View style={styles.completedCard}>
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} style={styles.check} />
        <View style={styles.content}>
          <Text style={styles.completedTitle}>{task.title}</Text>
          <View style={styles.meta}>
            <CategoryBadge category={task.category} />
            <Text style={styles.time}>{task.time}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleComplete} activeOpacity={0.8}>
        <Animated.View style={[styles.checkbox, { transform: [{ scale }] }]} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.meta}>
          <CategoryBadge category={task.category} />
          <Text style={styles.time}>{task.time}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
      </TouchableOpacity>
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
    marginBottom: 8,
  },
  completedCard: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    marginRight: 12,
  },
  check: {
    marginRight: 12,
  },
  content: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  completedTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  time: { fontSize: 13, color: colors.textSecondary },
});
