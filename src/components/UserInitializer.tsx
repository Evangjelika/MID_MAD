/**
 * User Initializer Component
 * 
 * Initializes the demo user on app start by calling getOrCreateDemoUser
 * and storing the real Convex ID for use throughout the app
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { setUserId } from '../utils/userStorage';
import { colors, spacing } from '../constants/theme';

interface UserInitializerProps {
  children: React.ReactNode;
}

const UserInitializer: React.FC<UserInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getOrCreateDemoUser = useMutation(api.users.getOrCreateDemoUser);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Get or create demo user and get real Convex ID
        const userId = await getOrCreateDemoUser();
        
        // Store the real Convex ID
        setUserId(userId);
        
        // Mark as initialized
        setIsInitialized(true);
      } catch (err: any) {
        console.error('Failed to initialize user:', err);
        setError(err.message || 'Failed to connect to backend');
        // Still mark as initialized to show the app with error handling
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Initializing app...</Text>
      </View>
    );
  }

  if (error) {
    // Still render children but with error state
    // The screens will handle the error with their own fallback UI
    return <>{children}</>;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default UserInitializer;
