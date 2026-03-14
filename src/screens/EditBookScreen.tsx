import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { colors, borderRadius, spacing } from '../constants/theme';
import CustomButton from '../components/CustomButton';

type EditBookRouteParams = {
  EditBook: {
    bookId: string;
    title: string;
    author: string;
    borrowDate: number;
    returnDate: number;
  };
};

const EditBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<EditBookRouteParams, 'EditBook'>>();
  const { bookId, title: initialTitle, author: initialAuthor, borrowDate: initialBorrowDate, returnDate: initialReturnDate } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [borrowDate, setBorrowDate] = useState(new Date(initialBorrowDate));
  const [returnDate, setReturnDate] = useState(new Date(initialReturnDate));
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Convex mutation
  const updateBorrowedBook = useMutation(api.books.updateBorrowedBook);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (returnDate <= borrowDate) {
      Alert.alert('Error', 'Return date must be after borrow date');
      return;
    }

    setIsLoading(true);

    try {
      // Update book in Convex database
      await updateBorrowedBook({
        bookId: bookId as any,
        title: title.trim(),
        author: author.trim(),
        borrowDate: borrowDate.getTime(),
        returnDate: returnDate.getTime(),
      });

      Alert.alert(
        'Success! ✓',
        `"${title}" has been updated successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating book:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update book. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>✏️</Text>
        <Text style={styles.infoText}>
          Update your book details below
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Clean Code"
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Robert C. Martin"
            value={author}
            onChangeText={setAuthor}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Borrow Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => !isLoading && setShowBorrowPicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.dateText}>📅 {formatDate(borrowDate)}</Text>
          </TouchableOpacity>
          {showBorrowPicker && (
            <DateTimePicker
              value={borrowDate}
              mode="date"
              maximumDate={new Date()}
              onChange={(event, date) => {
                setShowBorrowPicker(Platform.OS === 'ios');
                if (date) setBorrowDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Return Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => !isLoading && setShowReturnPicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.dateText}>📅 {formatDate(returnDate)}</Text>
          </TouchableOpacity>
          {showReturnPicker && (
            <DateTimePicker
              value={returnDate}
              mode="date"
              minimumDate={borrowDate}
              onChange={(event, date) => {
                setShowReturnPicker(Platform.OS === 'ios');
                if (date) setReturnDate(date);
              }}
            />
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Updating book...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton 
              title="Save Changes" 
              onPress={handleSave} 
              fullWidth 
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '1A',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '4D',
    marginBottom: spacing.lg,
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dateInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default EditBookScreen;
