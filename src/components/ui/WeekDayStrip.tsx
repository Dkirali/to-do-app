import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { colors } from '@theme/colors';

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAYS_TO_SHOW = 21; // 3 weeks centered on today

interface Props {
  selectedDate: string;   // 'yyyy-MM-dd'
  onSelectDate: (date: string) => void;
}

export default function WeekDayStrip({ selectedDate, onSelectDate }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const today = new Date();

  // Build array of dates starting 7 days before today
  const startDate = addDays(today, -7);
  const dates = Array.from({ length: DAYS_TO_SHOW }, (_, i) => addDays(startDate, i));

  useEffect(() => {
    // Scroll so today is roughly visible (index 7 = today)
    setTimeout(() => scrollRef.current?.scrollTo({ x: 7 * 56, animated: false }), 0);
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
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
            style={[styles.dayCell, isSelected && styles.selectedCell]}
            onPress={() => onSelectDate(dateStr)}
          >
            <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>{dayLabel}</Text>
            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>{date.getDate()}</Text>
            {isSelected && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, gap: 4 },
  dayCell: {
    width: 50,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  selectedCell: { backgroundColor: colors.primary },
  dayLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 2 },
  dayNumber: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  selectedText: { color: '#FFFFFF' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginTop: 3 },
});
