import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { Villa } from '../types';
import { VILLAS } from '../data/mockData';

const IMAGE_HEIGHT = 380;
const HEADER_HEIGHT = 56;
const TABS: { label: string; icon: string }[] = [
  { label: 'Overview', icon: 'compass-outline' },
  { label: 'Info', icon: 'list-outline' },
  { label: 'Tiket', icon: 'ticket-outline' },
  { label: 'Review', icon: 'chatbubble-ellipses-outline' },
  { label: 'Gallery', icon: 'images-outline' },
];
const MOCK_REVIEWS = [
  { id: '1', name: 'Ahmad Rizky', avatar: 'https://i.pravatar.cc/100?img=11', rating: 5, date: '2 minggu lalu', text: 'Villa sangat bagus dan bersih! Pelayanan ramah, view laut yang luar biasa. Pasti akan kembali lagi.' },
  { id: '2', name: 'Siti Nurhaliza', avatar: 'https://i.pravatar.cc/100?img=5', rating: 4, date: '1 bulan lalu', text: 'Lokasi strategis, fasilitas lengkap. Kolam renang private sangat menyenangkan. Sedikit masalah di AC tapi cepat diperbaiki.' },
  { id: '3', name: 'Budi Santoso', avatar: 'https://i.pravatar.cc/100?img=12', rating: 5, date: '1 bulan lalu', text: 'Pengalaman menginap terbaik! Anak-anak sangat senang. Sarapan enak dan variatif.' },
  { id: '4', name: 'Dewi Lestari', avatar: 'https://i.pravatar.cc/100?img=9', rating: 4, date: '2 bulan lalu', text: 'Suasana tenang dan damai. Cocok untuk honeymoon. Interior modern dan elegan.' },
];
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface VillaDetailScreenProps {
  villa: Villa;
  resortName: string;
  onBack: () => void;
  onBook: () => void;
  onChat?: () => void;
}

/* ── Image Carousel Dot ─────────────────────────── */
const CarouselDot: React.FC<{ index: number; scrollX: SharedValue<number> }> = ({ index, scrollX }) => {
  const style = useAnimatedStyle(() => {
    const w = interpolate(scrollX.value, [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH], [8, 24, 8], 'clamp');
    const o = interpolate(scrollX.value, [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH], [0.35, 1, 0.35], 'clamp');
    return { width: w, opacity: o };
  });
  return <Animated.View style={[styles.dot, style]} />;
};

