import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { colors, borderRadius, spacing } from '../constants/theme';
import BookCard from '../components/BookCard';
import { getUserId } from '../utils/userStorage';

const BorrowedBooksScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Get user ID
  const userId = getUserId();

  // Fetch books from Convex
  const borrowedBooks = useQuery(
    api.books.getUserBorrowedBooks,
    userId ? { userId: userId as any } : "skip"
  );

  // Delete mutation
  const deleteBorrowedBook = useMutation(api.books.deleteBorrowedBook);

  // Handle edit book
  const handleEditBook = (book: any) => {
    (navigation as any).navigate('EditBook', {
      bookId: book._id,
      title: book.title,
      author: book.author || '',
      borrowDate: book.borrowDate,
      returnDate: book.returnDate,
    });
  };

  // Handle delete book
  const handleDeleteBook = (book: any) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBorrowedBook({ bookId: book._id });
              Alert.alert('Success', 'Book deleted successfully');
            } catch (error: any) {
              console.error('Error deleting book:', error);
              Alert.alert('Error', 'Failed to delete book. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Count books by status
  const countByStatus = (status: string) => {
    if (!borrowedBooks) return 0;
    return borrowedBooks.filter((book: any) => book.status === status).length;
  };

  const dueSoonCount = countByStatus('dueSoon');
  const overdueCount = countByStatus('late');
  const normalCount = countByStatus('normal');

  const getFilteredBooks = () => {
    if (!borrowedBooks) return [];
    
    switch (selectedFilter) {
      case 'Due Soon':
        return borrowedBooks.filter((book: any) => book.status === 'dueSoon');
      case 'Overdue':
        return borrowedBooks.filter((book: any) => book.status === 'late');
      case 'Normal':
        return borrowedBooks.filter((book: any) => book.status === 'normal');
      default:
        return borrowedBooks;
    }
  };

  const filteredBooks = getFilteredBooks();
  const filters = ['All', 'Normal', 'Due Soon', 'Overdue'];

  const onRefresh = () => {
    setRefreshing(true);
    // Convex auto-refreshes, just simulate refresh UI
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Loading state
  if (borrowedBooks === undefined) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

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

      <ScrollView 
        style={styles.booksList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'All' 
                ? 'No borrowed books yet'
                : `No ${selectedFilter.toLowerCase()} books`}
            </Text>
            <Text style={styles.emptyHint}>
              Tap the "Add Book" button to add your first book
            </Text>
          </View>
        ) : (
          filteredBooks.map((book: any) => (
            <BookCard 
              key={book._id} 
              book={{
                id: book._id,
                title: book.title,
                author: book.author || 'Unknown Author',
                borrowDate: new Date(book.borrowDate),
                returnDate: new Date(book.returnDate),
                readingProgress: 0, // TODO: Link with reading progress
              }}
              onEdit={() => handleEditBook(book)}
              onDelete={() => handleDeleteBook(book)}
              showActions={true}
            />
          ))
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
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
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.7,
    textAlign: 'center',
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
