import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@theme';
import type { Task } from '@app-types';

interface Props {
  task: Task;
  children: React.ReactNode;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const MAX_RIGHT = 80;          // reveal complete button (right swipe)
const COMPLETE_THRESHOLD = 60; // snap to complete reveal
const REVEAL_THRESHOLD = -160; // reveal both edit + delete (left swipe)
const DELETE_THRESHOLD = -250; // auto-delete on extreme left swipe

export default function TaskSwipeRow({ task, children, onComplete, onEdit, onDelete }: Props) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.max(REVEAL_THRESHOLD, Math.min(MAX_RIGHT, e.translationX));
    })
    .onEnd((e) => {
      if (e.translationX < DELETE_THRESHOLD) {
        // Extreme left swipe → auto-delete
        translateX.value = withSpring(0);
        runOnJS(onDelete)(task.id);
      } else if (e.translationX < REVEAL_THRESHOLD) {
        // Left swipe past threshold → snap to reveal both buttons
        translateX.value = withSpring(REVEAL_THRESHOLD);
      } else if (e.translationX > COMPLETE_THRESHOLD) {
        // Right swipe past threshold → snap to reveal complete button
        translateX.value = withSpring(MAX_RIGHT);
      } else {
        // Short swipe → snap back
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 10 ? 1 : 0,
  }));

  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  function closeRow() {
    translateX.value = withSpring(0);
  }

  function handleComplete() {
    closeRow();
    runOnJS(onComplete)(task.id);
  }

  return (
    <View style={styles.wrapper}>
      {/* Left action — complete (green, revealed on right swipe) */}
      <Animated.View style={[styles.leftActions, leftActionsStyle]}>
        <TouchableOpacity style={[styles.actionBtn, styles.completeBtn]} onPress={handleComplete}>
          <Ionicons name="checkmark" size={22} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Right actions — edit + delete (revealed on left swipe) */}
      <Animated.View style={[styles.rightActions, rightActionsStyle]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => { closeRow(); onEdit(task); }}
        >
          <Ionicons name="pencil" size={18} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => { closeRow(); onDelete(task.id); }}
        >
          <Ionicons name="trash" size={18} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', marginBottom: 8 },
  leftActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E8FAF0',
  },
  rightActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F2F3F7',
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  completeBtn: { backgroundColor: colors.success },
  editBtn: { backgroundColor: colors.swipeEdit },
  deleteBtn: { backgroundColor: colors.swipeDelete },
});
