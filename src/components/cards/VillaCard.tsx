import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Villa } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY, SCREEN_WIDTH } from '../../constants/theme';
import RatingStars from '../common/RatingStars';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface VillaCardProps {
  villa: Villa;
  onPress: () => void;
  index?: number;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa, onPress, index = 0 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInRight.delay(index * 80).springify()}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.card, animatedStyle, SHADOWS.medium]}
    >
      <Image source={villa.images[0]} style={styles.image} />
      {!villa.available && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>FULLY BOOKED</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{villa.name}</Text>
        <RatingStars rating={villa.rating} size={12} />
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={14} color={COLORS.gray500} />
            <Text style={styles.detailText}>{villa.bedrooms} bed</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={14} color={COLORS.gray500} />
            <Text style={styles.detailText}>{villa.bathrooms} bath</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color={COLORS.gray500} />
            <Text style={styles.detailText}>{villa.maxGuests} guests</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>
            Rp {villa.pricePerNight.toLocaleString('id-ID')}<Text style={styles.priceUnit}>/malam</Text>
          </Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookText}>View</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  unavailableText: {
    ...TYPOGRAPHY.overline,
    color: COLORS.white,
    fontSize: 9,
  },
  content: {
    padding: SPACING.lg,
  },
  name: {
    ...TYPOGRAPHY.h4,
    color: COLORS.gray800,
    marginBottom: 6,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray500,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  price: {
    ...TYPOGRAPHY.h4,
    color: COLORS.gray800,
  },
  priceUnit: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.gray500,
    fontWeight: '400',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gray50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
  },
  bookText: {
    ...TYPOGRAPHY.buttonSm,
    color: COLORS.primary,
  },
});

export default VillaCard;
