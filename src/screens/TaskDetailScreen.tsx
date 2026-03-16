import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme';

// TODO: Full task detail / edit form (planned for a future phase)
export default function TaskDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task Detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { fontSize: 22, fontWeight: '600', color: colors.textPrimary },
});
