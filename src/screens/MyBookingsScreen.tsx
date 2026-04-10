import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { BOOKINGS } from '../data/mockData';
import { Booking } from '../types';

const STATUS_CONFIG: Record<string, { color: string; icon: string; bg: string }> = {
  upcoming: { color: COLORS.primary, icon: 'time-outline', bg: COLORS.primary + '10' },
  active: { color: COLORS.success, icon: 'checkmark-circle', bg: COLORS.success + '10' },
  completed: { color: COLORS.gray500, icon: 'checkmark-done', bg: COLORS.gray100 },
  cancelled: { color: COLORS.error, icon: 'close-circle', bg: COLORS.error + '10' },
};

const MyBookingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const renderBooking = ({ item, index }: { item: Booking; index: number }) => {
    const status = STATUS_CONFIG[item.status];
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <Pressable style={styles.bookingCard}>
          <Image source={item.image} style={styles.bookingImage} />
          <View style={styles.bookingContent}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon as any} size={12} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.bookingVilla} numberOfLines={1}>
              {item.villaName || item.wahanaName || 'Pesanan F&B'}
            </Text>
            <Text style={styles.bookingResort}>MDLAND Bengkulu</Text>
            <View style={styles.bookingDates}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.gray500} />
              <Text style={styles.bookingDateText}>
                {item.checkIn
                  ? `${new Date(item.checkIn).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} – ${new Date(item.checkOut!).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : item.date || '-'}
              </Text>
            </View>
            <View style={styles.bookingFooter}>
              <Text style={styles.bookingPrice}>Rp {item.totalPrice.toLocaleString('id-ID')}</Text>
              <Text style={styles.bookingGuests}>{item.guests} tamu</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Booking Saya</Text>
        <Text style={styles.subtitle}>{BOOKINGS.length} pesanan</Text>
      </View>

      <FlatList
        data={BOOKINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>Start planning your dream vacation</Text>
          </View>
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

  bookingCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, overflow: 'hidden',
    marginBottom: SPACING.lg, ...SHADOWS.small,
  },
  bookingImage: { width: 110, height: 150 },
  bookingContent: { flex: 1, padding: SPACING.md },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.round, alignSelf: 'flex-start',
    marginBottom: 6,
  },
  statusText: { ...TYPOGRAPHY.overline, fontSize: 9 },
  bookingVilla: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  bookingResort: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  bookingDates: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  bookingDateText: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  bookingFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
  bookingPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontWeight: '700' },
  bookingGuests: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },

  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray400, marginTop: SPACING.lg },
  emptySubtitle: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: 4 },
});

export default MyBookingsScreen;
