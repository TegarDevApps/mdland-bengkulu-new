import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { VILLAS } from '../data/mockData';
import AnimatedButton from '../components/common/AnimatedButton';

const WishlistScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  // Simulated wishlist with first 3 villas
  const wishlistItems = VILLAS.slice(0, 3);

  const renderItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Pressable style={styles.card}>
        <Image source={item.images[0] as any} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.cardLocation}>
            <Ionicons name="location" size={13} color={COLORS.primary} />
            <Text style={styles.cardLocationText}>MDLAND Bengkulu</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>Rp {item.pricePerNight.toLocaleString('id-ID')}/malam</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={COLORS.accentWarm} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <Pressable style={styles.heartBtn}>
          <Ionicons name="heart" size={22} color={COLORS.coral} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>{wishlistItems.length} villa tersimpan</Text>
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={48} color={COLORS.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Belum ada favorit</Text>
            <Text style={styles.emptySubtitle}>
              Jelajahi dan simpan villa favorit Anda
            </Text>
            <AnimatedButton title="Jelajahi Villa" onPress={() => {}} variant="gradient" size="md" />
          </Animated.View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  title: { ...TYPOGRAPHY.h1, color: COLORS.gray800 },
  subtitle: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500, marginTop: 4 },
  list: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },

  card: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, overflow: 'hidden',
    marginBottom: SPACING.md, ...SHADOWS.small,
  },
  cardImage: { width: 120, height: 130 },
  cardContent: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  cardName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardLocationText: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10,
  },
  cardPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...TYPOGRAPHY.caption, color: COLORS.gray700, fontWeight: '700' },
  heartBtn: {
    position: 'absolute', top: SPACING.md, right: SPACING.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.coral + '15',
    alignItems: 'center', justifyContent: 'center',
  },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: SPACING.xxl },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.gray50, alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray700, marginBottom: SPACING.sm },
  emptySubtitle: {
    ...TYPOGRAPHY.body, color: COLORS.gray400, textAlign: 'center',
    marginBottom: SPACING.xxl, lineHeight: 24,
  },
});

export default WishlistScreen;
