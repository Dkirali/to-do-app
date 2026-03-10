import type { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0,
  },
  heading3: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};
