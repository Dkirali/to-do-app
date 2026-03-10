import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TasksScreen from '@screens/TasksScreen';
import GoalsScreen from '@screens/GoalsScreen';
import RewardsScreen from '@screens/RewardsScreen';
import StatsScreen from '@screens/StatsScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { colors } from '@theme/colors';
import type { RootTabParamList } from '@app-types/index';

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof RootTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  Tasks: { active: 'checkmark-circle', inactive: 'checkmark-circle-outline' },
  Goals: { active: 'flag', inactive: 'flag-outline' },
  Rewards: { active: 'gift', inactive: 'gift-outline' },
  Stats: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof RootTabParamList];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
