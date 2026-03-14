import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { colors, borderRadius, spacing } from '../constants/theme';
import { APP_NAME, APP_TAGLINE } from '../constants/constants';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Convex mutations
  const createUser = useMutation(api.users.createUser);

  const handleLogin = async () => {
    // Validation
    if (!studentId || !password) {
      Alert.alert('Error', 'Please enter your Student ID and Password');
      return;
    }

    if (isNewUser && (!fullName || !faculty)) {
      Alert.alert('Error', 'Please fill in all fields to register');
      return;
    }

    setIsLoading(true);

    try {
      if (isNewUser) {
        // Register new user
        await createUser({
          studentId: studentId,
          name: fullName,
          faculty: faculty,
        });

        Alert.alert(
          'Success',
          'Account created successfully! Welcome to LIBGO!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Main' as never),
            },
          ]
        );
      } else {
        // For existing user login (simplified - no password verification in backend)
        // In production, you'd verify the password here
        navigation.navigate('Main' as never);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message?.includes('already exists')) {
        Alert.alert(
          'Account Exists',
          'This Student ID already exists. Please login instead.',
          [
            {
              text: 'OK',
              onPress: () => setIsNewUser(false),
            },
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>📚</Text>
          </View>
        </View>

        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            {isNewUser ? 'Create Account' : 'Welcome Back!'}
          </Text>
          <Text style={styles.subtitle}>
            {isNewUser ? 'Register to get started' : 'Login to continue'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Student ID (NIM)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your student ID"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>

          {isNewUser && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Faculty</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Computer Science"
                  value={faculty}
                  onChangeText={setFaculty}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                style={styles.eyeButton}
              >
                <Text>{secureText ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            title={isNewUser ? 'Register' : 'Login'}
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
          />

          <TouchableOpacity
            onPress={() => setIsNewUser(!isNewUser)}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isNewUser
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            {isNewUser
              ? 'Create your account to start tracking your library activities'
              : 'Enter your credentials to access your account'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    backgroundColor: colors.primary + '1A',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl * 2,
  },
  formContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  eyeButton: {
    padding: spacing.md,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.lg,
  },
  switchButton: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  switchText: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default LoginScreen;
