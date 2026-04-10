import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, FlatList, Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface PaymentHistoryScreenProps {
  onBack: () => void;
}

type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';
type PaymentCategory = 'villa' | 'wahana' | 'food' | 'event';

interface PaymentItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  time: string;
  status: PaymentStatus;
  category: PaymentCategory;
  method: string;
  refId: string;
}

const STATUS_CONFIG: Record<PaymentStatus, { color: string; icon: string; label: string }> = {
  success: { color: COLORS.success, icon: 'checkmark-circle', label: 'Berhasil' },
  pending: { color: COLORS.warning, icon: 'time', label: 'Menunggu' },
  failed: { color: COLORS.error, icon: 'close-circle', label: 'Gagal' },
  refunded: { color: COLORS.info, icon: 'refresh-circle', label: 'Refund' },
};

const CATEGORY_CONFIG: Record<PaymentCategory, { icon: string; color: string }> = {
  villa: { icon: 'home', color: COLORS.primary },
  wahana: { icon: 'flash', color: COLORS.coral },
  food: { icon: 'restaurant', color: COLORS.accent },
  event: { icon: 'musical-notes', color: COLORS.teal },
};

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'success', label: 'Berhasil' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'refunded', label: 'Refund' },
];

const MOCK_PAYMENTS: PaymentItem[] = [
  { id: 'p1', title: 'Ocean Breeze Villa', subtitle: '2 malam · 2 tamu', amount: 5000000, date: '05 Apr 2026', time: '14:23', status: 'success', category: 'villa', method: 'BCA Virtual Account', refId: 'TXN-20260405-001' },
  { id: 'p2', title: 'Jet Ski Adventure', subtitle: '2 tiket', amount: 700000, date: '03 Apr 2026', time: '10:15', status: 'success', category: 'wahana', method: 'GoPay', refId: 'TXN-20260403-002' },
  { id: 'p3', title: 'Sunset Sessions', subtitle: '1 tiket', amount: 150000, date: '02 Apr 2026', time: '18:30', status: 'pending', category: 'event', method: 'OVO', refId: 'TXN-20260402-003' },
  { id: 'p4', title: 'MDLAND Ocean Kitchen', subtitle: '3 menu', amount: 235000, date: '01 Apr 2026', time: '12:45', status: 'success', category: 'food', method: 'DANA', refId: 'TXN-20260401-004' },
  { id: 'p5', title: 'Flyboard Experience', subtitle: '1 tiket', amount: 500000, date: '28 Mar 2026', time: '09:00', status: 'refunded', category: 'wahana', method: 'BCA Virtual Account', refId: 'TXN-20260328-005' },
  { id: 'p6', title: 'Garden Retreat Villa', subtitle: '3 malam · 2 tamu', amount: 4500000, date: '25 Mar 2026', time: '16:10', status: 'success', category: 'villa', method: 'Mandiri Virtual Account', refId: 'TXN-20260325-006' },
  { id: 'p7', title: 'Beach Grill & Bar', subtitle: '5 menu', amount: 185000, date: '24 Mar 2026', time: '19:20', status: 'success', category: 'food', method: 'GoPay', refId: 'TXN-20260324-007' },
  { id: 'p8', title: 'Full Moon Beach Party', subtitle: '2 tiket', amount: 350000, date: '22 Mar 2026', time: '20:00', status: 'failed', category: 'event', method: 'OVO', refId: 'TXN-20260322-008' },
  { id: 'p9', title: 'Parasailing', subtitle: '2 tiket', amount: 900000, date: '20 Mar 2026', time: '11:30', status: 'success', category: 'wahana', method: 'DANA', refId: 'TXN-20260320-009' },
  { id: 'p10', title: 'Presidential Suite', subtitle: '1 malam · 2 tamu', amount: 5000000, date: '15 Mar 2026', time: '13:00', status: 'success', category: 'villa', method: 'BNI Virtual Account', refId: 'TXN-20260315-010' },
];

