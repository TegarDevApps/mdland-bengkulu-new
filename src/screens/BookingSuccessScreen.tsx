import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import AnimatedButton from '../components/common/AnimatedButton';

interface BookingSuccessScreenProps {
  onGoHome: () => void;
  onViewBookings: () => void;
}

const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({
  onGoHome,
  onViewBookings,
}) => {
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const confetti1 = useSharedValue(0);
  const confetti2 = useSharedValue(0);

  useEffect(() => {
    // Ring animation
    ringScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 100 }));

    // Checkmark
    checkOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
    checkScale.value = withDelay(500, withSequence(
      withSpring(1.3, { damping: 6, stiffness: 120 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    ));

    // Confetti particles
    confetti1.value = withDelay(700, withSpring(1, { damping: 12 }));
    confetti2.value = withDelay(900, withSpring(1, { damping: 12 }));
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringScale.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const confetti1Style = useAnimatedStyle(() => ({
    opacity: confetti1.value,
    transform: [
      { translateY: (1 - confetti1.value) * 20 },
      { scale: confetti1.value },
    ],
  }));

  const confetti2Style = useAnimatedStyle(() => ({
    opacity: confetti2.value,
    transform: [
      { translateY: (1 - confetti2.value) * 20 },
      { scale: confetti2.value },
    ],
  }));

  return (
    <LinearGradient
      colors={['#F0F8FF', '#E8F4FD', COLORS.white]}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Animated Check */}
        <View style={styles.checkContainer}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.checkCircle, checkStyle]}>
            <LinearGradient
              colors={COLORS.gradientOcean as any}
              style={styles.checkGradient}
            >
              <Ionicons name="checkmark" size={48} color={COLORS.white} />
            </LinearGradient>
          </Animated.View>

          {/* Confetti dots */}
          <Animated.View style={[styles.confettiDot, { top: -10, left: 20 }, confetti1Style]}>
            <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
          </Animated.View>
          <Animated.View style={[styles.confettiDot, { top: 10, right: 10 }, confetti2Style]}>
            <View style={[styles.dot, { backgroundColor: COLORS.teal }]} />
          </Animated.View>
          <Animated.View style={[styles.confettiDot, { bottom: 20, left: 0 }, confetti2Style]}>
            <View style={[styles.dot, { backgroundColor: COLORS.accentWarm }]} />
          </Animated.View>
          <Animated.View style={[styles.confettiDot, { bottom: 0, right: 30 }, confetti1Style]}>
            <View style={[styles.dot, { backgroundColor: COLORS.coral }]} />
          </Animated.View>
        </View>

        {/* Text */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.textSection}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your luxury escape is booked. We've sent a confirmation to your email with all the details.
          </Text>
        </Animated.View>

        {/* Booking ID */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.bookingIdCard}>
          <Text style={styles.bookingIdLabel}>Booking Reference</Text>
          <Text style={styles.bookingIdValue}>MDL-2026-{Math.random().toString(36).substr(2, 6).toUpperCase()}</Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(1200)} style={styles.actions}>
          <AnimatedButton
            title="View My Bookings"
            onPress={onViewBookings}
            variant="gradient"
            size="lg"
            fullWidth
          />
          <AnimatedButton
            title="Back to Home"
            onPress={onGoHome}
            variant="ghost"
            size="md"
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl },

  // Check animation
  checkContainer: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xxxl },
  ring: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 3, borderColor: COLORS.primary + '20',
  },
  checkCircle: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden' },
  checkGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  confettiDot: { position: 'absolute' },
  dot: { width: 10, height: 10, borderRadius: 5 },

  // Text
  textSection: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { ...TYPOGRAPHY.h1, color: COLORS.gray800, textAlign: 'center', marginBottom: SPACING.md },
  subtitle: {
    ...TYPOGRAPHY.body, color: COLORS.gray500, textAlign: 'center',
    lineHeight: 24, maxWidth: 300,
  },

  // Booking ID
  bookingIdCard: {
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.gray100, borderStyle: 'dashed',
    marginBottom: SPACING.xxxl, width: '100%',
  },
  bookingIdLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginBottom: 4 },
  bookingIdValue: { ...TYPOGRAPHY.h3, color: COLORS.primary, letterSpacing: 2 },

  // Actions
  actions: { width: '100%', gap: SPACING.md, alignItems: 'center' },
});

export default BookingSuccessScreen;
