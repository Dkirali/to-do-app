import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Category } from '@app-types/index';
import { categoryColor } from '@theme/colors';

interface Props {
  category: Category;
}

export default function CategoryBadge({ category }: Props) {
  const color = categoryColor(category);
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.label, { color }]}>{category.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
