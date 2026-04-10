import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  color?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 14,
  showValue = true,
  count,
  color = COLORS.accentWarm,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color={color} />
      ))}
      {hasHalf && <Ionicons name="star-half" size={size} color={color} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color={color} />
      ))}
      {showValue && (
        <Text style={[styles.value, { fontSize: size - 1 }]}>{rating.toFixed(1)}</Text>
      )}
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>({count.toLocaleString()})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontWeight: '700',
    color: COLORS.gray700,
    marginLeft: 4,
  },
  count: {
    color: COLORS.gray500,
    marginLeft: 2,
  },
});

export default RatingStars;
