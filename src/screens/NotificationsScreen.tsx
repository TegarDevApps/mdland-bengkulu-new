import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, Pressable, FlatList, Image,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeOut, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface NotificationsScreenProps {
  onBack: () => void;
}

type NotifType = 'booking' | 'promo' | 'system' | 'event' | 'payment';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
}

const TYPE_CONFIG: Record<NotifType, { icon: string; color: string }> = {
  booking: { icon: 'bed-outline', color: COLORS.primary },
  promo: { icon: 'pricetag-outline', color: COLORS.accent },
  system: { icon: 'settings-outline', color: COLORS.gray600 },
  event: { icon: 'musical-notes-outline', color: COLORS.teal },
  payment: { icon: 'card-outline', color: COLORS.success },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'booking', title: 'Booking Confirmed!', message: 'Ocean Breeze Villa untuk 10-12 Mei 2026 telah dikonfirmasi. Selamat berlibur!', time: '2 menit lalu', read: false, image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=200' },
  { id: 'n2', type: 'promo', title: 'Flash Sale! Diskon 30%', message: 'Nikmati diskon 30% untuk semua wahana air hari ini saja. Jangan sampai terlewat!', time: '15 menit lalu', read: false, image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=200' },
  { id: 'n3', type: 'payment', title: 'Pembayaran Berhasil', message: 'Pembayaran Rp 700.000 untuk Jet Ski Adventure telah diterima.', time: '1 jam lalu', read: false },
  { id: 'n4', type: 'event', title: 'Sunset Sessions Malam Ini!', message: 'Jangan lupa! Live DJ spinning deep house mulai pukul 17:00 di Beach Club.', time: '3 jam lalu', read: true, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 'n5', type: 'system', title: 'Verifikasi KTP', message: 'Lengkapi verifikasi identitas Anda untuk keamanan akun yang lebih baik.', time: '5 jam lalu', read: true },
  { id: 'n6', type: 'promo', title: 'Weekend Special Package', message: 'Paket villa + wahana + dinner hanya Rp 3.500.000 untuk weekend ini!', time: '1 hari lalu', read: true, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200' },
  { id: 'n7', type: 'booking', title: 'Review Pengalaman Anda', message: 'Bagaimana pengalaman Anda di Garden Retreat Villa? Berikan rating Anda.', time: '2 hari lalu', read: true },
  { id: 'n8', type: 'payment', title: 'Refund Diproses', message: 'Refund Rp 500.000 untuk Flyboard Experience sedang diproses (3-5 hari kerja).', time: '3 hari lalu', read: true },
  { id: 'n9', type: 'event', title: 'Event Baru: Jazz & Wine', message: 'Pertunjukan jazz elegan dengan wine tasting tanggal 25 April. Pesan tiket sekarang!', time: '4 hari lalu', read: true, image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200' },
  { id: 'n10', type: 'system', title: 'Update Aplikasi', message: 'MDLAND v1.1 tersedia dengan fitur peta interaktif baru. Update sekarang!', time: '1 minggu lalu', read: true },
];

const FILTER_TABS = [
  { key: 'all', label: 'Semua', icon: 'apps-outline' },
  { key: 'booking', label: 'Booking', icon: 'bed-outline' },
  { key: 'promo', label: 'Promo', icon: 'pricetag-outline' },
  { key: 'payment', label: 'Payment', icon: 'card-outline' },
  { key: 'event', label: 'Event', icon: 'musical-notes-outline' },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const markAllRead = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const deleteNotif = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => {
    const config = TYPE_CONFIG[item.type];

    return (
      <Animated.View
        entering={FadeInRight.delay(index * 50).duration(350)}
        exiting={FadeOut.duration(250)}
        layout={Layout.springify().damping(18)}
      >
        <Pressable
          style={[styles.notifCard, !item.read && styles.notifCardUnread]}
          onPress={() => markAsRead(item.id)}
        >
          <View style={styles.notifRow}>
            {/* Icon or image */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.notifImage} />
            ) : (
              <View style={[styles.notifIcon, { backgroundColor: config.color + '12' }]}>
                <Ionicons name={config.icon as any} size={20} color={config.color} />
              </View>
            )}

            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
              <View style={styles.notifFooter}>
                <View style={styles.notifTypeBadge}>
                  <Ionicons name={config.icon as any} size={10} color={config.color} />
                  <Text style={[styles.notifTypeText, { color: config.color }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                </View>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            </View>

            <Pressable onPress={() => deleteNotif(item.id)} style={styles.deleteBtn} hitSlop={8}>
              <Ionicons name="close" size={16} color={COLORS.gray400} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray700} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <Pressable onPress={markAllRead} style={styles.markAllBtn}>
            <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </Animated.View>

      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          keyExtractor={t => t.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item: tab }) => (
            <Pressable
              onPress={() => setActiveFilter(tab.key)}
              style={[styles.filterChip, activeFilter === tab.key && styles.filterChipActive]}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={activeFilter === tab.key ? COLORS.white : COLORS.gray500}
              />
              <Text style={[styles.filterText, activeFilter === tab.key && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          )}
        />
      </Animated.View>

      {/* Notification List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={56} color={COLORS.gray300} />
            <Text style={styles.emptyTitle}>Tidak Ada Notifikasi</Text>
            <Text style={styles.emptyText}>Semua sudah terlihat. Nikmati liburanmu!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  headerBadge: {
    backgroundColor: COLORS.coral, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  markAllBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center', justifyContent: 'center',
  },

  // Filters
  filterScroll: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, paddingBottom: SPACING.md },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },

  // List
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 120, gap: SPACING.sm },

  // Notification card
  notifCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  notifCardUnread: {
    backgroundColor: COLORS.primary + '06',
    borderLeftWidth: 3, borderLeftColor: COLORS.primary,
  },
  notifRow: { flexDirection: 'row', gap: 12 },
  notifImage: { width: 50, height: 50, borderRadius: 14 },
  notifIcon: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray700, flex: 1 },
  notifTitleUnread: { color: COLORS.gray800, fontWeight: '700' },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
  },
  notifMessage: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 4, lineHeight: 18 },
  notifFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 8,
  },
  notifTypeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.round, backgroundColor: COLORS.gray50,
  },
  notifTypeText: { fontSize: 9, fontWeight: '700' },
  notifTime: { ...TYPOGRAPHY.caption, color: COLORS.gray400, fontSize: 11 },
  deleteBtn: { padding: 4, marginTop: -4 },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: SPACING.huge },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray500, marginTop: SPACING.lg },
  emptyText: { ...TYPOGRAPHY.caption, color: COLORS.gray400, marginTop: 4 },
});

export default NotificationsScreen;
