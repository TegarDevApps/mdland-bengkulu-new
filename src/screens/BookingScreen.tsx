import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Villa } from '../types';

interface BookingScreenProps {
  villa: Villa;
  resortName: string;
  onBack: () => void;
  onProceedPayment: (checkIn: string, checkOut: string, guests: number, totalPrice: number) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({
  villa,
  resortName,
  onBack,
  onProceedPayment,
}) => {
  const insets = useSafeAreaInsets();
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [selectedCheckIn] = useState('2026-05-10');
  const [selectedCheckOut] = useState('2026-05-13');

  // Calculate bottom bar height for proper padding
  const bottomBarHeight = 90 + insets.bottom;

  const subtotal = villa.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee + tax;
  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 20 }}
      >
        {/* Villa Summary */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.villaCard}>
          <Image source={villa.images[0]} style={styles.villaImage} />
          <View style={styles.villaInfo}>
            <Text style={styles.villaName}>{villa.name}</Text>
            <Text style={styles.resortName}>{resortName}</Text>
            <Text style={styles.villaPrice}>{formatPrice(villa.pricePerNight)}/malam</Text>
          </View>
        </Animated.View>

        {/* Date Selection */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>May 10, 2026</Text>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            </Pressable>
            <View style={styles.dateArrrow}>
              <Ionicons name="arrow-forward" size={18} color={COLORS.gray400} />
            </View>
            <Pressable style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>May 13, 2026</Text>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            </Pressable>
          </View>
          <View style={styles.nightsBadge}>
            <Ionicons name="moon-outline" size={14} color={COLORS.primary} />
            <Text style={styles.nightsText}>{nights} nights</Text>
          </View>
        </Animated.View>

        {/* Guest Selector */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Guests</Text>
          <View style={styles.guestSelector}>
            <View>
              <Text style={styles.guestLabel}>Adults</Text>
              <Text style={styles.guestSubLabel}>Max {villa.maxGuests} guests</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setGuests(Math.max(1, guests - 1))}
                style={[styles.stepperBtn, guests <= 1 && styles.stepperDisabled]}
              >
                <Ionicons name="remove" size={20} color={guests <= 1 ? COLORS.gray300 : COLORS.gray700} />
              </Pressable>
              <Text style={styles.stepperValue}>{guests}</Text>
              <Pressable
                onPress={() => setGuests(Math.min(villa.maxGuests, guests + 1))}
                style={[styles.stepperBtn, guests >= villa.maxGuests && styles.stepperDisabled]}
              >
                <Ionicons name="add" size={20} color={guests >= villa.maxGuests ? COLORS.gray300 : COLORS.gray700} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Special Requests */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>Add-ons</Text>
          {[
            { icon: 'car-outline', title: 'Airport Transfer', price: 80 },
            { icon: 'restaurant-outline', title: 'Breakfast Package', price: 45 },
            { icon: 'diamond-outline', title: 'Honeymoon Setup', price: 120 },
          ].map((addon) => (
            <Pressable key={addon.title} style={styles.addonRow}>
              <Ionicons name={addon.icon as any} size={20} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addonTitle}>{addon.title}</Text>
                <Text style={styles.addonPrice}>+{formatPrice(addon.price)}</Text>
              </View>
              <View style={styles.checkbox}>
                <Ionicons name="square-outline" size={22} color={COLORS.gray300} />
              </View>
            </Pressable>
          ))}
        </Animated.View>

        {/* Price Breakdown */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.priceBreakdown}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{formatPrice(villa.pricePerNight)} × {nights} malam</Text>
            <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Biaya layanan</Text>
            <Text style={styles.priceValue}>{formatPrice(serviceFee)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Pajak</Text>
            <Text style={styles.priceValue}>{formatPrice(tax)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomTotal}>{formatPrice(total)}</Text>
          <Text style={styles.bottomNights}>{nights} nights · {guests} guests</Text>
        </View>
        <View style={styles.bottomRight}>
          <Pressable onPress={() => onProceedPayment(selectedCheckIn, selectedCheckOut, guests, total)} style={styles.paymentBtn}>
            <LinearGradient colors={COLORS.gradientOcean as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.paymentGradient}>
              <Text style={styles.paymentText}>Pembayaran</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },

  // Villa Card
  villaCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    margin: SPACING.xl, borderRadius: RADIUS.xl,
    overflow: 'hidden', ...SHADOWS.small,
  },
  villaImage: { width: 100, height: 100 },
  villaInfo: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  villaName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  resortName: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  villaPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, marginTop: 6 },

  // Sections
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md },

  // Dates
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBox: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, gap: 4, ...SHADOWS.small,
  },
  dateLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  dateValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  dateArrrow: { padding: 4 },
  nightsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center', marginTop: SPACING.md,
    backgroundColor: COLORS.primary + '10', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.round,
  },
  nightsText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  // Guests
  guestSelector: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  guestLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  guestSubLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepperBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.gray50, borderWidth: 1, borderColor: COLORS.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperDisabled: { opacity: 0.5 },
  stepperValue: { ...TYPOGRAPHY.h4, color: COLORS.gray800, minWidth: 24, textAlign: 'center' },

  // Add-ons
  addonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  addonTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  addonPrice: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  checkbox: {},

  // Price
  priceBreakdown: {
    paddingHorizontal: SPACING.xl, backgroundColor: COLORS.white,
    paddingVertical: SPACING.xl, marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl, ...SHADOWS.small,
  },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  priceLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500 },
  priceValue: { ...TYPOGRAPHY.body, color: COLORS.gray700 },
  totalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.gray100,
    paddingTop: SPACING.md, marginTop: SPACING.sm,
  },
  totalLabel: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  totalValue: { ...TYPOGRAPHY.h3, color: COLORS.primary },

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray100,
    ...SHADOWS.large,
  },
  bottomLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  bottomTotal: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontSize: 18 },
  bottomNights: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2, fontSize: 11 },
  bottomRight: {
    flexShrink: 0,
  },
  paymentBtn: { borderRadius: RADIUS.lg, overflow: 'hidden' },
  paymentGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  paymentText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 14 },
});

export default BookingScreen;
