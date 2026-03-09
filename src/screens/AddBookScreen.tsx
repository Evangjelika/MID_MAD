import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, borderRadius, spacing } from '../constants/theme';
import { POINTS } from '../constants/constants';
import CustomButton from '../components/CustomButton';

const AddBookScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  );
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = () => {
    if (!title || !author) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Success',
      `Book added! +${POINTS.ADD_BOOK} points earned`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>⭐</Text>
        <Text style={styles.infoText}>
          Earn {POINTS.ADD_BOOK} points by adding a borrowed book!
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the book title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the author name"
            value={author}
            onChangeText={setAuthor}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Borrow Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowBorrowPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(borrowDate)}</Text>
          </TouchableOpacity>
          {showBorrowPicker && (
            <DateTimePicker
              value={borrowDate}
              mode="date"
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
            onPress={() => setShowReturnPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
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

        <CustomButton title="Add Book" onPress={handleSave} fullWidth />
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
    backgroundColor: colors.accent + '1A',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.accent + '4D',
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
});

export default AddBookScreen;
