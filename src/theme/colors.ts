export const colors = {
  // Primary
  primary: '#007AFF',

  // Backgrounds
  background: '#F2F3F7',
  surface: '#FFFFFF',

  // Category colors
  gym: '#FF9500',
  work: '#AF52DE',
  study: '#32ADE6',
  general: '#8E8E93',
  health: '#FF9500',

  // Goal accent colors
  goalBlue: '#007AFF',
  goalOrange: '#FF9500',
  goalCyan: '#32ADE6',

  // Text
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textMuted: '#C7C7CC',

  // Status
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',

  // Rewards
  rewardGold: '#FFD60A',
  rewardLocked1: '#E8D5C4',
  rewardLocked2: '#F4BBBB',

  // Stats chart
  chartPrimary: '#007AFF',
  chartSecondary: '#C7C7CC',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarActive: '#007AFF',
  tabBarInactive: '#8E8E93',

  // Swipe actions
  swipeEdit: '#007AFF',
  swipeDelete: '#FF3B30',
  swipeCompleteBg: '#E8FAF0',
  swipeActionBg: '#F2F3F7',

  // Form / UI
  border: '#E5E5EA',
  inputBackground: '#F8F8F8',
  completedTaskBg: '#E8F8EE',
  primaryTint: '#E8F1FF',

  // Misc
  notificationBadge: '#FF3B30',
} as const;

export type ColorKey = keyof typeof colors;

/** Returns the category accent color */
export function categoryColor(category: string): string {
  switch (category) {
    case 'gym':    return colors.gym;
    case 'work':   return colors.work;
    case 'study':  return colors.study;
    case 'health': return colors.health;
    default:       return colors.general;
  }
}
