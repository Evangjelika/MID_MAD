import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import StatCard from '../components/StatCard';
import { getUserId, getDemoUser } from '../utils/userStorage';
import CustomButton from '../components/CustomButton';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [showError, setShowError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  
  // Get user ID
  const userId = getUserId();

  // Fetch data from Convex
  const borrowedBooks = useQuery(
    api.books.getUserBorrowedBooks,
    userId ? { userId: userId as any } : "skip"
  );

  const userProfile = useQuery(
    api.users.getUserProfile,
    userId ? { userId: userId as any } : "skip"
  );

  // Loading timeout detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (borrowedBooks === undefined || userProfile === undefined) {
        setShowError(true);
      }
    }, 5000); // Show error after 5 seconds

    return () => clearTimeout(timer);
  }, [borrowedBooks, userProfile]);

  // Use fallback data if needed
  const effectiveBorrowedBooks = useFallback ? [] : (borrowedBooks || []);
  const effectiveUserProfile = useFallback ? getDemoUser() : userProfile;

  // Count by status
  const dueSoonBooks = effectiveBorrowedBooks.filter((book: any) => book.status === 'dueSoon') || [];
  const overdueBooks = effectiveBorrowedBooks.filter((book: any) => book.status === 'late') || [];

  const quickActions = [
    {
      title: 'Library Guide',
      subtitle: 'Learn how to borrow books',
      icon: '📖',
      color: colors.primary,
      screen: 'LibraryGuide',
    },
    {
      title: 'Library Map',
      subtitle: 'Find book shelves and sections',
      icon: '🗺️',
      color: colors.secondary,
      screen: 'LibraryMap',
    },
    {
      title: 'Add Borrowed Book',
      subtitle: 'Track a new borrowed book',
      icon: '➕',
      color: colors.success,
      screen: 'AddBook',
    },
  ];

  // Loading state with error handling
  if (!useFallback && (borrowedBooks === undefined || userProfile === undefined)) {
    if (showError) {
      return (
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Connection Issue</Text>
          <Text style={styles.errorMessage}>
            Unable to connect to the backend.{'\n'}
            Make sure Convex is running.
          </Text>
          <CustomButton 
            title="Use Demo Mode" 
            onPress={() => setUseFallback(true)}
            fullWidth={false}
          />
          <TouchableOpacity 
            onPress={() => {
              setShowError(false);
              setUseFallback(false);
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {useFallback && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>📱 Demo Mode - Add books to see them here!</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello {effectiveUserProfile?.name || 'Student'} 👋
        </Text>
        <Text style={styles.welcomeText}>Welcome to your Library Companion</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <StatCard
              title="Books Borrowed"
              value={(effectiveBorrowedBooks.length || 0).toString()}
              icon="📚"
              color={colors.primary}
              onPress={() => navigation.navigate('Books' as never)}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Books Due Soon"
              value={dueSoonBooks.length.toString()}
              icon="⏰"
              color={colors.warning}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Library Points"
              value={(effectiveUserProfile?.points || 0).toString()}
              icon="⭐"
              color={colors.accent}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Overdue Books"
              value={overdueBooks.length.toString()}
              icon={overdueBooks.length > 0 ? '⚠️' : '✅'}
              color={overdueBooks.length > 0 ? colors.error : colors.success}
            />
          </View>
        </View>
      </View>

      {dueSoonBooks.length > 0 && (
        <View style={[styles.section, styles.alertSection]}>
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⏰</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Books Due Soon!</Text>
              <Text style={styles.alertText}>
                You have {dueSoonBooks.length} book{dueSoonBooks.length > 1 ? 's' : ''} due within 3 days
              </Text>
            </View>
          </View>
        </View>
      )}

      {overdueBooks.length > 0 && (
        <View style={[styles.section, styles.alertSection]}>
          <View style={[styles.alertCard, styles.errorCard]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: colors.error }]}>Overdue Books!</Text>
              <Text style={styles.alertText}>
                You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''}. Please return them ASAP.
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={() => navigation.navigate(action.screen as never)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color + '26' }]}>
              <Text style={styles.actionIconText}>{action.icon}</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  demoBanner: {
    backgroundColor: colors.accent + '33',
    padding: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  demoText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    padding: spacing.md,
    marginTop: spacing.md,
  },
  alertSection: {
    paddingVertical: 0,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  statItem: {
    width: '50%',
    padding: spacing.sm,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '1A',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning + '4D',
  },
  errorCard: {
    backgroundColor: colors.error + '1A',
    borderColor: colors.error + '4D',
  },
  alertIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  alertText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
