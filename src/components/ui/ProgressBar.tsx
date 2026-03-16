import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme';

interface Props {
  progress: number;   // 0 to 1
  color?: string;
  height?: number;
  backgroundColor?: string;
}

export default function ProgressBar({
  progress,
  color = colors.primary,
  height = 6,
  backgroundColor = '#E5E5EA',
}: Props) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={[styles.track, { height, backgroundColor }]}>
      <View style={[styles.fill, { width: `${clampedProgress * 100}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 999,
  },
});
