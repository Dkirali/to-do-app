import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@theme';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
];

interface Props {
  visible: boolean;
  /** Currently selected month string e.g. "2026-03" */
  currentMonth: string;
  onSelect: (month: string) => void;
  onClose: () => void;
}

export default function MonthYearPicker({ visible, currentMonth, onSelect, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  const [selectedYear, setSelectedYear] = useState(() => parseInt(currentMonth.split('-')[0], 10));
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(() => parseInt(currentMonth.split('-')[1], 10) - 1);

  // sync picker state when currentMonth changes externally
  useEffect(() => {
    if (visible) {
      setSelectedYear(parseInt(currentMonth.split('-')[0], 10));
      setSelectedMonthIdx(parseInt(currentMonth.split('-')[1], 10) - 1);
    }
  }, [visible, currentMonth]);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(500);
      backdropAnim.setValue(0);
      setIsVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  function handleClose() {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 500, duration: 250, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setIsVisible(false);
      onClose();
    });
  }

  function handleSelect(monthIdx: number) {
    const mm = String(monthIdx + 1).padStart(2, '0');
    onSelect(`${selectedYear}-${mm}`);
    handleClose();
  }

  if (!isVisible) return null;

  return (
    <FullWindowOverlay>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Year navigation */}
          <View style={styles.yearRow}>
            <TouchableOpacity onPress={() => setSelectedYear((y) => y - 1)} style={styles.yearArrow} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.yearLabel}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => setSelectedYear((y) => y + 1)} style={styles.yearArrow} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Month grid — 3 columns × 4 rows */}
          <View style={styles.grid}>
            {MONTHS.map((name, idx) => {
              const isSelected = idx === selectedMonthIdx && selectedYear === parseInt(currentMonth.split('-')[0], 10)
                && idx === parseInt(currentMonth.split('-')[1], 10) - 1;
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.monthCell, isSelected && styles.monthCellActive]}
                  onPress={() => handleSelect(idx)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.monthText, isSelected && styles.monthTextActive]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 20,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  yearArrow: {
    padding: 8,
  },
  yearLabel: {
    ...typography.heading2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthCell: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    flexGrow: 1,
  },
  monthCellActive: {
    backgroundColor: colors.primary,
  },
  monthText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  monthTextActive: {
    color: '#FFF',
  },
});
