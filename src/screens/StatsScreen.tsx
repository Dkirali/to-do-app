import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfMonth,
  addWeeks,
  isBefore,
  addDays,
} from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { useStatsStore } from '@store';
import { colors, categoryColor } from '@theme';
import { ScreenHeader, MonthYearPicker, ProgressBar } from '@components/ui';
import MetricCard from '@components/stats/MetricCard';
import ActivityTrendChart from '@components/stats/ActivityTrendChart';
import type { WeeklyStats } from '@app-types';

// ─── Dummy data (remove when DB is wired up) ──────────────────────────────────

function getCurrentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

const DUMMY_STATS: WeeklyStats = {
  id: 'dummy-1',
  weekStart: getCurrentWeekStart(),
  weekEnd: format(addDays(new Date(getCurrentWeekStart() + 'T12:00:00'), 6), 'yyyy-MM-dd'),
  completionPercentage: 75,
  tasksCompleted: 52,
  rewardsUnlocked: 2,
  bestCategory: 'study',
  personalBest: 58,
  dailyTaskCounts: [6, 8, 10, 5, 9, 4, 7],
};

const DUMMY_AVERAGE: number[] = [5, 6, 7, 5, 7, 4, 6];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeeksInMonth(yearMonth: string): { weekNum: number; weekStart: string }[] {
  const monthStart = new Date(`${yearMonth}-01T12:00:00`);
  const monthEnd = endOfMonth(monthStart);
  const firstMonday = startOfWeek(monthStart, { weekStartsOn: 1 });
  let current = isBefore(firstMonday, monthStart) ? addWeeks(firstMonday, 1) : firstMonday;
  const weeks: { weekNum: number; weekStart: string }[] = [];
  let weekNum = 1;
  const monthEndStr = format(monthEnd, 'yyyy-MM-dd');
  while (format(current, 'yyyy-MM-dd') <= monthEndStr) {
    weeks.push({ weekNum, weekStart: format(current, 'yyyy-MM-dd') });
    current = addWeeks(current, 1);
    weekNum++;
    if (weekNum > 6) break;
  }
  return weeks;
}

function getWeekDateRange(weekStart: string): string {
  const start = new Date(weekStart + 'T12:00:00');
  const end = addDays(start, 6);
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
}

function categoryIcon(cat: string): React.ComponentProps<typeof Ionicons>['name'] {
  switch (cat) {
    case 'gym':    return 'fitness';
    case 'work':   return 'briefcase';
    case 'study':  return 'school';
    case 'health': return 'heart';
    default:       return 'grid';
  }
}

// ─── Stats Screen ─────────────────────────────────────────────────────────────

