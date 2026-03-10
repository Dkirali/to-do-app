import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
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

interface Props {
  selectedDate: string;
  onAdd: (title: string, category: Category, time: string, date: string) => void;
}

export default function QuickAddBar({ selectedDate, onAdd }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [time, setTime] = useState('09:00 AM');

  const dateLabel = format(new Date(selectedDate + 'T12:00:00'), 'MMM d');

  function handleSubmit() {
    if (!title.trim()) return;
    onAdd(title.trim(), category, time, selectedDate);
    setTitle('');
    setCategory('general');
    setTime('09:00 AM');
    setModalVisible(false);
  }

  function handleClose() {
    setTitle('');
    setCategory('general');
    setTime('09:00 AM');
    setModalVisible(false);
  }

  return (
    <>
      <TouchableOpacity style={styles.bar} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.barIcon} />
        <Text style={styles.placeholder}>Add a task for {dateLabel}...</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
        <SafeAreaView style={styles.modal}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.done, !title.trim() && styles.doneDimmed]}>Add</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              {/* Title */}
              <TextInput
                style={styles.titleInput}
                placeholder="Task title..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

              {/* Category */}
              <Text style={styles.sectionLabel}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
                {CATEGORIES.map((cat) => {
                  const selected = cat === category;
                  const color = categoryColor(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        selected
                          ? { backgroundColor: color }
                          : { backgroundColor: `${color}20` },
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.catChipText, { color: selected ? '#FFF' : color }]}>
                        {CATEGORY_LABELS[cat]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Time */}
              <Text style={styles.sectionLabel}>TIME</Text>
              <TextInput
                style={styles.timeInput}
                value={time}
                onChangeText={setTime}
                placeholder="09:00 AM"
                placeholderTextColor={colors.textMuted}
              />

              {/* Date */}
              <Text style={styles.sectionLabel}>DATE</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.dateText}>
                  {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
  // Modal
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  cancel: { fontSize: 17, color: colors.textSecondary },
  done: { fontSize: 17, fontWeight: '600', color: colors.primary },
  doneDimmed: { opacity: 0.4 },
  modalBody: { flex: 1, padding: 20 },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  categoryRow: { gap: 8, paddingBottom: 24 },
  catChip: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  catChipText: { fontSize: 14, fontWeight: '600' },
  timeInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  dateText: { fontSize: 15, color: colors.textPrimary },
});
