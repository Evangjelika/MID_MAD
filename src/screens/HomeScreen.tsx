import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import StatCard from '../components/StatCard';
import { getDummyBooks, getDueSoonBooks } from '../data/dummyBooks';

const HomeScreen = () => {
  const navigation = useNavigation();
  const borrowedBooks = getDummyBooks();
  const dueSoonBooks = getDueSoonBooks(borrowedBooks);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Student 👋</Text>
        <Text style={styles.welcomeText}>Welcome to your Library Companion</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <StatCard
              title="Books Borrowed"
              value={borrowedBooks.length.toString()}
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
              value="45"
              icon="⭐"
              color={colors.accent}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Books Returned"
              value="12"
              icon="✅"
              color={colors.success}
            />
          </View>
        </View>
      </View>

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
