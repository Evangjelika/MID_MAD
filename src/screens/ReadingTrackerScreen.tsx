import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, borderRadius, spacing } from '../constants/theme';
import { POINTS } from '../constants/constants';
import ProgressCard from '../components/ProgressCard';
import { getDummyBooks } from '../data/dummyBooks';
import { Book } from '../types/Book';
import CustomButton from '../components/CustomButton';

const ReadingTrackerScreen = () => {
  const [books] = useState(getDummyBooks());
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleUpdatePress = (book: Book) => {
    setSelectedBook(book);
    setProgress(book.readingProgress);
    setModalVisible(true);
  };

  const handleSaveProgress = () => {
    if (selectedBook) {
      selectedBook.readingProgress = progress;
      Alert.alert(
        'Success',
        `Progress updated! +${POINTS.TRACK_READING} points earned`
      );
      setModalVisible(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📖</Text>
          <Text style={styles.headerTitle}>Keep Reading!</Text>
          <Text style={styles.headerSubtitle}>Track your progress and earn points</Text>
        </View>

        <ScrollView style={styles.booksList}>
          {books.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>No books to track</Text>
            </View>
          ) : (
            books.map((book) => (
              <ProgressCard
                key={book.id}
                book={book}
                onUpdateProgress={() => handleUpdatePress(book)}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>⭐</Text>
          <Text style={styles.infoText}>
            Earn {POINTS.TRACK_READING} points for each progress update!
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Progress</Text>
            {selectedBook && (
              <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
            )}
            
            <Text style={styles.progressText}>{progress}%</Text>
            
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={progress}
              onValueChange={setProgress}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProgress}
              >
                <Text style={styles.saveButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  booksList: {
    flex: 1,
    paddingTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.accent + '1A',
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.accent + '4D',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalBookTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  progressText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});

export default ReadingTrackerScreen;
