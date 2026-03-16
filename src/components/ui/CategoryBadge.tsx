import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Category } from '@app-types';
import { categoryColor } from '@theme';

interface Props {
  category: Category;
}

export default function CategoryBadge({ category }: Props) {
  const color = categoryColor(category);
  return (
    <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{category.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
