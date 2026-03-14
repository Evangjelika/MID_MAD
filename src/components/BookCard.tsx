import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Book, getBookStatus, getDaysUntilDue, BookStatus } from '../types/Book';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onPress, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
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
    <View style={styles.card}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cardContent}
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

      {showActions && (onEdit || onDelete) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✏️</Text>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.small,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
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
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  deleteButton: {
    // No special styles for delete button
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteText: {
    color: colors.error,
  },
});

export default BookCard;
