import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, categoryColor } from '@theme';
import { useTaskStore } from '@store';
import { generateUUID } from '@utils/uuid';
import type { Category, Task } from '@app-types';

const CATEGORIES: Category[] = ['general', 'gym', 'work', 'study', 'health'];
const CATEGORY_LABELS: Record<Category, string> = {
  general: 'General',
  gym: 'Gym',
  work: 'Work',
  study: 'Study',
  health: 'Health',
};

type Priority = 'low' | 'medium' | 'high';
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

function timeStringToDate(timeStr: string, dateStr: string): Date {
  const base = new Date(`${dateStr}T12:00:00`);
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return base;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  base.setHours(hours, minutes, 0, 0);
  return base;
}

function dateToTimeString(date: Date): string {
  return format(date, 'hh:mm aa').replace('am', 'AM').replace('pm', 'PM');
}

export default function AddTaskSheet() {
  const { selectedDate, quickAddOpen, setQuickAddOpen, addTask } = useTaskStore();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(800)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [time, setTime] = useState('09:00 AM');
  const [taskDate, setTaskDate] = useState(selectedDate);
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');

  // Picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());
  const [androidStep, setAndroidStep] = useState<'date' | 'time'>('date');

  const taskDateObj = new Date(taskDate + 'T12:00:00');
  const dueDateLabel = isToday(taskDateObj)
    ? `Today, ${time}`
    : `${format(taskDateObj, 'MMM d')}, ${time}`;

  useEffect(() => {
    if (quickAddOpen) {
      setTaskDate(selectedDate);
      slideAnim.setValue(800);
      backdropAnim.setValue(0);
      setIsVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [quickAddOpen]);

  function handleClose() {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 800, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => {
      setIsVisible(false);
      setQuickAddOpen(false);
      resetForm();
    });
  }

  function handleSubmit() {
    if (!title.trim()) return;
    const newTask: Task = {
      id: generateUUID(),
      title: title.trim(),
      category,
      time,
      date: taskDate,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      description: description.trim() || undefined,
    };
    addTask(newTask);
    handleClose();
  }

  function resetForm() {
    setTitle('');
    setCategory('general');
    setTime('09:00 AM');
    setTaskDate(selectedDate);
    setPriority('medium');
    setDescription('');
  }

  function openPicker() {
    const initial = timeStringToDate(time, taskDate);
    setPickerDate(initial);
    if (Platform.OS === 'android') {
      setAndroidStep('date');
    }
    setPickerVisible(true);
  }

  function handleAndroidChange(_event: DateTimePickerEvent, selected?: Date) {
    if (!selected) {
      setPickerVisible(false);
      return;
    }
    if (androidStep === 'date') {
      const newDateStr = format(selected, 'yyyy-MM-dd');
      setTaskDate(newDateStr);
      // Keep time from previous pickerDate, apply to new date
      const next = new Date(selected);
      next.setHours(pickerDate.getHours(), pickerDate.getMinutes(), 0, 0);
      setPickerDate(next);
      setAndroidStep('time');
    } else {
      setTime(dateToTimeString(selected));
      setPickerVisible(false);
      setAndroidStep('date');
    }
  }

  function handleIOSChange(_event: DateTimePickerEvent, selected?: Date) {
    if (selected) setPickerDate(selected);
  }

  function confirmIOSPicker() {
    setTaskDate(format(pickerDate, 'yyyy-MM-dd'));
    setTime(dateToTimeString(pickerDate));
    setPickerVisible(false);
  }

  if (!isVisible) return null;

  return (
    <FullWindowOverlay>
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }], paddingBottom: 20 + insets.bottom }]}
        >
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Task title..."
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
            />

            <TouchableOpacity style={styles.dueDateRow} onPress={openPicker} activeOpacity={0.7}>
              <View style={styles.calIconContainer}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dueDateLabel}>DUE DATE</Text>
                <Text style={styles.dueDateValue}>{dueDateLabel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {pickerVisible && Platform.OS === 'ios' && (
              <View style={styles.inlinePicker}>
                <View style={styles.inlinePickerHeader}>
                  <TouchableOpacity onPress={() => setPickerVisible(false)}>
                    <Text style={styles.iosPickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirmIOSPicker}>
                    <Text style={styles.iosPickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={pickerDate}
                  mode="datetime"
                  display="spinner"
                  onChange={handleIOSChange}
                  style={styles.iosPicker}
                />
              </View>
            )}

            {pickerVisible && Platform.OS === 'android' && (
              <DateTimePicker
                value={pickerDate}
                mode={androidStep === 'date' ? 'date' : 'time'}
                display="default"
                onChange={handleAndroidChange}
              />
            )}

            <Text style={styles.sectionLabel}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const selected = cat === category;
                const color = categoryColor(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, selected ? styles.catChipSelected : { borderColor: `${color}50` }]}
                    onPress={() => setCategory(cat)}
                  >
                    <View style={[styles.catDot, { backgroundColor: selected ? '#FFF' : color }]} />
                    <Text style={[styles.catChipText, { color: selected ? '#FFF' : color }]}>
                      {CATEGORY_LABELS[cat]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionLabel}>PRIORITY</Text>
            <View style={styles.priorityContainer}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityOption, priority === p && styles.prioritySelected]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityText, priority === p && styles.priorityTextSelected]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <TextInput
              style={styles.descInput}
              placeholder="Add description..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.addBtn, !title.trim() && styles.addBtnDimmed]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>

    </FullWindowOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  calIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `${colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dueDateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dueDateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  categoryRow: { gap: 8, paddingBottom: 20 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  catChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  catChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  prioritySelected: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  priorityTextSelected: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  descInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnDimmed: { opacity: 0.45 },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  cancelText: {
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inlinePicker: {
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
  },
  inlinePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iosPickerCancel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  iosPickerDone: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  iosPicker: {
    height: 200,
  },
});
