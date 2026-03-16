import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfMonth,
  addWeeks,
  isBefore,
  differenceInCalendarDays,
  addDays,
} from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useRewardStore, useGoalStore } from '@store';
import { colors } from '@theme';
import { ScreenHeader, MonthYearPicker } from '@components/ui';
import { UnlockedRewardCard, LockedRewardCard } from '@components/rewards';
import type { Reward } from '@app-types';

// ─── Dummy data (for UI testing — remove when DB is wired up) ─────────────────

const DUMMY_REWARDS: Reward[] = [
  {
    id: 'dummy-unlocked-1',
    title: 'Cheat Day',
    description: 'Enjoy a guilt free meal!',
    icon: 'restaurant',
    linkedGoalId: undefined,
    isUnlocked: true,
    isClaimed: false,
    unlockedAt: new Date().toISOString(),
    weekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  },
  {
    id: 'dummy-locked-1',
    title: 'Go out to eat',
    description: 'Dinner at your favorite spot!',
    icon: 'pizza',
    linkedGoalId: 'dummy-goal-1',
    isUnlocked: false,
    isClaimed: false,
    weekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  },
  {
    id: 'dummy-locked-2',
    title: 'Watch a movie',
    description: 'Tickets & chill night',
    icon: 'film',
    linkedGoalId: 'dummy-goal-2',
    isUnlocked: false,
    isClaimed: false,
    weekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  },
];

const DUMMY_GOALS = [
  { id: 'dummy-goal-1', targetType: 'tasks' as const, targetValue: 50, currentValue: 34 },
  { id: 'dummy-goal-2', targetType: 'hours' as const, targetValue: 20, currentValue: 12 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeeksInMonth(yearMonth: string): { label: string; weekStart: string }[] {
  const monthStart = new Date(`${yearMonth}-01T12:00:00`);
  const monthEnd = endOfMonth(monthStart);
  const firstMonday = startOfWeek(monthStart, { weekStartsOn: 1 });
  // Only include weeks whose start falls within the month
  let current = isBefore(firstMonday, monthStart) ? addWeeks(firstMonday, 1) : firstMonday;
  const weeks: { label: string; weekStart: string }[] = [];
  let weekNum = 1;
  const monthEndStr = format(monthEnd, 'yyyy-MM-dd');
  while (format(current, 'yyyy-MM-dd') <= monthEndStr) {
    weeks.push({ label: `Week ${weekNum}`, weekStart: format(current, 'yyyy-MM-dd') });
    current = addWeeks(current, 1);
    weekNum++;
    if (weekNum > 6) break;
  }
  return weeks;
}

function getCurrentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

function getDaysUntilReset(weekStart: string): number {
  const weekEnd = addDays(new Date(weekStart + 'T12:00:00'), 6);
  return Math.max(0, differenceInCalendarDays(weekEnd, new Date()));
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ iconName, iconColor, label }: {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  label: string;
}) {
  return (
    <View style={sectionStyles.row}>
      <Ionicons name={iconName} size={20} color={iconColor} />
      <Text style={sectionStyles.label}>{label}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 },
  label: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
});

// ─── Rewards Screen ────────────────────────────────────────────────────────────

