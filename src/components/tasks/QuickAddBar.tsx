import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import { colors, categoryColor } from '@theme/colors';
import type { Category } from '@app-types/index';

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

interface Props {
  selectedDate: string;
  onAdd: (
    title: string,
    category: Category,
    time: string,
    date: string,
    priority: Priority,
    description: string
  ) => void;
}

export default function QuickAddBar({ selectedDate, onAdd }: Props) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [time, setTime] = useState('09:00 AM');
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');

  const dateLabel = format(new Date(selectedDate + 'T12:00:00'), 'MMM d');

  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const dueDateLabel = isToday(selectedDateObj)
    ? `Today, ${time}`
    : `${format(selectedDateObj, 'MMM d')}, ${time}`;

  function handleSubmit() {
    if (!title.trim()) return;
    onAdd(title.trim(), category, time, selectedDate, priority, description.trim());
    resetForm();
  }

  function handleClose() {
    resetForm();
  }

  function resetForm() {
    setTitle('');
    setCategory('general');
    setTime('09:00 AM');
    setPriority('medium');
    setDescription('');
    setModalVisible(false);
  }

  return (
    <>
      <TouchableOpacity style={styles.bar} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.barIcon} />
        <Text style={styles.placeholder}>Add a task for {dateLabel}...</Text>
        <View style={styles.addButton}>
          <Ionicons name="add" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        {Platform.OS === 'ios' ? (
          <FullWindowOverlay>
            <View style={styles.overlay}>
              <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
              <View style={styles.kavWrapper}>
                <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
              <View style={styles.handle} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
              >
                {/* Title */}
                <TextInput
                  style={styles.titleInput}
                  placeholder="Task title..."
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  returnKeyType="done"
                />

                {/* Due Date */}
                <View style={styles.dueDateRow}>
                  <View style={styles.calIconContainer}>
                    <Ionicons name="calendar" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dueDateLabel}>DUE DATE</Text>
                    <Text style={styles.dueDateValue}>{dueDateLabel}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>

                {/* Category */}
                <Text style={styles.sectionLabel}>CATEGORY</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryRow}
                >
                  {CATEGORIES.map((cat) => {
                    const selected = cat === category;
                    const color = categoryColor(cat);
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.catChip,
                          selected ? styles.catChipSelected : { borderColor: `${color}50` },
                        ]}
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

                {/* Priority */}
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

                {/* Description */}
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

                {/* Add Task */}
                <TouchableOpacity
                  style={[styles.addBtn, !title.trim() && styles.addBtnDimmed]}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addBtnText}>Add Task</Text>
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity onPress={handleClose}>
                  <Text style={styles.cancelText}>CANCEL</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </FullWindowOverlay>
    ) : (
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
        <View style={styles.kavWrapper}>
          <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
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
              <View style={styles.dueDateRow}>
                <View style={styles.calIconContainer}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dueDateLabel}>DUE DATE</Text>
                  <Text style={styles.dueDateValue}>{dueDateLabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
              <Text style={styles.sectionLabel}>CATEGORY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {CATEGORIES.map((cat) => {
                  const selected = cat === category;
                  const color = categoryColor(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        selected ? styles.catChipSelected : { borderColor: `${color}50` },
                      ]}
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
          </View>
        </View>
      </View>
    )}
  </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  barIcon: { marginRight: 8 },
  placeholder: { flex: 1, fontSize: 15, color: colors.textMuted },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  kavWrapper: { width: '100%' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20, // Base padding, will add insets dynamically
    paddingTop: 12,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 20,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
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
    borderColor: '#E5E5EA',
    backgroundColor: '#FFF',
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
    backgroundColor: '#F2F3F7',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F8F8F8',
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
});