export default function StatsScreen() {
  const { isLoading, loadStats } = useStatsStore(
    useShallow((state) => ({ isLoading: state.isLoading, loadStats: state.loadStats }))
  );

  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedWeekStart, setSelectedWeekStart] = useState(getCurrentWeekStart());
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDisplayMonth(format(new Date(), 'yyyy-MM'));
      setSelectedWeekStart(getCurrentWeekStart());
      loadStats();
    }, [])
  );

  const weeks = getWeeksInMonth(displayMonth);
  const monthLabel = format(new Date(`${displayMonth}-01T12:00:00`), 'MMMM yyyy');

  // TODO: replace with store data once DB is wired up
  const stats = DUMMY_STATS;
  const dateRange = getWeekDateRange(selectedWeekStart);
  const tasksRemaining = Math.max(
    0,
    Math.round(stats.tasksCompleted * (1 - stats.completionPercentage / 100))
  );

  function changeMonth(direction: 1 | -1) {
    const base = new Date(`${displayMonth}-01T12:00:00`);
    const newDate = direction === 1 ? addMonths(base, 1) : subMonths(base, 1);
    const newMonth = format(newDate, 'yyyy-MM');
    setDisplayMonth(newMonth);
    const newWeeks = getWeeksInMonth(newMonth);
    if (newWeeks.length > 0) setSelectedWeekStart(newWeeks[0].weekStart);
  }

  function handlePickerSelect(month: string) {
    setDisplayMonth(month);
    const newWeeks = getWeeksInMonth(month);
    const todayWeek = getCurrentWeekStart();
    const todayMonth = format(new Date(), 'yyyy-MM');
    setSelectedWeekStart(
      month === todayMonth ? todayWeek : newWeeks[0]?.weekStart ?? todayWeek
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header — matches Rewards screen */}
      <ScreenHeader
        title={monthLabel}
        subtitle="Weekly Stats"
        onTitlePress={() => setPickerVisible(true)}
      />
      <MonthYearPicker
        visible={pickerVisible}
        currentMonth={displayMonth}
        onSelect={handlePickerSelect}
        onClose={() => setPickerVisible(false)}
      />

      {/* Week card selector with month arrows */}
      <View style={styles.weekRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrow} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {weeks.map((w) => {
            const isActive = w.weekStart === selectedWeekStart;
            return (
              <TouchableOpacity
                key={w.weekStart}
                style={[styles.weekCard, isActive && styles.weekCardActive]}
                onPress={() => setSelectedWeekStart(w.weekStart)}
                activeOpacity={0.75}
              >
                <Text style={[styles.weekLabel, isActive && styles.weekLabelActive]}>WEEK</Text>
                <Text style={[styles.weekNum, isActive && styles.weekNumActive]}>{w.weekNum}</Text>
                {isActive && <View style={styles.weekDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrow} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator style={{ marginVertical: 8 }} color={colors.primary} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Performance Snapshot header */}
        <View style={styles.snapshotHeader}>
          <Text style={styles.sectionTitle}>Performance Snapshot</Text>
          <Text style={styles.dateRange}>{dateRange}</Text>
        </View>

        {/* Weekly Completion card */}
        <View style={styles.completionCard}>
          <View style={styles.completionTop}>
            <View>
              <Text style={styles.completionLabel}>WEEKLY COMPLETION</Text>
              <Text style={styles.completionValue}>{stats.completionPercentage}%</Text>
            </View>
            <View style={styles.greenBadge}>
              <Text style={styles.greenBadgeText}>+5% Last Week</Text>
            </View>
          </View>
          <ProgressBar progress={stats.completionPercentage / 100} height={10} />
          <Text style={styles.completionSub}>
            {tasksRemaining} tasks remaining to reach your goal
          </Text>
        </View>

        {/* Metric cards */}
        <MetricCard
          label="Tasks Completed"
          value={stats.tasksCompleted}
          iconBgColor="#EBF4FF"
          icon={<Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
          badge="+12% Last Week"
          badgeColor={colors.success}
          badgeBgColor="#EDFAF2"
        />
        <MetricCard
          label="Rewards Unlocked"
          value={stats.rewardsUnlocked}
          iconBgColor="#FFF3E0"
          icon={<Ionicons name="gift" size={24} color={colors.warning} />}
          badge="On Track"
          badgeColor={colors.textSecondary}
          badgeBgColor={colors.background}
        />
        <MetricCard
          label="Best Category"
          value={stats.bestCategory.charAt(0).toUpperCase() + stats.bestCategory.slice(1)}
          iconBgColor="#EBF4FF"
          icon={<Ionicons name={categoryIcon(stats.bestCategory)} size={24} color={colors.study} />}
          valueColor={categoryColor(stats.bestCategory)}
          badge="Top 15%"
          badgeColor={colors.primary}
          badgeBgColor={colors.primaryTint}
        />
        <MetricCard
          label="Personal Best"
          value={stats.personalBest}
          iconBgColor="#F3EEFF"
          icon={<Ionicons name="trophy" size={24} color={colors.work} />}
          badge="New Record!"
          badgeColor={colors.work}
          badgeBgColor="#F3EEFF"
        />

        {/* Activity Trend */}
        <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 12 }]}>
          Activity Trend
        </Text>
        <ActivityTrendChart
          peakData={stats.dailyTaskCounts}
          averageData={DUMMY_AVERAGE}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Week card strip
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  arrow: { padding: 8 },
  weekScroll: {
    paddingHorizontal: 8,
    gap: 8,
    alignItems: 'center',
  },
  weekCard: {
    width: 68,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  weekCardActive: {
    backgroundColor: colors.primary,
    width: 74,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  weekLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  weekLabelActive: { color: 'rgba(255,255,255,0.75)' },
  weekNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  weekNumActive: { fontSize: 20, color: '#FFF' },
  weekDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginTop: 3,
  },

  // Scrollable content
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },

  // Performance Snapshot header
  snapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateRange: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // Weekly Completion card
  completionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  completionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  completionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  completionValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  greenBadge: {
    backgroundColor: '#EDFAF2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  greenBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  completionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 8,
  },
});
