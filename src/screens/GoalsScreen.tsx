import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, addMonths, subMonths } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useTaskStore } from '@store/taskStore';
import { useGoalStore } from '@store/goalStore';
import { useRewardStore } from '@store/rewardStore';
import { colors } from '@theme/colors';
import WeekDayStrip from '@components/ui/WeekDayStrip';
import ScreenHeader from '@components/ui/ScreenHeader';
import MonthYearPicker from '@components/ui/MonthYearPicker';
import GoalCard from '@components/goals/GoalCard';
import UpcomingRewardBanner from '@components/goals/UpcomingRewardBanner';
import type { Goal } from '@app-types/index';

export default function GoalsScreen() {
  const { selectedDate, setSelectedDate } = useTaskStore();
  const { goals, loadGoals } = useGoalStore();
  const { rewards, loadRewards } = useRewardStore();

  const weekStart = format(
    startOfWeek(new Date(selectedDate + 'T12:00:00'), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [pickerVisible, setPickerVisible] = useState(false);
  const monthLabel = format(new Date(`${displayMonth}-01T12:00:00`), 'MMMM yyyy');

  function handlePickerSelect(month: string) {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayMonth = format(new Date(), 'yyyy-MM');
    setDisplayMonth(month);
    if (month === todayMonth) {
      setSelectedDate(todayStr);
    } else {
      setSelectedDate(format(new Date(`${month}-01T12:00:00`), 'yyyy-MM-01'));
    }
  }

  useFocusEffect(
    useCallback(() => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayMonth = format(new Date(), 'yyyy-MM');
      setSelectedDate(todayStr);
      setDisplayMonth(todayMonth);
    }, [])
  );

  function changeMonth(direction: 1 | -1) {
    const base = new Date(`${displayMonth}-01T12:00:00`);
    const newDate = direction === 1 ? addMonths(base, 1) : subMonths(base, 1);
    const newMonth = format(newDate, 'yyyy-MM');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayMonth = format(new Date(), 'yyyy-MM');
    setDisplayMonth(newMonth);
    if (newMonth === todayMonth) {
      setSelectedDate(todayStr);
    } else {
      setSelectedDate(format(newDate, 'yyyy-MM-01'));
    }
  }

  useEffect(() => {
    loadGoals(weekStart);
    loadRewards(weekStart);
  }, [weekStart]);

  function getRewardTitle(rewardId?: string): string | undefined {
    if (!rewardId) return undefined;
    return rewards.find((r) => r.id === rewardId)?.title;
  }

  const upcomingReward = rewards.find((r) => !r.isUnlocked && r.linkedGoalId);
  const goalsRemaining = goals.filter((g) => g.currentValue < g.targetValue).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <ScreenHeader title={monthLabel} onTitlePress={() => setPickerVisible(true)} />
      <MonthYearPicker
        visible={pickerVisible}
        currentMonth={displayMonth}
        onSelect={handlePickerSelect}
        onClose={() => setPickerVisible(false)}
      />

      {/* Week strip */}
      <View style={styles.stripRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.stripArrow}>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <WeekDayStrip
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.stripArrow}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Goals list */}
      <FlatList<Goal>
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <Text style={styles.sectionHeader}>Active Goals</Text>
        }
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            rewardTitle={getRewardTitle(item.rewardId)}
          />
        )}
        ListFooterComponent={
          upcomingReward && goalsRemaining > 0 ? (
            <UpcomingRewardBanner
              reward={upcomingReward}
              goalsRemaining={goalsRemaining}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No goals this week</Text>
            <Text style={styles.emptySubtext}>Goals you set will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stripRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  stripArrow: { padding: 8 },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
