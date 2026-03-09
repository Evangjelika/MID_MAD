import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';
import { TIMER, POINTS } from '../constants/constants';
import CustomButton from '../components/CustomButton';

const StudyTimerScreen = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(TIMER.FOCUS_DURATION * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (isFocusMode) {
      setCompletedSessions((prev) => prev + 1);
      Alert.alert(
        'Great Job! 🎉',
        `You completed a focus session!\n+${POINTS.COMPLETE_TIMER} points earned`,
        [{ text: 'Continue' }]
      );
    }

    setIsFocusMode(!isFocusMode);
    setRemainingSeconds(
      !isFocusMode ? TIMER.FOCUS_DURATION * 60 : TIMER.BREAK_DURATION * 60
    );
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(
      isFocusMode ? TIMER.FOCUS_DURATION * 60 : TIMER.BREAK_DURATION * 60
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalSeconds = isFocusMode
      ? TIMER.FOCUS_DURATION * 60
      : TIMER.BREAK_DURATION * 60;
    return 1 - remainingSeconds / totalSeconds;
  };

  const modeColor = isFocusMode ? colors.primary : colors.success;

  return (
    <View style={styles.container}>
      <View style={[styles.modeIndicator, { backgroundColor: modeColor + '1A' }]}>
        <Text style={styles.modeIcon}>{isFocusMode ? '📚' : '☕'}</Text>
        <Text style={[styles.modeText, { color: modeColor }]}>
          {isFocusMode ? 'Focus Time' : 'Break Time'}
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.circleContainer}>
          <View
            style={[
              styles.progressCircle,
              {
                borderColor: modeColor,
                transform: [{ rotate: `${getProgress() * 360}deg` }],
              },
            ]}
          />
          <View style={styles.timerContent}>
            <Text style={[styles.timerText, { color: modeColor }]}>
              {formatTime(remainingSeconds)}
            </Text>
            <Text style={styles.statusText}>
              {isRunning ? 'In Progress' : 'Ready'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{completedSessions}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>
            {completedSessions * POINTS.COMPLETE_TIMER}
          </Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.resetButton}>
          <CustomButton
            title="Reset"
            onPress={resetTimer}
            backgroundColor={colors.border}
            textColor={colors.textPrimary}
          />
        </View>
        <View style={styles.mainButton}>
          <CustomButton
            title={isRunning ? 'Pause' : 'Start'}
            onPress={isRunning ? pauseTimer : startTimer}
            backgroundColor={modeColor}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  modeIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  modeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 16,
    borderColor: colors.border,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  resetButton: {
    flex: 1,
  },
  mainButton: {
    flex: 2,
  },
});

export default StudyTimerScreen;
