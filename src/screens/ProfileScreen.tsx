import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import { getDummyBooks } from '../data/dummyBooks';
import CustomButton from '../components/CustomButton';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const borrowedBooks = getDummyBooks();

  const userData = {
    name: 'John Doe',
    studentId: '123456789',
    faculty: 'Computer Science',
    libraryPoints: 45,
    booksReturned: 12,
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }),
      },
    ]);
  };

  const menuItems = [
    {
      icon: '📖',
      title: 'Reading Progress',
      subtitle: 'Track your reading journey',
      onPress: () => navigation.navigate('ReadingTracker' as never),
    },
    {
      icon: '🔔',
      title: 'Reminders',
      subtitle: 'View due dates and alerts',
      onPress: () => navigation.navigate('Reminder' as never),
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      onPress: () => Alert.alert('Help', 'Contact library support for assistance'),
    },
    {
      icon: 'ℹ️',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () =>
        Alert.alert(
          'LibGo v1.0.0',
          'Smart Library Companion\n\nDeveloped for University Mobile App Development Project'
        ),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <View style={styles.studentIdBadge}>
          <Text style={styles.studentIdText}>{userData.studentId}</Text>
        </View>
        <Text style={styles.faculty}>{userData.faculty}</Text>
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsIcon}>⭐</Text>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsLabel}>Library Points</Text>
          <Text style={styles.pointsValue}>{userData.libraryPoints}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {borrowedBooks.length}
            </Text>
            <Text style={styles.statLabel}>Books Borrowed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {userData.booksReturned}
            </Text>
            <Text style={styles.statLabel}>Books Returned</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          backgroundColor={colors.error}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarIcon: {
    fontSize: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  studentIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  studentIdText: {
    color: colors.surface,
    fontWeight: '600',
  },
  faculty: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pointsCard: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  pointsIcon: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.surface,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  logoutContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});

export default ProfileScreen;
