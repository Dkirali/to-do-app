import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, typography } from '@theme';

interface Props {
  peakData: number[];
  averageData: number[];
  labels: string[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
// 20px screen padding each side, 20px card padding each side
const CHART_WIDTH = SCREEN_WIDTH - 40 - 40;

export default function ActivityTrendChart({ peakData, averageData, labels }: Props) {
  const maxVal = Math.max(...peakData, ...averageData, 1);
  const spacing = Math.floor((CHART_WIDTH - 20) / (peakData.length - 1));

  const peakPoints = peakData.map((v) => ({ value: v }));
  const avgPoints = averageData.map((v) => ({ value: v }));

  return (
    <View style={styles.card}>
      <LineChart
        data={peakPoints}
        data2={avgPoints}
        height={160}
        width={CHART_WIDTH}
        spacing={spacing}
        color1={colors.chartPrimary}
        color2={colors.chartSecondary}
        dataPointsColor1={colors.chartPrimary}
        dataPointsColor2={colors.chartSecondary}
        dataPointsRadius={4}
        dataPointsRadius2={3}
        thickness={2.5}
        thickness2={2.5}
        curved
        hideYAxisText
        hideAxesAndRules={false}
        rulesColor={colors.border}
        rulesType="solid"
        xAxisColor="transparent"
        yAxisColor="transparent"
        noOfSections={3}
        maxValue={maxVal + 2}
        initialSpacing={10}
        endSpacing={10}
        hideDataPoints={false}
      />

      {/* Day labels */}
      <View style={styles.labelRow}>
        {labels.map((l) => (
          <Text key={l} style={styles.dayLabel}>{l.toUpperCase()}</Text>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartPrimary }]} />
          <Text style={styles.legendText}>Peak Performance</Text>
        </View>
        <View style={[styles.legendItem, { marginLeft: 16 }]}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartSecondary }]} />
          <Text style={styles.legendText}>Weekly Average</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  dayLabel: {
    ...typography.micro,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.badge,
    fontWeight: '600',
    textTransform: 'none',
  },
});
