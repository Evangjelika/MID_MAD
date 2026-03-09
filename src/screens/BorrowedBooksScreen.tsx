import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, borderRadius, spacing } from '../constants/theme';
import BookCard from '../components/BookCard';
import { getDummyBooks, getDueSoonBooks, getOverdueBooks, getNormalBooks } from '../data/dummyBooks';

const BorrowedBooksScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const borrowedBooks = getDummyBooks();

  const getFilteredBooks = () => {
    switch (selectedFilter) {
      case 'Due Soon':
        return getDueSoonBooks(borrowedBooks);
      case 'Overdue':
        return getOverdueBooks(borrowedBooks);
      case 'Normal':
        return getNormalBooks(borrowedBooks);
      default:
        return borrowedBooks;
    }
  };

  const filteredBooks = getFilteredBooks();
  const dueSoonCount = getDueSoonBooks(borrowedBooks).length;
  const overdueCount = getOverdueBooks(borrowedBooks).length;

  const filters = ['All', 'Normal', 'Due Soon', 'Overdue'];

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={[styles.statChip, { backgroundColor: colors.primary + '1A' }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {borrowedBooks.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.warning + '1A' }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {dueSoonCount}
          </Text>
          <Text style={styles.statLabel}>Due Soon</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colors.error + '1A' }]}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {overdueCount}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.booksList}>
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        ) : (
          filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBook' as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  statChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary + '33',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  booksList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.surface,
    marginRight: spacing.sm,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});

export default BorrowedBooksScreen;
