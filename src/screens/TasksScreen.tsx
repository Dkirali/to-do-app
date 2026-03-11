import React, { useState } from 'react';
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
import { generateUUID } from '@utils/uuid';
import { useTaskStore } from '@store/taskStore';
import { colors } from '@theme/colors';
import { getCompletionPercentage } from '@utils/progressHelpers';
import WeekDayStrip from '@components/ui/WeekDayStrip';
import ProgressBar from '@components/ui/ProgressBar';
import TaskCard from '@components/tasks/TaskCard';
import TaskSwipeRow from '@components/tasks/TaskSwipeRow';
import WorkloadDistribution from '@components/tasks/WorkloadDistribution';
import QuickAddBar from '@components/tasks/QuickAddBar';
import EditTaskModal from '@components/tasks/EditTaskModal';
import type { Task, Category } from '@app-types/index';

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
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  } = useTaskStore();

  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  function handleAddTask(
    title: string,
    category: Category,
    time: string,
    date: string,
    priority: 'low' | 'medium' | 'high',
    description: string
  ) {
    const newTask: Task = {
      id: generateUUID(),
      title,
      category,
      time,
      date,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      description: description || undefined,
    };
    addTask(newTask);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>{monthLabel}</Text>
          <Text style={styles.subheading}>Weekly Planner</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconPill}>
            <Ionicons name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconPill}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

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
      <QuickAddBar selectedDate={selectedDate} onAdd={handleAddTask} />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        visible={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onUpdate={(id, updates) => { updateTask(id, updates); setEditingTask(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  heading: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  subheading: { fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  headerIcons: { flexDirection: 'row', gap: 8, marginTop: 4 },
  iconPill: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.notificationBadge,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
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
