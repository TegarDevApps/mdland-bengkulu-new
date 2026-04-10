import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { RESTAURANTS } from '../data/mockData';
import { Restaurant } from '../types';

interface FnBScreenProps {
  onNavigateOrder: (restaurant: Restaurant) => void;
  onBack?: () => void;
}

const FnBScreen: React.FC<FnBScreenProps> = ({ onNavigateOrder, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeIn} style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Food & Beverage</Text>
          <Text style={styles.subtitle}>MDLAND Bengkulu</Text>
        </View>
        <Image
          source={require('../../assets/mdland-logo.jpeg')}
          style={styles.headerLogo}
        />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.infoBanner}>
          <Ionicons name="time-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>Pesan makanan & minuman langsung ke villa Anda</Text>
        </Animated.View>

        {/* Restaurant Cards */}
        {RESTAURANTS.map((restaurant, index) => (
          <Animated.View
            key={restaurant.id}
            entering={FadeInDown.delay(200 + index * 100).springify()}
          >
            <Pressable
              style={styles.restaurantCard}
              onPress={() => onNavigateOrder(restaurant)}
            >
              <Image source={restaurant.image} style={styles.restaurantImage} />
              <View style={styles.restaurantOverlay}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color={COLORS.accent} />
                  <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.restaurantDesc} numberOfLines={2}>{restaurant.description}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.metaText}>{restaurant.openHours}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="pricetag-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.metaText}>{restaurant.priceRange}</Text>
                  </View>
                </View>
                <View style={styles.menuCount}>
                  <Text style={styles.menuCountText}>{restaurant.items.length} menu tersedia</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
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
  content: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary + '10', borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.lg,
  },
  infoText: { ...TYPOGRAPHY.bodySm, color: COLORS.primary, flex: 1 },
  restaurantCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.medium,
  },
  restaurantImage: { width: '100%', height: 160 },
  restaurantOverlay: { position: 'absolute', top: 12, right: 12 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: RADIUS.round,
  },
  ratingText: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.gray800 },
  restaurantInfo: { padding: SPACING.lg },
  restaurantName: { ...TYPOGRAPHY.h3, color: COLORS.gray800, fontSize: 18 },
  restaurantCuisine: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  restaurantDesc: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500, marginTop: 6 },
  restaurantMeta: { flexDirection: 'row', gap: 16, marginTop: SPACING.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 12 },
  menuCount: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  menuCountText: { ...TYPOGRAPHY.buttonSm, color: COLORS.primary },
});

export default FnBScreen;
