import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import AnimatedButton from './common/AnimatedButton';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  sortBy: string;
}

const PRICE_OPTIONS = ['$0-200', '$200-500', '$500-1000', '$1000+'];
const RATING_OPTIONS = [3, 3.5, 4, 4.5];
const AMENITY_OPTIONS = [
  'Private Pool', 'Beach Access', 'Spa', 'Fine Dining',
  'Water Sports', 'Yoga', 'Butler Service', 'Gym',
];
const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('Recommended');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleReset = () => {
    setSelectedPrice('');
    setSelectedRating(0);
    setSelectedAmenities([]);
    setSelectedSort('Recommended');
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View entering={SlideInDown.springify().damping(18)} style={styles.content}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Sort */}
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.chipRow}>
              {SORT_OPTIONS.map(sort => (
                <Pressable
                  key={sort}
                  onPress={() => setSelectedSort(sort)}
                  style={[styles.chip, selectedSort === sort && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedSort === sort && styles.chipTextActive]}>
                    {sort}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Price */}
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.chipRow}>
              {PRICE_OPTIONS.map(price => (
                <Pressable
                  key={price}
                  onPress={() => setSelectedPrice(price === selectedPrice ? '' : price)}
                  style={[styles.chip, selectedPrice === price && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedPrice === price && styles.chipTextActive]}>
                    {price}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Rating */}
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.chipRow}>
              {RATING_OPTIONS.map(rating => (
                <Pressable
                  key={rating}
                  onPress={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                  style={[styles.chip, selectedRating === rating && styles.chipActive]}
                >
                  <Ionicons
                    name="star"
                    size={12}
                    color={selectedRating === rating ? COLORS.white : COLORS.accentWarm}
                  />
                  <Text style={[styles.chipText, selectedRating === rating && styles.chipTextActive]}>
                    {rating}+
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Amenities */}
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.chipRow}>
              {AMENITY_OPTIONS.map(amenity => (
                <Pressable
                  key={amenity}
                  onPress={() => toggleAmenity(amenity)}
                  style={[styles.chip, selectedAmenities.includes(amenity) && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedAmenities.includes(amenity) && styles.chipTextActive,
                    ]}
                  >
                    {amenity}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <AnimatedButton
              title={`Apply Filters`}
              onPress={() => {
                onApply({
                  priceRange: [0, 2000],
                  rating: selectedRating,
                  amenities: selectedAmenities,
                  sortBy: selectedSort,
                });
                onClose();
              }}
              variant="gradient"
              fullWidth
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxxl,
    borderTopRightRadius: RADIUS.xxxl,
    maxHeight: '80%',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray300,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  resetText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.accent },
  scroll: { marginBottom: SPACING.lg },
  sectionTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.gray700,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.gray50,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.gray600 },
  chipTextActive: { color: COLORS.white },
  footer: {
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
});

export default FilterModal;
