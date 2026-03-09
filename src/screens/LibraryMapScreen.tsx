import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../constants/theme';
import { LIBRARY_SECTIONS } from '../constants/constants';

const LibraryMapScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.headerIcon}>🗺️</Text>
        <Text style={styles.headerTitle}>Library Sections</Text>
        <Text style={styles.headerSubtitle}>Find your books by shelf category</Text>
      </View>

      {LIBRARY_SECTIONS.map((section, index) => (
        <TouchableOpacity key={index} style={styles.sectionCard} activeOpacity={0.7}>
          <View style={styles.sectionIcon}>
            <Text style={styles.sectionEmoji}>{section.icon}</Text>
          </View>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionName}>{section.name}</Text>
            <Text style={styles.sectionCategory}>{section.category}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Use the Call Number from OPAC to find the exact location of your book
        </Text>
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
    backgroundColor: colors.secondary + '1A',
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
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  sectionIcon: {
    width: 64,
    height: 64,
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionEmoji: {
    fontSize: 32,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionCategory: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  arrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.accent + '1A',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.accent + '4D',
    marginVertical: spacing.md,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default LibraryMapScreen;