const VillaDetailScreen: React.FC<VillaDetailScreenProps> = ({ villa, resortName, onBack, onBook, onChat }) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const carouselScrollX = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Calculate bottom bar height for proper padding
  const bottomBarHeight = 90 + insets.bottom;

  const scrollHandler = useAnimatedScrollHandler({ onScroll: e => { scrollY.value = e.contentOffset.y; } });
  const carouselHandler = useAnimatedScrollHandler({ onScroll: e => { carouselScrollX.value = e.contentOffset.x; } });
  const onViewable = useRef(({ viewableItems }: any) => { if (viewableItems.length > 0) setImgIndex(viewableItems[0].index ?? 0); }).current;

  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

  // Header opacity
  const headerBg = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 140, IMAGE_HEIGHT - 60], [0, 1], Extrapolation.CLAMP);
    return { backgroundColor: `rgba(255,255,255,${o})`, borderBottomWidth: o > 0.9 ? 1 : 0, borderBottomColor: COLORS.gray100 };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40], [0, 1], Extrapolation.CLAMP);
    return { opacity: o };
  });

  // Similar villas (same category, different id)
  const similarVillas = VILLAS.filter(v => v.category === villa.category && v.id !== villa.id).slice(0, 6);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top }, headerBg]}>
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Animated.Text style={[styles.headerTitle, headerTitleStyle]} numberOfLines={1}>{villa.name}</Animated.Text>
        <View style={styles.headerRight}>
          <Pressable onPress={() => setLiked(!liked)} style={styles.headerBtn}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? COLORS.coral : COLORS.gray800} />
          </Pressable>
          <Pressable style={styles.headerBtn}>
            <Ionicons name="share-outline" size={20} color={COLORS.gray800} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 20 }}
      >
        {/* ── Image Carousel ────────────────────────── */}
        <View style={styles.carouselWrapper}>
          <AnimatedFlatList
            data={villa.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={carouselHandler}
            scrollEventThrottle={16}
            onViewableItemsChanged={onViewable}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            keyExtractor={(_: any, i: number) => i.toString()}
            renderItem={({ item }: any) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
          {/* Dots */}
          <View style={styles.dotsRow}>
            {villa.images.map((_, i) => <CarouselDot key={i} index={i} scrollX={carouselScrollX} />)}
          </View>
          {/* Counter badge */}
          <View style={styles.imgCounter}>
            <Ionicons name="images-outline" size={13} color={COLORS.white} />
            <Text style={styles.imgCounterText}>{imgIndex + 1}/{villa.images.length}</Text>
          </View>
        </View>

        {/* ── Content Card (overlaps image with rounded top) ── */}
        <View style={styles.contentCard}>
          {/* Category Badge + Rating */}
          <View style={styles.badgeRow}>
            <View style={[styles.catBadge, {
              backgroundColor: villa.category === 'suite' ? COLORS.accent + '12' :
                villa.category === 'premium' ? COLORS.primary + '12' :
                villa.category === 'deluxe' ? COLORS.teal + '12' : COLORS.gray100,
            }]}>
              <Text style={[styles.catBadgeText, {
                color: villa.category === 'suite' ? COLORS.accent :
                  villa.category === 'premium' ? COLORS.primary :
                  villa.category === 'deluxe' ? COLORS.teal : COLORS.gray600,
              }]}>{villa.category.toUpperCase()}</Text>
            </View>
            <View style={styles.ratingChip}>
              <Ionicons name="star" size={14} color={COLORS.accent} />
              <Text style={styles.ratingText}>{villa.rating}</Text>
              <Text style={styles.reviewCount}>(47 review)</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.villaName}>{villa.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.gray500} />
            <Text style={styles.locationText}>{resortName}, Bengkulu</Text>
          </View>

          {/* Tab Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
            {TABS.map((tab, i) => (
              <Pressable key={tab.label} onPress={() => setActiveTab(i)} style={[styles.tabItem, activeTab === i && styles.tabItemActive]}>
                <Ionicons name={tab.icon as any} size={16} color={activeTab === i ? COLORS.primary : COLORS.gray400} />
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── Tab Content ──────────────────────── */}
          {activeTab === 0 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Tentang Villa</Text>
              <Text style={styles.description}>{villa.description}</Text>
              <View style={styles.quickInfoBar}>
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.teal + '12' }]}>
                    <Ionicons name="bed-outline" size={18} color={COLORS.teal} />
                  </View>
                  <Text style={styles.qiValue}>{villa.bedrooms}</Text>
                  <Text style={styles.qiLabel}>Kamar</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.primary + '12' }]}>
                    <Ionicons name="water-outline" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.qiValue}>{villa.bathrooms}</Text>
                  <Text style={styles.qiLabel}>Kamar Mandi</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.accent + '12' }]}>
                    <Ionicons name="people-outline" size={18} color={COLORS.accent} />
                  </View>
                  <Text style={styles.qiValue}>{villa.maxGuests}</Text>
                  <Text style={styles.qiLabel}>Maks Tamu</Text>
                </View>
              </View>

              {/* Similar Villas inside Overview */}
              {similarVillas.length > 0 && (
                <View style={styles.similarSection}>
                  <Text style={styles.sectionTitle}>Villa Serupa</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarList}>
                    {similarVillas.map((sv, index) => (
                      <Animated.View key={sv.id} entering={FadeInDown.delay(index * 60).springify()}>
                        <View style={styles.similarCard}>
                          <Image source={sv.images[0]} style={styles.similarImage} />
                          <View style={styles.similarInfo}>
                            <Text style={styles.similarName} numberOfLines={1}>{sv.name}</Text>
                            <View style={styles.similarMeta}>
                              <Ionicons name="star" size={12} color={COLORS.accent} />
                              <Text style={styles.similarRating}>{sv.rating}</Text>
                            </View>
                            <Text style={styles.similarPrice}>{formatPrice(sv.pricePerNight)}<Text style={styles.similarUnit}>/malam</Text></Text>
                          </View>
                        </View>
                      </Animated.View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </Animated.View>
          )}

          {activeTab === 1 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              <View style={styles.amenitiesGrid}>
                {villa.amenities.map(a => (
                  <View key={a} style={styles.amenityChip}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.xxl }]}>Kebijakan</Text>
              <View style={styles.policyCard}>
                <View style={styles.policyItem}>
                  <Ionicons name="log-in-outline" size={18} color={COLORS.primary} />
                  <View>
                    <Text style={styles.policyLabel}>Check-in</Text>
                    <Text style={styles.policyValue}>14:00 WIB</Text>
                  </View>
                </View>
                <View style={styles.policyDivider} />
                <View style={styles.policyItem}>
                  <Ionicons name="log-out-outline" size={18} color={COLORS.coral} />
                  <View>
                    <Text style={styles.policyLabel}>Check-out</Text>
                    <Text style={styles.policyValue}>12:00 WIB</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cancelPolicy}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
                <Text style={styles.cancelText}>Pembatalan gratis hingga 48 jam sebelumnya</Text>
              </View>
            </Animated.View>
          )}

          {activeTab === 2 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Rincian Biaya</Text>
              <View style={styles.costCard}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Harga per malam</Text>
                  <Text style={styles.costValue}>{formatPrice(villa.pricePerNight)}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Biaya layanan (5%)</Text>
                  <Text style={styles.costValue}>{formatPrice(Math.round(villa.pricePerNight * 0.05))}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Pajak (10%)</Text>
                  <Text style={styles.costValue}>{formatPrice(Math.round(villa.pricePerNight * 0.1))}</Text>
                </View>
                <View style={styles.costDivider} />
                <View style={styles.costRow}>
                  <Text style={styles.costTotalLabel}>Estimasi Total / Malam</Text>
                  <Text style={styles.costTotalValue}>{formatPrice(Math.round(villa.pricePerNight * 1.15))}</Text>
                </View>
              </View>
              <View style={styles.noteRow}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.gray500} />
                <Text style={styles.noteText}>Harga bisa berubah sesuai musim dan ketersediaan</Text>
              </View>
            </Animated.View>
          )}

          {/* Review Tab */}
          {activeTab === 3 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Ulasan Tamu</Text>
                  <View style={styles.reviewSummary}>
                    <Ionicons name="star" size={18} color={COLORS.accent} />
                    <Text style={styles.reviewAvg}>{villa.rating}</Text>
                    <Text style={styles.reviewTotal}>· {MOCK_REVIEWS.length} ulasan</Text>
                  </View>
                </View>
              </View>
              {MOCK_REVIEWS.map((rv, i) => (
                <Animated.View key={rv.id} entering={FadeInDown.delay(i * 80).springify()} style={styles.reviewCard}>
                  <View style={styles.reviewUserRow}>
                    <Image source={{ uri: rv.avatar }} style={styles.reviewAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{rv.name}</Text>
                      <Text style={styles.reviewDate}>{rv.date}</Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {Array.from({ length: rv.rating }).map((_, s) => (
                        <Ionicons key={s} name="star" size={12} color={COLORS.accent} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{rv.text}</Text>
                </Animated.View>
              ))}
            </Animated.View>
          )}

          {/* Gallery Tab */}
          {activeTab === 4 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Foto Villa</Text>
              <View style={styles.galleryGrid}>
                {villa.images.map((img, i) => (
                  <Animated.View key={i} entering={FadeInDown.delay(i * 80).springify()}>
                    <Pressable onPress={() => { setGalleryIndex(i); setGalleryVisible(true); }}>
                      <Image source={{ uri: img }} style={i === 0 ? styles.galleryHero : styles.galleryThumb} />
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Fullscreen Gallery Modal */}
      <Modal visible={galleryVisible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setGalleryVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalClose} onPress={() => setGalleryVisible(false)}>
            <Ionicons name="close" size={28} color={COLORS.white} />
          </Pressable>
          <FlatList
            data={villa.images}
            horizontal
            pagingEnabled
            initialScrollIndex={galleryIndex}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.modalImage} resizeMode="contain" />
            )}
          />
        </View>
      </Modal>

      {/* ── Bottom Booking Bar ────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomPrice}>{formatPrice(villa.pricePerNight)}</Text>
          <Text style={styles.bottomUnit}>/ malam · termasuk pajak</Text>
        </View>
        <View style={styles.bottomRight}>
          <Pressable onPress={onChat} style={styles.chatFloatBtn}>
            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
          </Pressable>
          <Pressable onPress={onBook} disabled={!villa.available} style={[styles.bookBtn, !villa.available && { opacity: 0.5 }]}>
            <LinearGradient colors={COLORS.gradientOcean as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookGradient}>
              <Text style={styles.bookText}>{villa.available ? 'Pesan Sekarang' : 'Sold Out'}</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  // Floating Header
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md,
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.small,
  },
  headerTitle: { flex: 1, ...TYPOGRAPHY.h4, color: COLORS.gray800, textAlign: 'center', marginHorizontal: 4 },
  headerRight: { flexDirection: 'row', gap: 8 },

  // Image Carousel
  carouselWrapper: { position: 'relative' },
  carouselImage: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' },
  dotsRow: { position: 'absolute', bottom: 36, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot: { height: 4, borderRadius: 2, backgroundColor: COLORS.white },
  imgCounter: {
    position: 'absolute', bottom: 36, right: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round,
  },
  imgCounterText: { fontSize: 11, fontWeight: '600', color: COLORS.white },

  // Content Card
  contentCard: {
    marginTop: -24, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxl,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  catBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.round },
  catBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  reviewCount: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  villaName: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 24, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.lg },
  locationText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500 },

  // Tab Bar
  tabBar: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.lg, marginBottom: SPACING.xxl, flexGrow: 0 },
  tabBarContent: { padding: 4, gap: 4 },
  tabItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md },
  tabItemActive: { backgroundColor: COLORS.white, ...SHADOWS.small },
  tabText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500, fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: COLORS.primary },

  // Sections
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md, fontSize: 16 },
  description: { ...TYPOGRAPHY.body, color: COLORS.gray600, lineHeight: 24 },

  // Quick Info Bar
  quickInfoBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, paddingVertical: SPACING.lg, marginTop: SPACING.xxl,
  },
  qiItem: { alignItems: 'center', gap: 4 },
  qiIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qiValue: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  qiLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11 },
  qiDivider: { width: 1, height: 40, backgroundColor: COLORS.gray200 },

  // Amenities
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.offWhite, paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.round,
  },
  amenityText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray700 },

  // Policies
  policyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, paddingVertical: SPACING.lg,
  },
  policyItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  policyLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  policyValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  policyDivider: { width: 1, height: 36, backgroundColor: COLORS.gray200 },
  cancelPolicy: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.lg,
    backgroundColor: COLORS.success + '08', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: RADIUS.lg,
  },
  cancelText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray700, flex: 1 },

  // Costs
  costCard: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, padding: SPACING.xl },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  costLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500, fontSize: 14 },
  costValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  costDivider: { height: 1, backgroundColor: COLORS.gray200, marginVertical: 8 },
  costTotalLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  costTotalValue: { ...TYPOGRAPHY.h4, color: COLORS.primary, fontSize: 16 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.md },
  noteText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, flex: 1 },

  // Similar Villas
  similarSection: { marginTop: SPACING.xxxl },
  similarList: { gap: 12, paddingBottom: SPACING.md },
  similarCard: { width: 160, backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, overflow: 'hidden' },
  similarImage: { width: 160, height: 110 },
  similarInfo: { padding: SPACING.sm },
  similarName: { ...TYPOGRAPHY.bodySm, color: COLORS.gray800, fontWeight: '600', marginBottom: 4 },
  similarMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  similarRating: { ...TYPOGRAPHY.caption, color: COLORS.gray700, fontWeight: '700', fontSize: 11 },
  similarPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 13 },
  similarUnit: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontWeight: '400', fontSize: 10 },

  // Gallery
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  galleryHero: { width: '100%', height: 200, borderRadius: RADIUS.xl, marginBottom: 2 },
  galleryThumb: { width: (SCREEN_WIDTH - SPACING.xl * 2 - 10) / 2, height: 130, borderRadius: RADIUS.lg },

  // Review
  reviewHeader: { marginBottom: SPACING.lg },
  reviewSummary: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reviewAvg: { ...TYPOGRAPHY.h3, color: COLORS.gray800, fontSize: 20 },
  reviewTotal: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500 },
  reviewCard: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  reviewUserRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.sm },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  reviewDate: { ...TYPOGRAPHY.caption, color: COLORS.gray400 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray600, lineHeight: 20 },

  // Bottom Bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingTop: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.gray100,
    ...SHADOWS.large,
  },
  bottomLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  bottomPrice: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontSize: 18 },
  bottomUnit: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2, fontSize: 11 },
  bottomRight: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    flexShrink: 0,
  },
  chatFloatBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS.primary + '10', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  bookBtn: { borderRadius: RADIUS.lg, overflow: 'hidden' },
  bookGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  bookText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2 },
});

export default VillaDetailScreen;
