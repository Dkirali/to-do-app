import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { useTaskStore, useGoalStore, useRewardStore } from '@store';
import { colors } from '@theme';
import { useMonthNavigation } from '@hooks';
import { WeekDayStrip, ScreenHeader, MonthYearPicker } from '@components/ui';
import { GoalCard } from '@components/goals';
import { UpcomingRewardBanner } from '@components/rewards';
import type { Goal } from '@app-types';

export default function GoalsScreen() {
  const { selectedDate, setSelectedDate } = useTaskStore(
    useShallow((state) => ({
      selectedDate: state.selectedDate,
      setSelectedDate: state.setSelectedDate,
    }))
  );

  const { goals, isLoading: goalsLoading, loadGoals } = useGoalStore(
    useShallow((state) => ({
      goals: state.goals,
      isLoading: state.isLoading,
      loadGoals: state.loadGoals,
    }))
  );

  const { rewards, loadRewards } = useRewardStore(
    useShallow((state) => ({
      rewards: state.rewards,
      loadRewards: state.loadRewards,
    }))
  );

  const weekStart = format(
    startOfWeek(new Date(selectedDate + 'T12:00:00'), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  const {
    displayMonth,
    setDisplayMonth,
    pickerVisible,
    setPickerVisible,
    monthLabel,
    changeMonth,
    handlePickerSelect,
  } = useMonthNavigation(setSelectedDate);

  useFocusEffect(
    useCallback(() => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayMonth = format(new Date(), 'yyyy-MM');
      setSelectedDate(todayStr);
      setDisplayMonth(todayMonth);
    }, [setSelectedDate, setDisplayMonth])
  );

  useEffect(() => {
    loadGoals(weekStart);
    loadRewards(weekStart);
  }, [weekStart]);

  const getRewardTitle = useCallback((rewardId?: string): string | undefined => {
    if (!rewardId) return undefined;
    return rewards.find((r) => r.id === rewardId)?.title;
  }, [rewards]);

  const upcomingReward = rewards.find((r) => !r.isUnlocked && r.linkedGoalId);
  const goalsRemaining = goals.filter((g) => g.currentValue < g.targetValue).length;

  const renderGoalItem = useCallback(({ item }: { item: Goal }) => (
    <GoalCard goal={item} rewardTitle={getRewardTitle(item.rewardId)} />
  ), [getRewardTitle]);

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
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          style={styles.stripArrow}
          accessibilityLabel="Previous month"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <WeekDayStrip
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <TouchableOpacity
          onPress={() => changeMonth(1)}
          style={styles.stripArrow}
          accessibilityLabel="Next month"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Goals list */}
      {goalsLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList<Goal>
          data={goals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={
            <Text style={styles.sectionHeader}>Active Goals</Text>
          }
          renderItem={renderGoalItem}
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
      )}
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
  loader: { marginTop: 40 },
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
