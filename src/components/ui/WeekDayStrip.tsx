import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, eachDayOfInterval, getDaysInMonth, isSameDay } from 'date-fns';
import { colors } from '@theme/colors';

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const CELL_WIDTH = 50;
const CELL_GAP = 4;

interface Props {
  displayMonth: string;           // 'yyyy-MM'
  selectedDate: string;           // 'yyyy-MM-dd'
  onSelectDate: (date: string) => void;
}

export default function WeekDayStrip({ displayMonth, selectedDate, onSelectDate }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const today = new Date();

  const [year, month] = displayMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month - 1, getDaysInMonth(firstDay));
  const dates = eachDayOfInterval({ start: firstDay, end: lastDay });

  // Scroll so the selected date is visible whenever it or the month changes
  useEffect(() => {
    const selectedIndex = dates.findIndex(
      (d) => format(d, 'yyyy-MM-dd') === selectedDate
    );
    const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: targetIndex * (CELL_WIDTH + CELL_GAP), animated: false });
    }, 0);
  }, [selectedDate, displayMonth]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.strip}
      contentContainerStyle={styles.container}
    >
      {dates.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isSelected = dateStr === selectedDate;
        const isToday = isSameDay(date, today);
        const dayLabel = DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1];

        return (
          <TouchableOpacity
            key={dateStr}
            style={[
              styles.dayCell,
              isSelected && styles.selectedCell,
              isToday && !isSelected && styles.todayCell,
            ]}
            onPress={() => onSelectDate(dateStr)}
          >
            <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>{dayLabel}</Text>
            <Text style={[styles.dayNumber, isSelected && styles.selectedText, isToday && !isSelected && styles.todayText]}>
              {date.getDate()}
            </Text>
            {isSelected && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: { height: 80 },
  container: { paddingHorizontal: 8, gap: CELL_GAP, alignItems: 'flex-start' },
  dayCell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  selectedCell: { backgroundColor: colors.primary },
  todayCell: { borderWidth: 1.5, borderColor: colors.primary },
  dayLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 2 },
  dayNumber: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  selectedText: { color: '#FFFFFF' },
  todayText: { color: colors.primary },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginTop: 3 },
});
