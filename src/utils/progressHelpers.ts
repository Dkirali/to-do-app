import type { Goal, Task } from '@app-types/index';

export function getCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getGoalProgress(goal: Goal): number {
  if (goal.targetValue === 0) return 0;
  return Math.min(goal.currentValue / goal.targetValue, 1);
}

export function getGoalProgressLabel(goal: Goal): string {
  const pct = Math.round(getGoalProgress(goal) * 100);
  if (pct >= 100) return 'Complete!';
  if (pct >= 75) return 'Almost there!';
  if (pct >= 50) return `Keep it up! ${goal.targetValue - goal.currentValue} more to go.`;
  return `${goal.targetValue - goal.currentValue} more to go.`;
}

export function getTaskCountByCategory(tasks: Task[]): Record<string, number> {
  return tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});
}
