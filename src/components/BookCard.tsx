import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Book, getBookStatus, getDaysUntilDue, BookStatus } from '../types/Book';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const status = getBookStatus(book);
  const daysUntilDue = getDaysUntilDue(book);

  const getStatusColor = () => {
    switch (status) {
      case BookStatus.NORMAL:
        return colors.success;
      case BookStatus.DUE_SOON:
        return colors.warning;
      case BookStatus.OVERDUE:
        return colors.error;
    }
  };

  const getStatusText = () => {
    const absDays = Math.abs(daysUntilDue);
    if (status === BookStatus.OVERDUE) {
      return `Late by ${absDays} day${absDays === 1 ? '' : 's'}`;
    } else if (status === BookStatus.DUE_SOON) {
      return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    } else {
      return `Due in ${daysUntilDue} days`;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.bookIcon}>📚</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      </View>

      <View style={styles.dates}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Borrowed</Text>
          <Text style={styles.dateValue}>{formatDate(book.borrowDate)}</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Return</Text>
          <Text style={styles.dateValue}>{formatDate(book.returnDate)}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '26' }]}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bookIcon: {
    fontSize: 28,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dates: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default BookCard;
