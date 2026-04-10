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
import { Event } from '../types';
import { EVENTS } from '../data/mockData';

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
  { id: '1', name: 'Yoga Aditya', avatar: 'https://i.pravatar.cc/100?img=15', rating: 5, date: '3 hari lalu', text: 'Event keren banget! Musiknya enak, suasananya seru. Venue-nya juga cantik langsung di tepi pantai.' },
  { id: '2', name: 'Rina Kartika', avatar: 'https://i.pravatar.cc/100?img=25', rating: 4, date: '1 minggu lalu', text: 'Acara sangat terorganisir. Sound system luar biasa. Minuman agak overpriced tapi overall worth it.' },
  { id: '3', name: 'Fajar Nugroho', avatar: 'https://i.pravatar.cc/100?img=53', rating: 5, date: '2 minggu lalu', text: 'Best event di Bengkulu! DJ-nya keren, crowd-nya friendly. Pasti datang lagi event berikutnya.' },
];

interface EventDetailScreenProps {
  event: Event;
  onBack: () => void;
  onBuyTicket: (event: Event, qty: number, total: number) => void;
  onChat?: () => void;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ event, onBack, onBuyTicket, onChat }) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState(false);
  const [ticketQty, setTicketQty] = useState(1);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const total = event.price * ticketQty;

  const scrollHandler = useAnimatedScrollHandler({ onScroll: e => { scrollY.value = e.contentOffset.y; } });
  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const headerBg = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 140, IMAGE_HEIGHT - 60], [0, 1], Extrapolation.CLAMP);
    return { backgroundColor: `rgba(255,255,255,${o})`, borderBottomWidth: o > 0.9 ? 1 : 0, borderBottomColor: COLORS.gray100 };
  });
  const headerTitleStyle = useAnimatedStyle(() => {
    const o = interpolate(scrollY.value, [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40], [0, 1], Extrapolation.CLAMP);
    return { opacity: o };
  });

  const similarEvents = EVENTS.filter(e => e.genre === event.genre && e.id !== event.id).slice(0, 6);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top }, headerBg]}>
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Animated.Text style={[styles.headerTitle, headerTitleStyle]} numberOfLines={1}>{event.title}</Animated.Text>
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
        <Image source={typeof event.image === 'number' ? event.image : { uri: event.image }} style={styles.heroImage} />

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Genre Badge + Attending */}
          <View style={styles.badgeRow}>
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{event.genre.toUpperCase()}</Text>
            </View>
            <View style={styles.attendingChip}>
              <Ionicons name="people-outline" size={14} color={COLORS.teal} />
              <Text style={styles.attendingText}>{event.attending} hadir</Text>
            </View>
          </View>

          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.artist && (
            <View style={styles.artistRow}>
              <Ionicons name="mic-outline" size={15} color={COLORS.primary} />
              <Text style={styles.artistText}>{event.artist}</Text>
            </View>
          )}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.gray500} />
            <Text style={styles.locationText}>{event.location}</Text>
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

          {/* Overview Tab */}
          {activeTab === 0 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Tentang Event</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>

              <View style={styles.quickInfoBar}>
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.teal + '12' }]}>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.teal} />
                  </View>
                  <Text style={styles.qiValue}>{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                  <Text style={styles.qiLabel}>Tanggal</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.primary + '12' }]}>
                    <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.qiValue}>{event.time.split(' - ')[0]}</Text>
                  <Text style={styles.qiLabel}>Mulai</Text>
                </View>
                <View style={styles.qiDivider} />
                <View style={styles.qiItem}>
                  <View style={[styles.qiIcon, { backgroundColor: COLORS.accent + '12' }]}>
                    <Ionicons name="cash-outline" size={18} color={COLORS.accent} />
                  </View>
                  <Text style={styles.qiValue}>{formatPrice(event.price)}</Text>
                  <Text style={styles.qiLabel}>Per Tiket</Text>
                </View>
              </View>

              {/* Similar Events */}
              {similarEvents.length > 0 && (
                <View style={styles.similarSection}>
                  <Text style={styles.sectionTitle}>Event Serupa</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarList}>
                    {similarEvents.map((se, index) => (
                      <Animated.View key={se.id} entering={FadeInDown.delay(index * 60).springify()}>
                        <View style={styles.similarCard}>
                          <Image source={typeof se.image === 'number' ? se.image : { uri: se.image }} style={styles.similarImage} />
                          <View style={styles.similarInfo}>
                            <Text style={styles.similarName} numberOfLines={1}>{se.title}</Text>
                            <View style={styles.similarMeta}>
                              <Ionicons name="calendar-outline" size={12} color={COLORS.gray500} />
                              <Text style={styles.similarDate}>{new Date(se.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                            </View>
                            <Text style={styles.similarPrice}>{formatPrice(se.price)}</Text>
                          </View>
                        </View>
                      </Animated.View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </Animated.View>
          )}

          {/* Details Tab */}
          {activeTab === 1 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Informasi Event</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.teal} />
                  <Text style={styles.detailLabel}>Tanggal</Text>
                  <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.detailLabel}>Waktu</Text>
                  <Text style={styles.detailValue}>{event.time} WIB</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color={COLORS.accent} />
                  <Text style={styles.detailLabel}>Lokasi</Text>
                  <Text style={styles.detailValue}>{event.location}</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Ionicons name="musical-notes-outline" size={18} color={COLORS.coral} />
                  <Text style={styles.detailLabel}>Genre</Text>
                  <Text style={styles.detailValue}>{event.genre}</Text>
                </View>
                {event.artist && (
                  <>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                      <Ionicons name="mic-outline" size={18} color={COLORS.palm} />
                      <Text style={styles.detailLabel}>Artis</Text>
                      <Text style={styles.detailValue}>{event.artist}</Text>
                    </View>
                  </>
                )}
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={18} color={COLORS.success} />
                  <Text style={styles.detailLabel}>Peserta</Text>
                  <Text style={styles.detailValue}>{event.attending} terdaftar</Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: SPACING.xxl }]}>Yang Termasuk</Text>
              <View style={styles.includesGrid}>
                {['Akses venue', 'Welcome drink', 'Sound system premium', 'Area parkir'].map(item => (
                  <View key={item} style={styles.includeChip}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.includeText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Tiket Tab */}
          {activeTab === 2 && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Text style={styles.sectionTitle}>Jumlah Tiket</Text>
              <View style={styles.ticketControl}>
                <Pressable onPress={() => setTicketQty(Math.max(1, ticketQty - 1))} style={styles.ticketBtn}>
                  <Ionicons name="remove" size={20} color={COLORS.primary} />
                </Pressable>
                <Text style={styles.ticketQty}>{ticketQty}</Text>
                <Pressable onPress={() => setTicketQty(Math.min(10, ticketQty + 1))} style={styles.ticketBtn}>
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                </Pressable>
              </View>

              <View style={styles.costCard}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>{ticketQty}x Tiket @ {formatPrice(event.price)}</Text>
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

              <View style={styles.noteRow}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.gray500} />
                <Text style={styles.noteText}>Tiket tidak dapat dikembalikan setelah pembelian</Text>
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
                  <Text style={styles.reviewAvg}>4.7</Text>
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
              <Text style={styles.sectionTitle}>Foto Event</Text>
              <View style={styles.galleryGrid}>
                <Animated.View entering={FadeInDown.delay(0).springify()}>
                  <Pressable onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
                    <Image source={typeof event.image === 'number' ? event.image : { uri: event.image }} style={styles.galleryHero} />
                  </Pressable>
                </Animated.View>
                {[event.image, event.image].map((img, i) => (
                  <Animated.View key={i} entering={FadeInDown.delay((i + 1) * 80).springify()}>
                    <Pressable onPress={() => { setGalleryIndex(i + 1); setGalleryVisible(true); }}>
                      <Image source={typeof img === 'number' ? img : { uri: img }} style={styles.galleryThumb} />
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
            data={[event.image, event.image, event.image]}
            horizontal
            pagingEnabled
            initialScrollIndex={galleryIndex}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={typeof item === 'number' ? item : { uri: item }} style={styles.modalImage} resizeMode="contain" />
            )}
          />
        </View>
      </Modal>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.bottomLabel}>Mulai dari</Text>
          <Text style={styles.bottomTotal}>{formatPrice(event.price)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={onChat} style={styles.chatFloatBtn}>
          <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
        </Pressable>
        <Pressable
          onPress={() => onBuyTicket(event, ticketQty, Math.round(total * 1.05))}
          style={styles.buyButton}
        >
          <LinearGradient
            colors={COLORS.gradientOcean as any}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.buyGradient}
          >
            <Ionicons name="ticket-outline" size={18} color={COLORS.white} />
            <Text style={styles.buyText}>Beli Tiket</Text>
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
  genreBadge: { backgroundColor: COLORS.coral + '15', paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.round },
  genreBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.coral, letterSpacing: 0.8 },
  attendingChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendingText: { ...TYPOGRAPHY.bodySm, color: COLORS.teal, fontWeight: '600', fontSize: 12 },
  eventTitle: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 24, marginBottom: 6 },
  artistRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  artistText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 14 },
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
  detailValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14, flex: 1, textAlign: 'right' },
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
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.md },
  noteText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, flex: 1 },

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

  // Similar
  similarSection: { marginTop: SPACING.xxxl },
  similarList: { gap: 12, paddingBottom: SPACING.md },
  similarCard: { width: 160, backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl, overflow: 'hidden' },
  similarImage: { width: 160, height: 110 },
  similarInfo: { padding: SPACING.sm },
  similarName: { ...TYPOGRAPHY.bodySm, color: COLORS.gray800, fontWeight: '600', marginBottom: 4 },
  similarMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  similarDate: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 10 },
  similarPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 13 },

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

export default EventDetailScreen;
