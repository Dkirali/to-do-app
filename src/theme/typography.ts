import type { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 39,
    letterSpacing: 0,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 31,
    letterSpacing: 0,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: 0,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionSmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  micro: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
  },
};