export default function RewardsScreen() {
  const { loadRewards, claimReward } = useRewardStore();
  const { loadGoals } = useGoalStore();

  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedWeekStart, setSelectedWeekStart] = useState(getCurrentWeekStart());
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const todayMonth = format(new Date(), 'yyyy-MM');
      const todayWeek = getCurrentWeekStart();
      setDisplayMonth(todayMonth);
      setSelectedWeekStart(todayWeek);
    }, [])
  );

  useEffect(() => {
    loadRewards(selectedWeekStart);
    loadGoals(selectedWeekStart);
  }, [selectedWeekStart]);

  const weeks = getWeeksInMonth(displayMonth);
  const daysUntilReset = getDaysUntilReset(selectedWeekStart);
  const monthLabel = format(new Date(`${displayMonth}-01T12:00:00`), 'MMMM yyyy');

  // TODO: replace with store data once DB is wired up
  const displayRewards = DUMMY_REWARDS;
  const unlockedRewards = displayRewards.filter((r) => r.isUnlocked);
  const lockedRewards = displayRewards.filter((r) => !r.isUnlocked);

  function changeMonth(direction: 1 | -1) {
    const base = new Date(`${displayMonth}-01T12:00:00`);
    const newDate = direction === 1 ? addMonths(base, 1) : subMonths(base, 1);
    const newMonth = format(newDate, 'yyyy-MM');
    setDisplayMonth(newMonth);
    const newWeeks = getWeeksInMonth(newMonth);
    if (newWeeks.length > 0) setSelectedWeekStart(newWeeks[0].weekStart);
  }

  function handlePickerSelect(month: string) {
    const todayMonth = format(new Date(), 'yyyy-MM');
    setDisplayMonth(month);
    if (month === todayMonth) {
      setSelectedWeekStart(getCurrentWeekStart());
    } else {
      const newWeeks = getWeeksInMonth(month);
      if (newWeeks.length > 0) setSelectedWeekStart(newWeeks[0].weekStart);
    }
  }

  function getLinkedGoal(reward: Reward) {
    if (!reward.linkedGoalId) return null;
    // TODO: switch back to goals store once DB is wired up
    return DUMMY_GOALS.find((g) => g.id === reward.linkedGoalId) ?? null;
  }

  const resetLabel = daysUntilReset === 0
    ? 'Resets today'
    : `Resets in ${daysUntilReset} day${daysUntilReset === 1 ? '' : 's'}`;

  const ListHeader = (
    <>
      {/* Unlocked Rewards — always shown */}
      <SectionHeader iconName="star" iconColor={colors.rewardGold} label="Unlocked Rewards" />
      {unlockedRewards.length > 0 ? (
        <>
          {unlockedRewards.map((r) => (
            <UnlockedRewardCard key={r.id} reward={r} onClaim={claimReward} />
          ))}
        </>
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>No unlocked rewards yet — keep going!</Text>
        </View>
      )}
      <View style={{ height: 20 }} />
      {/* Aspirational Goals */}
      <SectionHeader iconName="lock-closed" iconColor={colors.textSecondary} label="Aspirational Goals" />
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Shared header — matches Tasks/Goals */}
      <ScreenHeader
        title={monthLabel}
        subtitle="Monthly Planner"
        onTitlePress={() => setPickerVisible(true)}
      />
      <MonthYearPicker
        visible={pickerVisible}
        currentMonth={displayMonth}
        onSelect={handlePickerSelect}
        onClose={() => setPickerVisible(false)}
      />

      {/* Week strip with month arrows — matches Tasks/Goals stripRow pattern */}
      <View style={styles.stripRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.stripArrow} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStrip}
        >
          {weeks.map((w) => {
            const isActive = w.weekStart === selectedWeekStart;
            return (
              <TouchableOpacity
                key={w.weekStart}
                style={[styles.weekPill, isActive && styles.weekPillActive]}
                onPress={() => setSelectedWeekStart(w.weekStart)}
                activeOpacity={0.75}
              >
                <Text style={[styles.weekPillText, isActive && styles.weekPillTextActive]}>
                  {w.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.stripArrow} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Rewards title + reset badge */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.resetBadge}>
          <Text style={styles.resetText}>{resetLabel}</Text>
        </View>
      </View>

      {/* Content list */}
      <FlatList<Reward>
        data={lockedRewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => {
          const goal = getLinkedGoal(item);
          return (
            <LockedRewardCard
              reward={item}
              currentValue={goal?.currentValue ?? 0}
              targetValue={goal?.targetValue ?? 1}
              targetType={goal?.targetType}
              colorVariant={index % 2 === 0 ? 'beige' : 'pink'}
            />
          );
        }}
        ListEmptyComponent={
          lockedRewards.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No locked goals this week</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Week strip row — identical pattern to Tasks/Goals
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  stripArrow: { padding: 8 },
  weekStrip: {
    paddingHorizontal: 8,
    gap: 8,
    alignItems: 'center',
  },
  weekPill: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  weekPillActive: {
    backgroundColor: colors.primary,
  },
  weekPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  weekPillTextActive: {
    color: '#FFF',
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  resetBadge: {
    backgroundColor: '#E8F1FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // List
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
  },

  // Empty states
  emptySection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 4,
  },
  emptySectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
