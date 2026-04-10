import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList,
} from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { WAHANA } from '../data/mockData';
import { Wahana } from '../types';

const CATEGORIES = ['Semua', 'Water', 'Adventure', 'Family', 'Leisure'];
const CAT_ICONS: Record<string, string> = {
  Semua: 'apps-outline',
  Water: 'water-outline',
  Adventure: 'compass-outline',
  Family: 'people-outline',
  Leisure: 'sunny-outline',
};

interface WahanaListScreenProps {
  onSelectWahana: (wahana: Wahana) => void;
  onBack?: () => void;
}

const WahanaListScreen: React.FC<WahanaListScreenProps> = ({ onSelectWahana, onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = activeCategory === 'Semua'
    ? WAHANA
    : WAHANA.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Wahana & Aktivitas</Text>
          <Text style={styles.subtitle}>MDLAND Bengkulu</Text>
        </View>
        <Image
          source={require('../../assets/mdland-logo.jpeg')}
          style={styles.headerLogo}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryWrapper}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
          >
            <Ionicons
              name={CAT_ICONS[cat] as any}
              size={15}
              color={activeCategory === cat ? COLORS.white : COLORS.gray500}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.resultsCount}>{filtered.length} wahana tersedia</Text>

      {/* Wahana Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80).springify()} style={styles.gridItem}>
            <Pressable
              style={styles.wahanaCard}
              onPress={() => onSelectWahana(item)}
            >
              <Image source={item.image} style={styles.wahanaImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.wahanaGradient}
              >
                <View style={styles.wahanaCategory}>
                  <Text style={styles.wahanaCategoryText}>{item.category.toUpperCase()}</Text>
                </View>
              </LinearGradient>
              <View style={styles.wahanaInfo}>
                <Text style={styles.wahanaName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.wahanaDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={12} color={COLORS.gray500} />
                    <Text style={styles.detailText}>{item.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={12} color={COLORS.gray500} />
                    <Text style={styles.detailText}>{item.capacity} org</Text>
                  </View>
                </View>
                <View style={styles.wahanaFooter}>
                  <Text style={styles.wahanaPrice}>{formatPrice(item.price)}</Text>
                  <View style={styles.ratingSmall}>
                    <Ionicons name="star" size={11} color={COLORS.accent} />
                    <Text style={styles.ratingSmallText}>{item.rating}</Text>
                  </View>
                </View>
                {!item.available && (
                  <View style={styles.unavailable}>
                    <Text style={styles.unavailableText}>Tutup</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="boat-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>Belum ada wahana di kategori ini</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerLogo: { width: 40, height: 40, borderRadius: 10 },
  title: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 22 },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },

  categoryWrapper: {
    height: 54,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: SPACING.sm,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.xl, gap: 10,
    alignItems: 'center', paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.gray200,
    height: 38, justifyContent: 'center', alignItems: 'center',
  },
  categoryChipActive: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  categoryText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontSize: 13 },
  categoryTextActive: { color: COLORS.white },

  resultsCount: { ...TYPOGRAPHY.caption, color: COLORS.gray500, paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },

  listContainer: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between', marginBottom: SPACING.md },
  gridItem: { width: (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.md) / 2 },

  wahanaCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    overflow: 'hidden', ...SHADOWS.small,
  },
  wahanaImage: { width: '100%', height: 120 },
  wahanaGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 120,
    justifyContent: 'flex-start', alignItems: 'flex-start', padding: 8,
  },
  wahanaCategory: {
    backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  wahanaCategoryText: { fontSize: 9, fontWeight: '700', color: COLORS.gray700, letterSpacing: 0.5 },
  wahanaInfo: { padding: SPACING.sm },
  wahanaName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 13, marginBottom: 4 },
  wahanaDetails: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  detailText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 10 },
  wahanaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wahanaPrice: { ...TYPOGRAPHY.h4, color: COLORS.teal, fontSize: 13 },
  ratingSmall: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingSmallText: { ...TYPOGRAPHY.caption, color: COLORS.gray700, fontWeight: '700', fontSize: 11 },
  unavailable: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: COLORS.error + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.round,
  },
  unavailableText: { fontSize: 9, fontWeight: '600', color: COLORS.error },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.lg },
});

export default WahanaListScreen;
