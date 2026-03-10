import React from 'react';
import { Switch } from 'react-native';
import { colors } from '@theme/colors';

interface Props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ value, onValueChange, disabled }: Props) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#E5E5EA', true: colors.primary }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#E5E5EA"
    />
  );
}
