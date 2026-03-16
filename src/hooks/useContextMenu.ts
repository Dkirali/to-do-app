import { Platform, ActionSheetIOS, Alert } from 'react-native';
import type { Task } from '@app-types';

export function useContextMenu(
  task: Task,
  onEdit: (task: Task) => void,
  onDelete: (id: string) => void
) {
  function show() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Edit', 'Delete'], destructiveButtonIndex: 2, cancelButtonIndex: 0 },
        (i) => {
          if (i === 1) onEdit(task);
          if (i === 2) onDelete(task.id);
        }
      );
    } else {
      Alert.alert('Options', '', [
        { text: 'Edit', onPress: () => onEdit(task) },
        { text: 'Delete', onPress: () => onDelete(task.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  return { show };
}
