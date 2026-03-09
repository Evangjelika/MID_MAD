import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './src/constants/theme';
import LoginScreen from './src/screens/LoginScreen';
import MainNavigation from './src/navigation/MainNavigation';
import LibraryGuideScreen from './src/screens/LibraryGuideScreen';
import LibraryMapScreen from './src/screens/LibraryMapScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import ReadingTrackerScreen from './src/screens/ReadingTrackerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainNavigation} />
          <Stack.Screen 
            name="LibraryGuide" 
            component={LibraryGuideScreen}
            options={{ headerShown: true, title: 'Library Guide' }}
          />
          <Stack.Screen 
            name="LibraryMap" 
            component={LibraryMapScreen}
            options={{ headerShown: true, title: 'Library Map' }}
          />
          <Stack.Screen 
            name="AddBook" 
            component={AddBookScreen}
            options={{ headerShown: true, title: 'Add Borrowed Book' }}
          />
          <Stack.Screen 
            name="Reminder" 
            component={ReminderScreen}
            options={{ headerShown: true, title: 'Reminders' }}
          />
          <Stack.Screen 
            name="ReadingTracker" 
            component={ReadingTrackerScreen}
            options={{ headerShown: true, title: 'Reading Progress' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
