import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';
import BookCard from '../components/BookCard';
import { getDummyBooks, getDueSoonBooks, getOverdueBooks } from '../data/dummyBooks';

const ReminderScreen = () => {
  const borrowedBooks = getDummyBooks();
  const dueSoonBooks = getDueSoonBooks(borrowedBooks);
  const overdueBooks = getOverdueBooks(borrowedBooks);

  const getHeaderColor = () => {
    if (overdueBooks.length > 0) return colors.error;
    if (dueSoonBooks.length > 0) return colors.warning;
    return colors.success;
  };

  const getHeaderIcon = () => {
    if (overdueBooks.length > 0) return '⚠️';
    if (dueSoonBooks.length > 0) return '⏰';
    return '✅';
  };

  const getHeaderTitle = () => {
    if (overdueBooks.length > 0) return 'You have overdue books!';
    if (dueSoonBooks.length > 0) return 'Some books are due soon';
    return 'All books on time!';
  };

  const getHeaderSubtitle = () => {
    if (overdueBooks.length > 0) {
      return `${overdueBooks.length} book${overdueBooks.length === 1 ? '' : 's'} overdue`;
    }
    if (dueSoonBooks.length > 0) {
      return `${dueSoonBooks.length} book${dueSoonBooks.length === 1 ? '' : 's'} due soon`;
    }
    return 'Keep up the good work!';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
        <Text style={styles.headerIcon}>{getHeaderIcon()}</Text>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <Text style={styles.headerSubtitle}>{getHeaderSubtitle()}</Text>
      </View>

      {overdueBooks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚠️</Text>
            <Text style={[styles.sectionTitle, { color: colors.error }]}>
              Overdue Books
            </Text>
          </View>
          {overdueBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </View>
      )}

      {dueSoonBooks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⏰</Text>
            <Text style={[styles.sectionTitle, { color: colors.warning }]}>
              Due Soon
            </Text>
          </View>
          {dueSoonBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </View>
      )}

      {overdueBooks.length === 0 && dueSoonBooks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>No reminders</Text>
          <Text style={styles.emptySubtitle}>All your books are on track!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ReminderScreen;
