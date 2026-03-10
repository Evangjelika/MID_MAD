import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import MainNavigation from './src/navigation/MainNavigation';
import LoginScreen from './src/screens/LoginScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import LibraryGuideScreen from './src/screens/LibraryGuideScreen';
import LibraryMapScreen from './src/screens/LibraryMapScreen';
import ReadingTrackerScreen from './src/screens/ReadingTrackerScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import { colors } from './src/constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="AddBook"
          component={AddBookScreen}
          options={{ title: 'Add Borrowed Book' }}
        />
        <Stack.Screen
          name="LibraryGuide"
          component={LibraryGuideScreen}
          options={{ title: 'Library Guide' }}
        />
        <Stack.Screen
          name="LibraryMap"
          component={LibraryMapScreen}
          options={{ title: 'Library Map' }}
        />
        <Stack.Screen
          name="ReadingTracker"
          component={ReadingTrackerScreen}
          options={{ title: 'Reading Tracker' }}
        />
        <Stack.Screen
          name="Reminder"
          component={ReminderScreen}
          options={{ title: 'Set Reminder' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
