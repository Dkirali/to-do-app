import { useEffect } from 'react';
import { runWeeklyResetIfNeeded } from '@services/weeklyResetService';

// TODO (Phase 10): Wire up full weekly reset logic
export function useWeeklyReset() {
  useEffect(() => {
    runWeeklyResetIfNeeded();
  }, []);
}
