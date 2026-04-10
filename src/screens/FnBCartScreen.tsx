import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { DiningItem } from '../types';

interface FnBCartScreenProps {
  items: { item: DiningItem; qty: number }[];
  total: number;
  onBack: () => void;
  onConfirm: () => void;
}

const FnBCartScreen: React.FC<FnBCartScreenProps> = ({ items, total, onBack, onConfirm }) => {
  const insets = useSafeAreaInsets();
  const [payMethod, setPayMethod] = useState('cash');
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  const methods = [
    { id: 'cash', label: 'Bayar di Kasir', icon: 'cash-outline' },
    { id: 'qris', label: 'QRIS', icon: 'qr-code-outline' },
    { id: 'transfer', label: 'Transfer Bank', icon: 'card-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Pesanan Anda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Items */}
        <Animated.View entering={FadeInDown.springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Detail Pesanan</Text>
          {items.map(({ item, qty }, index) => (
            <View key={item.id} style={[styles.orderItem, index > 0 && styles.orderItemBorder]}>
              <Image source={item.image} style={styles.itemThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{qty}x @ {formatPrice(item.price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatPrice(item.price * qty)}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Payment Method */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Metode Pembayaran</Text>
          {methods.map(method => (
            <Pressable
              key={method.id}
              onPress={() => setPayMethod(method.id)}
              style={[styles.payOption, payMethod === method.id && styles.payOptionActive]}
            >
              <Ionicons
                name={method.icon as any}
                size={20}
                color={payMethod === method.id ? COLORS.primary : COLORS.gray500}
              />
              <Text style={[styles.payLabel, payMethod === method.id && styles.payLabelActive]}>
                {method.label}
              </Text>
              <View style={[styles.radio, payMethod === method.id && styles.radioActive]}>
                {payMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          ))}
        </Animated.View>

        {/* Price Summary */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Ringkasan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya layanan (5%)</Text>
            <Text style={styles.summaryValue}>{formatPrice(serviceFee)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Total Bayar</Text>
          <Text style={styles.bottomTotal}>{formatPrice(grandTotal)}</Text>
        </View>
        <Pressable onPress={onConfirm} style={styles.confirmButton}>
          <LinearGradient
            colors={COLORS.gradientOcean as any}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmText}>Konfirmasi Pesanan</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  content: { paddingHorizontal: SPACING.xl, paddingBottom: 160 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small,
  },
  cardTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md },

  // Order items
  orderItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  orderItemBorder: { borderTopWidth: 1, borderTopColor: COLORS.gray100 },
  itemThumb: { width: 48, height: 48, borderRadius: RADIUS.md },
  itemName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 13 },
  itemQty: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11 },
  itemTotal: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 13 },

  // Payment
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg, marginBottom: 6,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  payOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  payLabel: { ...TYPOGRAPHY.body, color: COLORS.gray600, flex: 1, fontSize: 14 },
  payLabelActive: { color: COLORS.primary, fontWeight: '600' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.gray300,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  // Summary
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500, fontSize: 14 },
  summaryValue: { ...TYPOGRAPHY.body, color: COLORS.gray700, fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.gray100, paddingTop: SPACING.md, marginBottom: 0 },
  totalLabel: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  totalValue: { ...TYPOGRAPHY.h4, color: COLORS.primary },

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    ...SHADOWS.medium,
  },
  bottomInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  bottomLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  bottomTotal: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  confirmButton: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  confirmGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14 },
  confirmText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 15 },
});

export default FnBCartScreen;
