import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useTaskStore } from '@store/taskStore';
import { colors } from '@theme/colors';
import { getCompletionPercentage } from '@utils/progressHelpers';
import WeekDayStrip from '@components/ui/WeekDayStrip';
import ProgressBar from '@components/ui/ProgressBar';
import ScreenHeader from '@components/ui/ScreenHeader';
import MonthYearPicker from '@components/ui/MonthYearPicker';
import TaskCard from '@components/tasks/TaskCard';
import TaskSwipeRow from '@components/tasks/TaskSwipeRow';
import WorkloadDistribution from '@components/tasks/WorkloadDistribution';
import QuickAddBar from '@components/tasks/QuickAddBar';
import type { Task } from '@app-types/index';

// ─── Weekly Progress Card ─────────────────────────────────────────────────────

interface ProgressCardProps {
  completionPct: number;
  completedCount: number;
  totalCount: number;
}

function WeeklyProgressCard({ completionPct, completedCount, totalCount }: ProgressCardProps) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <View style={styles.progressHeaderLeft}>
          <Text style={styles.progressLabel}>WEEKLY PROGRESS</Text>
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>{completionPct}%</Text>
          </View>
        </View>
        <View style={styles.progressHeaderRight}>
          <Text style={styles.tasksDoneLabel}>Tasks done</Text>
          <Text style={styles.tasksDoneCount}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
      <ProgressBar progress={completionPct / 100} color={colors.primary} height={8} />
    </View>
  );
}

// ─── Tasks Screen ─────────────────────────────────────────────────────────────

export default function TasksScreen() {
  const {
    tasks,
    selectedDate,
    activeTab,
    setSelectedDate,
    setActiveTab,
    setEditingTask,
    deleteTask,
    completeTask,
  } = useTaskStore();

  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayMonth = format(new Date(), 'yyyy-MM');
      setSelectedDate(todayStr);
      setDisplayMonth(todayMonth);
    }, [])
  );

  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const incompleteTasks = dayTasks.filter((t) => !t.completed);
  const completedTasks = dayTasks.filter((t) => t.completed);
  const completionPct = getCompletionPercentage(dayTasks);

  const monthLabel = format(new Date(`${displayMonth}-01T12:00:00`), 'MMMM yyyy');

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

  function handleEdit(task: Task) {
    setEditingTask(task);
  }

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

      {/* Week strip with month nav arrows */}
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

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All Tasks
          </Text>
          {activeTab === 'all' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('completed')}>
          <View style={styles.tabRow}>
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Completed
            </Text>
            {completedTasks.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{completedTasks.length}</Text>
              </View>
            )}
          </View>
          {activeTab === 'completed' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Lists */}
      <View style={styles.listContainer}>
        {activeTab === 'all' ? (
          <FlatList
            data={incompleteTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TaskSwipeRow task={item} onComplete={completeTask} onEdit={handleEdit} onDelete={deleteTask}>
                <TaskCard
                  task={item}
                  onComplete={completeTask}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              </TaskSwipeRow>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No tasks for this day</Text>
                <Text style={styles.emptySubtext}>Tap + to add one</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={completedTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              dayTasks.length > 0 ? (
                <WeeklyProgressCard
                  completionPct={completionPct}
                  completedCount={completedTasks.length}
                  totalCount={dayTasks.length}
                />
              ) : null
            }
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onComplete={completeTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            )}
            ListFooterComponent={
              dayTasks.length > 0 ? <WorkloadDistribution tasks={dayTasks} /> : null
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No completed tasks yet</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Quick Add */}
      <QuickAddBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: { marginRight: 24, paddingBottom: 10 },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tabText: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  countBadge: {
    backgroundColor: '#E5E5EA',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countBadgeText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stripRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  stripArrow: { padding: 8 },
  listContainer: { flex: 1 },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 17, fontWeight: '600', color: colors.textSecondary },
  emptySubtext: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressHeaderRight: {
    alignItems: 'flex-end',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pctBadge: {
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pctText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  tasksDoneLabel: { fontSize: 12, color: colors.textSecondary },
  tasksDoneCount: { fontSize: 18, fontWeight: '700', color: colors.primary },
});
