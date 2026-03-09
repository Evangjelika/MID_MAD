import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';
import { LIBRARY_GUIDE_STEPS, RETURN_INSTRUCTIONS } from '../constants/constants';

const LibraryGuideScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.headerIcon}>📚</Text>
        <Text style={styles.headerTitle}>How to Borrow Books</Text>
        <Text style={styles.headerSubtitle}>
          Follow these steps to borrow books from the library
        </Text>
      </View>

      {LIBRARY_GUIDE_STEPS.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.number}</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
      ))}

      <View style={styles.returnCard}>
        <View style={styles.returnHeader}>
          <Text style={styles.returnIcon}>↩️</Text>
          <Text style={styles.returnTitle}>Returning Books</Text>
        </View>
        <Text style={styles.returnText}>{RETURN_INSTRUCTIONS}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  headerCard: {
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },
  stepCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  returnCard: {
    backgroundColor: colors.success + '1A',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.success + '4D',
    marginVertical: spacing.lg,
  },
  returnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  returnIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  returnTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.success,
  },
  returnText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});

export default LibraryGuideScreen;
