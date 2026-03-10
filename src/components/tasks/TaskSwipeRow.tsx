import React from 'react';
import { View } from 'react-native';
import type { Task } from '@app-types/index';

interface Props {
  task: Task;
  children: React.ReactNode;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// TODO (Phase 5): Implement swipe gesture with Reanimated + GestureHandler
export default function TaskSwipeRow({ children }: Props) {
  return <View>{children}</View>;
}
