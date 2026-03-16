import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

export function useMonthNavigation(onDateChange: (date: string) => void) {
  const [displayMonth, setDisplayMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [pickerVisible, setPickerVisible] = useState(false);

  const monthLabel = format(new Date(`${displayMonth}-01T12:00:00`), 'MMMM yyyy');

  function changeMonth(direction: 1 | -1) {
    const base = new Date(`${displayMonth}-01T12:00:00`);
    const newDate = direction === 1 ? addMonths(base, 1) : subMonths(base, 1);
    const newMonth = format(newDate, 'yyyy-MM');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayMonth = format(new Date(), 'yyyy-MM');
    setDisplayMonth(newMonth);
    if (newMonth === todayMonth) {
      onDateChange(todayStr);
    } else {
      onDateChange(format(newDate, 'yyyy-MM-01'));
    }
  }

  function handlePickerSelect(month: string) {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayMonth = format(new Date(), 'yyyy-MM');
    setDisplayMonth(month);
    if (month === todayMonth) {
      onDateChange(todayStr);
    } else {
      onDateChange(format(new Date(`${month}-01T12:00:00`), 'yyyy-MM-01'));
    }
  }

  return {
    displayMonth,
    setDisplayMonth,
    pickerVisible,
    setPickerVisible,
    monthLabel,
    changeMonth,
    handlePickerSelect,
  };
}
