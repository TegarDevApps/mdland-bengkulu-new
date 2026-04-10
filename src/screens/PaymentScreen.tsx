import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import AnimatedButton from '../components/common/AnimatedButton';

interface PaymentScreenProps {
  totalPrice: number;
  onBack: () => void;
  onConfirm: () => void;
}

const PAYMENT_METHODS = [
  { id: 'card', icon: 'card-outline', title: 'Credit Card', subtitle: '**** 4242' },
  { id: 'apple', icon: 'logo-apple', title: 'Apple Pay', subtitle: 'Instant payment' },
  { id: 'google', icon: 'logo-google', title: 'Google Pay', subtitle: 'Instant payment' },
  { id: 'paypal', icon: 'wallet-outline', title: 'PayPal', subtitle: 'alex@email.com' },
];

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  totalPrice,
  onBack,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
            <Text style={styles.summaryTitle}>Order Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(Math.round(totalPrice * 0.82))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya layanan</Text>
            <Text style={styles.summaryValue}>{formatPrice(Math.round(totalPrice * 0.1))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pajak</Text>
            <Text style={styles.summaryValue}>{formatPrice(Math.round(totalPrice * 0.08))}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method, index) => (
            <Animated.View key={method.id} entering={FadeInDown.delay(250 + index * 60)}>
              <Pressable
                onPress={() => setSelectedMethod(method.id)}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardActive,
                ]}
              >
                <View style={[
                  styles.methodIcon,
                  selectedMethod === method.id && styles.methodIconActive,
                ]}>
                  <Ionicons
                    name={method.icon as any}
                    size={22}
                    color={selectedMethod === method.id ? COLORS.white : COLORS.gray600}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
                <View style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioActive,
                ]}>
                  {selectedMethod === method.id && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Secure Badge */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.secureBadge}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.secureText}>Your payment is secured with 256-bit SSL encryption</Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}>
        <AnimatedButton
          title={`Bayar ${formatPrice(totalPrice)}`}
          onPress={onConfirm}
          variant="gradient"
          size="lg"
          fullWidth
          gradientColors={COLORS.gradientOcean as any}
        />
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
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.white, margin: SPACING.xl,
    borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.small,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.lg },
  summaryTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md,
  },
  summaryLabel: { ...TYPOGRAPHY.body, color: COLORS.gray500 },
  summaryValue: { ...TYPOGRAPHY.body, color: COLORS.gray700 },
  summaryTotal: {
    borderTopWidth: 1, borderTopColor: COLORS.gray100,
    paddingTop: SPACING.md, marginTop: SPACING.sm,
  },
  totalLabel: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  totalValue: { ...TYPOGRAPHY.h3, color: COLORS.primary },

  // Section
  section: { paddingHorizontal: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md },

  // Method cards
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.gray100,
  },
  methodCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '05' },
  methodIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.gray50, alignItems: 'center', justifyContent: 'center',
  },
  methodIconActive: { backgroundColor: COLORS.primary },
  methodTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  methodSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.gray300,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },

  // Secure
  secureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.xl, marginTop: SPACING.xl,
  },
  secureText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, flex: 1 },

  // Bottom
  bottomBar: {
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray100,
  },
});

export default PaymentScreen;
