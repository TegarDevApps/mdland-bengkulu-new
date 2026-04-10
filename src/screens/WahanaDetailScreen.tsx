import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList, Modal,
} from 'react-native';
import Animated, {
  FadeInDown, FadeIn,
  useAnimatedScrollHandler, useSharedValue, useAnimatedStyle,
  interpolate, Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { Wahana } from '../types';
import { WAHANA } from '../data/mockData';

const IMAGE_HEIGHT = 360;
const HEADER_HEIGHT = 56;
const TABS: { label: string; icon: string }[] = [
  { label: 'Overview', icon: 'compass-outline' },
  { label: 'Info', icon: 'list-outline' },
  { label: 'Tiket', icon: 'ticket-outline' },
  { label: 'Review', icon: 'chatbubble-ellipses-outline' },
  { label: 'Gallery', icon: 'images-outline' },
];
const MOCK_REVIEWS = [
  { id: '1', name: 'Reza Pratama', avatar: 'https://i.pravatar.cc/100?img=14', rating: 5, date: '1 minggu lalu', text: 'Wahana seru banget! Anak-anak sangat menikmati. Staff ramah dan sigap.' },
  { id: '2', name: 'Fitri Amalia', avatar: 'https://i.pravatar.cc/100?img=23', rating: 4, date: '2 minggu lalu', text: 'Pengalaman menyenangkan, wahana terjaga keamanannya. Antrian agak panjang di weekend.' },
  { id: '3', name: 'Dimas Aryo', avatar: 'https://i.pravatar.cc/100?img=33', rating: 5, date: '1 bulan lalu', text: 'Worth it banget! Pemandangan dari wahana ini luar biasa. Harga sesuai pengalaman.' },
];

interface WahanaDetailScreenProps {
  wahana: Wahana;
  onBack: () => void;
  onBuyTicket: (wahana: Wahana, qty: number, total: number) => void;
  onChat?: () => void;
}

const WahanaDetailScreen: React.FC<WahanaDetailScreenProps> = ({ wahana, onBack, onBuyTicket, onChat }) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState(false);
  const [ticketQty, setTicketQty] = useState(1);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const total = wahana.price * ticketQty;

  const scrollHandler = useAnimatedScrollHandler({ onScroll: e => { scrollY.value = e.contentOffset.y; } });
  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

  const headerBg = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 140, IMAGE_HEIGHT - 60], [0, 1], Extrapolation.CLAMP);
    return { backgroundColor: `rgba(255,255,255,${o})`, borderBottomWidth: o > 0.9 ? 1 : 0, borderBottomColor: COLORS.gray100 };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40], [0, 1], Extrapolation.CLAMP);
    return { opacity: o };
  });

  const similarWahana = WAHANA.filter(w => w.category === wahana.category && w.id !== wahana.id).slice(0, 6);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top }, headerBg]}>
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Animated.Text style={[styles.headerTitle, headerTitleStyle]} numberOfLines={1}>{wahana.name}</Animated.Text>
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
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Hero Image */}
        <Image source={wahana.image as any} style={styles.heroImage} />

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Badge + Rating */}
          <View style={styles.badgeRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{wahana.category.toUpperCase()}</Text>
            </View>
            <View style={styles.ratingChip}>
              <Ionicons name="star" size={14} color={COLORS.accent} />
              <Text style={styles.ratingText}>{wahana.rating}</Text>
            </View>
          </View>

          <Text style={styles.wahanaName}>{wahana.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.gray500} />
            <Text style={styles.locationText}>MDLAND Bengkulu</Text>
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

          {/* Tab Content */}
          {activeTab === 0 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Deskripsi</Text>
              <Text style={styles.descriptionText}>{wahana.description}</Text>

              <View style={styles.quickInfoBar}>
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.teal + '12' }]}>
                    <Ionicons name="time-outline" size={18} color={COLORS.teal} />
                  </View>
                  <Text style={styles.qiValue}>{wahana.duration}</Text>
                  <Text style={styles.qiLabel}>Durasi</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.primary + '12' }]}>
                    <Ionicons name="people-outline" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.qiValue}>{wahana.capacity}</Text>
                  <Text style={styles.qiLabel}>Kapasitas</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.accent + '12' }]}>
                    <Ionicons name="cash-outline" size={18} color={COLORS.accent} />
                  </View>
                  <Text style={styles.qiValue}>{formatPrice(wahana.price)}</Text>
                  <Text style={styles.qiLabel}>Per Orang</Text>
                </View>
              </View>

              {/* Similar Wahana inside Overview */}
              {similarWahana.length > 0 && (
                <View style={styles.similarSection}>
                  <Text style={styles.sectionTitle}>Wahana Serupa</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarList}>
                    {similarWahana.map((sw, index) => (
                      <Animated.View key={sw.id} entering={FadeInDown.delay(index * 60).springify()}>
                        <View style={styles.similarCard}>
                          <Image source={sw.image as any} style={styles.similarImage} />
                          <View style={styles.similarInfo}>
                            <Text style={styles.similarName} numberOfLines={1}>{sw.name}</Text>
                            <View style={styles.similarMeta}>
                              <Ionicons name="star" size={12} color={COLORS.accent} />
                              <Text style={styles.similarRating}>{sw.rating}</Text>
                              <Text style={styles.similarDuration}> · {sw.duration}</Text>
                            </View>
                            <Text style={styles.similarPrice}>{formatPrice(sw.price)}</Text>
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
              <Text style={styles.sectionTitle}>Detail Wahana</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color={COLORS.teal} />
                  <Text style={styles.detailLabel}>Durasi</Text>
                  <Text style={styles.detailValue}>{wahana.duration}</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Kapasitas</Text>
                  <Text style={styles.detailValue}>Max {wahana.capacity} orang</Text>
                </View>
                <View style={styles.detailDivider} />
                {wahana.minAge != null && (
                  <>
                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={18} color={COLORS.accent} />
                      <Text style={styles.detailLabel}>Usia Minimum</Text>
                      <Text style={styles.detailValue}>{wahana.minAge} tahun</Text>
                    </View>
                    <View style={styles.detailDivider} />
                  </>
                )}
                <View style={styles.detailRow}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} />
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, { color: wahana.available ? COLORS.success : COLORS.error }]}>
                    {wahana.available ? 'Tersedia' : 'Tutup'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: SPACING.xxl }]}>Yang Termasuk</Text>
              <View style={styles.includesGrid}>
                {['Peralatan lengkap', 'Instruktur', 'Asuransi', 'Loker'].map(item => (
                  <View key={item} style={styles.includeChip}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.includeText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {activeTab === 2 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Jumlah Tiket</Text>
              <View style={styles.ticketControl}>
                <Pressable onPress={() => setTicketQty(Math.max(1, ticketQty - 1))} style={styles.ticketBtn}>
                  <Ionicons name="remove" size={20} color={COLORS.primary} />
                </Pressable>
                <Text style={styles.ticketQty}>{ticketQty}</Text>
                <Pressable onPress={() => setTicketQty(Math.min(wahana.capacity, ticketQty + 1))} style={styles.ticketBtn}>
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                </Pressable>
              </View>

              <View style={styles.costCard}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>{ticketQty}x Tiket @ {formatPrice(wahana.price)}</Text>
                  <Text style={styles.costValue}>{formatPrice(total)}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Biaya layanan (5%)</Text>
                  <Text style={styles.costValue}>{formatPrice(Math.round(total * 0.05))}</Text>
                </View>
                <View style={styles.costDivider} />
                <View style={styles.costRow}>
                  <Text style={styles.costTotalLabel}>Total</Text>
                  <Text style={styles.costTotalValue}>{formatPrice(Math.round(total * 1.05))}</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Review Tab */}
          {activeTab === 3 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <View style={styles.reviewHeader}>
                <Text style={styles.sectionTitle}>Ulasan Pengunjung</Text>
                <View style={styles.reviewSummary}>
                  <Ionicons name="star" size={18} color={COLORS.accent} />
                  <Text style={styles.reviewAvg}>{wahana.rating}</Text>
                  <Text style={styles.reviewTotal}>· {MOCK_REVIEWS.length} ulasan</Text>
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
              <Text style={styles.sectionTitle}>Foto Wahana</Text>
              <View style={styles.galleryGrid}>
                <Animated.View entering={FadeInDown.delay(0).springify()}>
                  <Pressable onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
                    <Image source={wahana.image as any} style={styles.galleryHero} />
                  </Pressable>
                </Animated.View>
                {[wahana.image, wahana.image].map((img, i) => (
                  <Animated.View key={i} entering={FadeInDown.delay((i + 1) * 80).springify()}>
                    <Pressable onPress={() => { setGalleryIndex(i + 1); setGalleryVisible(true); }}>
                      <Image source={img as any} style={styles.galleryThumb} />
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
            data={[wahana.image, wahana.image, wahana.image]}
            horizontal
            pagingEnabled
            initialScrollIndex={galleryIndex}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={item as any} style={styles.modalImage} resizeMode="contain" />
            )}
          />
        </View>
      </Modal>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomTotal}>{formatPrice(Math.round(total * 1.05))}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={onChat} style={styles.chatFloatBtn}>
          <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
        </Pressable>
        <Pressable
          onPress={() => onBuyTicket(wahana, ticketQty, Math.round(total * 1.05))}
          style={[styles.buyButton, !wahana.available && { opacity: 0.5 }]}
          disabled={!wahana.available}
        >
          <LinearGradient
            colors={wahana.available ? COLORS.gradientOcean as any : [COLORS.gray300, COLORS.gray400]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.buyGradient}
          >
            <Ionicons name="ticket-outline" size={18} color={COLORS.white} />
            <Text style={styles.buyText}>{wahana.available ? 'Beli Tiket' : 'Tidak Tersedia'}</Text>
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

  // Hero
  heroImage: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' },

  // Content Card
  contentCard: {
    marginTop: -24, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxl,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  catBadge: { backgroundColor: COLORS.teal + '12', paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.round },
  catBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.teal, letterSpacing: 0.8 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  wahanaName: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 24, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.lg },
  locationText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500 },

  // Tab
  tabBar: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.lg, marginBottom: SPACING.xxl, flexGrow: 0 },
  tabBarContent: { padding: 4, gap: 4 },
  tabItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md },
  tabItemActive: { backgroundColor: COLORS.white, ...SHADOWS.small },
  tabText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500, fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: COLORS.primary },

  // Sections
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md, fontSize: 16 },
  descriptionText: { ...TYPOGRAPHY.body, color: COLORS.gray600, lineHeight: 24 },

  // Quick Info
  quickInfoBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, paddingVertical: SPACING.lg, marginTop: SPACING.xxl,
  },
  qiItem: { alignItems: 'center', gap: 4, flex: 1 },
  qiIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qiValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 12, textAlign: 'center' },
  qiLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 10 },
  qiDivider: { width: 1, height: 40, backgroundColor: COLORS.gray200 },

  // Detail
  detailCard: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, padding: SPACING.xl },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500, flex: 1, fontSize: 14 },
  detailValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  detailDivider: { height: 1, backgroundColor: COLORS.gray200, marginVertical: 12 },
  includesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  includeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.offWhite, paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.round,
  },
  includeText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray700 },

  // Ticket
  ticketControl: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 20, backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
  },
  ticketBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '10', alignItems: 'center', justifyContent: 'center',
  },
  ticketQty: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 26, minWidth: 36, textAlign: 'center' },

  // Cost
  costCard: { backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, padding: SPACING.xl, marginTop: SPACING.xl },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  costLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500, fontSize: 14 },
  costValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  costDivider: { height: 1, backgroundColor: COLORS.gray200, marginVertical: 8 },
  costTotalLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  costTotalValue: { ...TYPOGRAPHY.h4, color: COLORS.primary, fontSize: 16 },

  // Similar
  similarSection: { marginTop: SPACING.xxxl },
  similarList: { gap: 12, paddingBottom: SPACING.md },
  similarCard: { width: 160, backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, overflow: 'hidden' },
  similarImage: { width: 160, height: 110 },
  similarInfo: { padding: SPACING.sm },
  similarName: { ...TYPOGRAPHY.bodySm, color: COLORS.gray800, fontWeight: '600', marginBottom: 4 },
  similarMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  similarRating: { ...TYPOGRAPHY.caption, color: COLORS.gray700, fontWeight: '700', fontSize: 11 },
  similarDuration: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 10 },
  similarPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 13 },

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

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  bottomLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  bottomTotal: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  chatFloatBtn: {
    width: 46, height: 46, borderRadius: 16,
    backgroundColor: COLORS.primary + '10', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  buyButton: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  buyGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14 },
  buyText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2 },
});

export default WahanaDetailScreen;
