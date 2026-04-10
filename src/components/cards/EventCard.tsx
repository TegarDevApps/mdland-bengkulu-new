import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY, SCREEN_WIDTH } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EventCardProps {
  event: Event;
  onPress: () => void;
  variant?: 'full' | 'horizontal';
  index?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  variant = 'full',
  index = 0,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (variant === 'horizontal') {
    return (
      <AnimatedPressable
        entering={FadeInDown.delay(index * 80).springify()}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.horizontalCard, animatedStyle, SHADOWS.small]}
      >
        <ImageBackground
          source={typeof event.image === 'number' ? event.image : { uri: event.image }}
          style={styles.horizontalImage}
          imageStyle={{ borderRadius: RADIUS.lg }}
        >
          <View style={styles.dateBadgeSmall}>
            <Text style={styles.dateBadgeDay}>{new Date(event.date).getDate()}</Text>
            <Text style={styles.dateBadgeMonth}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.horizontalContent}>
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{event.genre}</Text>
          </View>
          <Text style={styles.horizontalTitle} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.horizontalTime}>
            <Ionicons name="time-outline" size={12} color={COLORS.gray500} /> {event.time}
          </Text>
          <View style={styles.horizontalFooter}>
            <Text style={styles.horizontalPrice}>Rp {event.price.toLocaleString('id-ID')}</Text>
            <View style={styles.attendingBadge}>
              <Ionicons name="people" size={12} color={COLORS.primary} />
              <Text style={styles.attendingText}>{event.attending}</Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 100).springify()}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.fullCard, animatedStyle, SHADOWS.medium]}
    >
      <ImageBackground source={typeof event.image === 'number' ? event.image : { uri: event.image }} style={styles.fullImage} imageStyle={{ borderRadius: RADIUS.xxl }}>
        <LinearGradient colors={COLORS.gradientDarkReverse as any} style={styles.fullGradient}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDayLg}>{new Date(event.date).getDate()}</Text>
            <Text style={styles.dateBadgeMonthLg}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </Text>
          </View>
          <View style={styles.fullInfo}>
            <View style={styles.genreBadgeFull}>
              <Ionicons name="musical-notes" size={12} color={COLORS.white} />
              <Text style={styles.genreTextFull}>{event.genre}</Text>
            </View>
            <Text style={styles.fullTitle}>{event.title}</Text>
            {event.artist && (
              <Text style={styles.fullArtist}>ft. {event.artist}</Text>
            )}
            <View style={styles.fullFooter}>
              <View style={styles.fullDetail}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray300} />
                <Text style={styles.fullDetailText}>{event.time}</Text>
              </View>
              <Text style={styles.fullPrice}>Rp {event.price.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  // Full Card
  fullCard: { marginBottom: SPACING.xl, borderRadius: RADIUS.xxl },
  fullImage: { width: '100%', height: 280 },
  fullGradient: { flex: 1, borderRadius: RADIUS.xxl, justifyContent: 'space-between', padding: SPACING.xl },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    minWidth: 56,
  },
  dateBadgeDayLg: { ...TYPOGRAPHY.h2, color: COLORS.white },
  dateBadgeMonthLg: { ...TYPOGRAPHY.overline, color: COLORS.white, fontSize: 10 },
  fullInfo: {},
  genreBadgeFull: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: RADIUS.round, alignSelf: 'flex-start', marginBottom: 8,
  },
  genreTextFull: { ...TYPOGRAPHY.overline, color: COLORS.white, fontSize: 10 },
  fullTitle: { ...TYPOGRAPHY.h3, color: COLORS.white },
  fullArtist: { ...TYPOGRAPHY.bodyMedium, color: COLORS.accentWarm, marginTop: 2 },
  fullFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  fullDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fullDetailText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray300 },
  fullPrice: { ...TYPOGRAPHY.h4, color: COLORS.white },

  // Horizontal Card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  horizontalImage: { width: 110, height: 130 },
  dateBadgeSmall: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 4,
    alignItems: 'center',
    minWidth: 36,
  },
  dateBadgeDay: { fontSize: 16, fontWeight: '800', color: COLORS.gray800 },
  dateBadgeMonth: { fontSize: 9, fontWeight: '700', color: COLORS.accent, letterSpacing: 1 },
  horizontalContent: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  genreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gray50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
    marginBottom: 4,
  },
  genreText: { ...TYPOGRAPHY.overline, color: COLORS.primary, fontSize: 9 },
  horizontalTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  horizontalTime: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 4 },
  horizontalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  horizontalPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontWeight: '700' },
  attendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendingText: { ...TYPOGRAPHY.caption, color: COLORS.primary },
});

export default EventCard;
