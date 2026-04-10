import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Resort } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY, SCREEN_WIDTH } from '../../constants/theme';
import RatingStars from '../common/RatingStars';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ResortCardProps {
  resort: Resort;
  onPress: () => void;
  variant?: 'large' | 'medium' | 'compact';
  index?: number;
}

export const ResortCard: React.FC<ResortCardProps> = ({
  resort,
  onPress,
  variant = 'large',
  index = 0,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  if (variant === 'compact') {
    return (
      <AnimatedPressable
        entering={FadeInDown.delay(index * 100).springify()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.compactCard, animatedStyle]}
      >
        <ImageBackground
          source={resort.image}
          style={styles.compactImage}
          imageStyle={{ borderRadius: RADIUS.lg }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.compactGradient}
          >
            <Text style={styles.compactName} numberOfLines={1}>{resort.name}</Text>
            <Text style={styles.compactLocation}>{resort.location}</Text>
          </LinearGradient>
        </ImageBackground>
      </AnimatedPressable>
    );
  }

  if (variant === 'medium') {
    return (
      <AnimatedPressable
        entering={FadeInDown.delay(index * 100).springify()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.mediumCard, animatedStyle]}
      >
        <ImageBackground
          source={resort.image}
          style={styles.mediumImage}
          imageStyle={{ borderRadius: RADIUS.xl }}
        >
          <LinearGradient
            colors={COLORS.gradientDarkReverse as any}
            style={styles.mediumGradient}
          >
            <View style={styles.mediumBadge}>
              <Ionicons name="star" size={12} color={COLORS.accentWarm} />
              <Text style={styles.mediumRating}>{resort.rating}</Text>
            </View>
            <View style={styles.mediumInfo}>
              <Text style={styles.mediumName} numberOfLines={1}>{resort.name}</Text>
              <View style={styles.mediumRow}>
                <Ionicons name="location" size={13} color={COLORS.white} />
                <Text style={styles.mediumLocation}>{resort.location}</Text>
              </View>
              <Text style={styles.mediumPrice}>
                Rp {resort.pricePerNight.toLocaleString('id-ID')}<Text style={styles.mediumPriceUnit}>/malam</Text>
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </AnimatedPressable>
    );
  }

  // Large variant (default)
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 120).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.largeCard, animatedStyle, SHADOWS.large]}
    >
      <ImageBackground
        source={resort.image}
        style={styles.largeImage}
        imageStyle={{ borderRadius: RADIUS.xxl }}
      >
        <LinearGradient
          colors={COLORS.gradientDarkReverse as any}
          style={styles.largeGradient}
        >
          {resort.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="diamond" size={12} color={COLORS.white} />
              <Text style={styles.featuredText}>FEATURED</Text>
            </View>
          )}
          <View style={styles.heartButton}>
            <Ionicons name="heart-outline" size={22} color={COLORS.white} />
          </View>
          <View style={styles.largeInfo}>
            <Text style={styles.largeName}>{resort.name}</Text>
            <View style={styles.largeRow}>
              <Ionicons name="location" size={14} color={COLORS.seafoam} />
              <Text style={styles.largeLocation}>{resort.location}</Text>
            </View>
            <View style={styles.largeBottom}>
              <RatingStars
                rating={resort.rating}
                count={resort.reviewCount}
                size={13}
                color={COLORS.accentWarm}
              />
              <Text style={styles.largePrice}>
                <Text style={styles.largePriceValue}>Rp {resort.pricePerNight.toLocaleString('id-ID')}</Text>/malam
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  // Large
  largeCard: { marginBottom: SPACING.xl, borderRadius: RADIUS.xxl },
  largeImage: { width: '100%', height: 320, justifyContent: 'flex-end' },
  largeGradient: { flex: 1, borderRadius: RADIUS.xxl, justifyContent: 'flex-end', padding: SPACING.xl },
  featuredBadge: {
    position: 'absolute', top: SPACING.lg, left: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.round,
  },
  featuredText: { ...TYPOGRAPHY.overline, color: COLORS.white, fontSize: 10 },
  heartButton: {
    position: 'absolute', top: SPACING.lg, right: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.round,
    padding: 8,
  },
  largeName: { ...TYPOGRAPHY.h3, color: COLORS.white },
  largeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  largeLocation: { ...TYPOGRAPHY.bodySm, color: COLORS.seafoam },
  largeBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  largePrice: { ...TYPOGRAPHY.bodySm, color: COLORS.gray300 },
  largePriceValue: { ...TYPOGRAPHY.h4, color: COLORS.white },
  largeInfo: {},

  // Medium
  mediumCard: { width: SCREEN_WIDTH * 0.6, marginRight: SPACING.lg, borderRadius: RADIUS.xl },
  mediumImage: { width: '100%', height: 240, justifyContent: 'flex-end' },
  mediumGradient: { flex: 1, borderRadius: RADIUS.xl, justifyContent: 'flex-end', padding: SPACING.lg },
  mediumBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  mediumRating: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '700' },
  mediumInfo: {},
  mediumName: { ...TYPOGRAPHY.h4, color: COLORS.white },
  mediumRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  mediumLocation: { ...TYPOGRAPHY.caption, color: COLORS.gray300 },
  mediumPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, marginTop: 6 },
  mediumPriceUnit: { ...TYPOGRAPHY.caption, color: COLORS.gray400 },

  // Compact
  compactCard: { width: 150, marginRight: SPACING.md },
  compactImage: { width: 150, height: 200, justifyContent: 'flex-end' },
  compactGradient: { borderRadius: RADIUS.lg, justifyContent: 'flex-end', padding: 10, flex: 1 },
  compactName: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '700' },
  compactLocation: { ...TYPOGRAPHY.caption, color: COLORS.gray300, fontSize: 10 },
});

export default ResortCard;
