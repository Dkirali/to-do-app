import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import type { Task } from '@app-types/index';

interface Props {
  task: Task;
  children: React.ReactNode;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const REVEAL_THRESHOLD = -80;   // px — reveal action buttons
const DELETE_THRESHOLD = -200;  // px — auto-trigger delete

export default function TaskSwipeRow({ task, children, onEdit, onDelete }: Props) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // Only allow left swipe
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX < DELETE_THRESHOLD) {
        // Swipe far enough — delete
        translateX.value = withSpring(0);
        runOnJS(onDelete)(task.id);
      } else if (e.translationX < REVEAL_THRESHOLD) {
        // Snap open to show action buttons
        translateX.value = withSpring(REVEAL_THRESHOLD);
      } else {
        // Snap closed
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Action buttons — rendered behind the card */}
      <Animated.View style={[styles.actions, actionsStyle]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => {
            translateX.value = withSpring(0);
            onEdit(task);
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => {
            translateX.value = withSpring(0);
            onDelete(task.id);
          }}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Swipeable card */}
      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  actions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionBtn: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: colors.swipeEdit,
  },
  deleteBtn: {
    backgroundColor: colors.swipeDelete,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
