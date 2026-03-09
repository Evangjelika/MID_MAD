import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import BorrowedBooksScreen from '../screens/BorrowedBooksScreen';
import StudyTimerScreen from '../screens/StudyTimerScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'LibGo',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>{focused ? '🏠' : '🏘️'}</Text>,
        }}
      />
      <Tab.Screen
        name="Books"
        component={BorrowedBooksScreen}
        options={{
          title: 'Borrowed Books',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>{focused ? '📚' : '📖'}</Text>,
        }}
      />
      <Tab.Screen
        name="Focus"
        component={StudyTimerScreen}
        options={{
          title: 'Study Timer',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>{focused ? '⏰' : '⏱️'}</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>{focused ? '👤' : '👥'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;