const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeFilter === 'all'
    ? MOCK_PAYMENTS
    : MOCK_PAYMENTS.filter(p => p.status === activeFilter);

  const totalSuccess = MOCK_PAYMENTS
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const renderPaymentItem = ({ item, index }: { item: PaymentItem; index: number }) => {
    const catConfig = CATEGORY_CONFIG[item.category];
    const statusConfig = STATUS_CONFIG[item.status];
    const isExpanded = expandedId === item.id;

    return (
      <Animated.View entering={FadeInRight.delay(index * 60).duration(400)}>
        <Pressable
          style={[styles.paymentCard, isExpanded && styles.paymentCardExpanded]}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.paymentRow}>
            <View style={[styles.catIcon, { backgroundColor: catConfig.color + '12' }]}>
              <Ionicons name={catConfig.icon as any} size={20} color={catConfig.color} />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.paymentSub}>{item.date} · {item.time}</Text>
            </View>
            <View style={styles.paymentRight}>
              <Text style={[
                styles.paymentAmount,
                item.status === 'refunded' && { color: COLORS.info },
                item.status === 'failed' && { color: COLORS.error, textDecorationLine: 'line-through' },
              ]}>
                {item.status === 'refunded' ? '+' : '-'}{formatPrice(item.amount)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '12' }]}>
                <Ionicons name={statusConfig.icon as any} size={10} color={statusConfig.color} />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
              </View>
            </View>
          </View>

          {isExpanded && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.expandedSection}>
              <View style={styles.expandDivider} />
              <View style={styles.expandRow}>
                <Text style={styles.expandLabel}>Deskripsi</Text>
                <Text style={styles.expandValue}>{item.subtitle}</Text>
              </View>
              <View style={styles.expandRow}>
                <Text style={styles.expandLabel}>Metode</Text>
                <Text style={styles.expandValue}>{item.method}</Text>
              </View>
              <View style={styles.expandRow}>
                <Text style={styles.expandLabel}>Ref ID</Text>
                <Text style={[styles.expandValue, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 12 }]}>
                  {item.refId}
                </Text>
              </View>
              {item.status === 'success' && (
                <Pressable style={styles.receiptBtn}>
                  <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.receiptBtnText}>Lihat Struk</Text>
                </Pressable>
              )}
            </Animated.View>
          )}
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
        <Text style={styles.headerTitle}>Riwayat Pembayaran</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Summary Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.summaryCard}>
        <LinearGradient
          colors={COLORS.gradientOcean as any}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
          <Text style={styles.summaryAmount}>{formatPrice(totalSuccess)}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemValue}>{MOCK_PAYMENTS.filter(p => p.status === 'success').length}</Text>
              <Text style={styles.summaryItemLabel}>Berhasil</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemValue}>{MOCK_PAYMENTS.filter(p => p.status === 'pending').length}</Text>
              <Text style={styles.summaryItemLabel}>Menunggu</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemValue}>{MOCK_PAYMENTS.filter(p => p.status === 'refunded').length}</Text>
              <Text style={styles.summaryItemLabel}>Refund</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={[styles.filterChip, activeFilter === tab.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === tab.key && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Payment List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },

  // Summary
  summaryCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  summaryGradient: { borderRadius: RADIUS.xl, padding: SPACING.xl },
  summaryLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.6)' },
  summaryAmount: { ...TYPOGRAPHY.h1, color: COLORS.white, marginTop: 4, fontSize: 28 },
  summaryRow: {
    flexDirection: 'row', marginTop: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryItemValue: { ...TYPOGRAPHY.h4, color: COLORS.white },
  summaryItemLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontSize: 10 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Filters
  filterScroll: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.md },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },

  // List
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 120, gap: SPACING.sm },

  // Payment card
  paymentCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  paymentCardExpanded: { borderColor: COLORS.primary + '30', borderWidth: 1 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  paymentInfo: { flex: 1 },
  paymentTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  paymentSub: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  paymentRight: { alignItems: 'flex-end' },
  paymentAmount: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '700', fontSize: 14 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.round, marginTop: 4,
  },
  statusText: { fontSize: 9, fontWeight: '700' },

  // Expanded
  expandedSection: { marginTop: SPACING.md },
  expandDivider: { height: 1, backgroundColor: COLORS.gray100, marginBottom: SPACING.md },
  expandRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6,
  },
  expandLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  expandValue: { ...TYPOGRAPHY.caption, color: COLORS.gray700, fontWeight: '600' },
  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: SPACING.md,
    backgroundColor: COLORS.primary + '10', borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
  },
  receiptBtnText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 13 },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: SPACING.huge },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.md },
});

export default PaymentHistoryScreen;
