import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme';

interface Props {
  peakData: number[];
  averageData: number[];
  labels: string[];
}

// TODO (Phase 8): Implement with react-native-gifted-charts LineChart
export default function ActivityTrendChart({ peakData, averageData, labels }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Activity Trend Chart (Phase 8)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', height: 200 },
  placeholder: { color: colors.textSecondary, fontSize: 14 },
});
