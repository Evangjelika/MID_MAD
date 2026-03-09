import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Book } from '../types/Book';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';

interface ProgressCardProps {
  book: Book;
  onUpdateProgress?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ book, onUpdateProgress }) => {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return colors.error;
    if (progress < 70) return colors.warning;
    return colors.success;
  };

  const progressColor = getProgressColor(book.readingProgress);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{book.readingProgress}%</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${book.readingProgress}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>

      {onUpdateProgress && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={onUpdateProgress}
          activeOpacity={0.7}
        >
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>
      )}
    </View>
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
  bookInfo: {
    flex: 1,
    marginRight: spacing.md,
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
  percentageContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  updateButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  updateButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ProgressCard;
