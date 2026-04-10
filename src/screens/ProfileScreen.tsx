import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import Animated, { FadeInDown, SlideInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { USER } from '../data/mockData';

const TIER_COLORS = {
  silver: COLORS.gray400,
  gold: COLORS.accentWarm,
  platinum: COLORS.primary,
};

const MENU_ITEMS = [
  { icon: 'person-outline', title: 'Personal Info', subtitle: 'Name, email, phone', key: 'personalInfo' },
  { icon: 'receipt-outline', title: 'Riwayat Pembayaran', subtitle: 'History transaksi', key: 'paymentHistory' },
  { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Alerts and preferences', key: 'notifications' },
  { icon: 'chatbubble-ellipses-outline', title: 'Chat', subtitle: 'Pesan & percakapan', key: 'chat' },
  { icon: 'shield-outline', title: 'Privacy & Security', subtitle: 'Password, 2FA', key: 'privacy' },
  { icon: 'language-outline', title: 'Language & Region', subtitle: 'English, USD', key: 'language' },
  { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'FAQs, contact us', key: 'help' },
  { icon: 'document-text-outline', title: 'Terms & Policies', subtitle: 'Legal information', key: 'terms' },
];

interface ProfileScreenProps {
  onNavigatePersonalInfo?: () => void;
  onNavigatePaymentHistory?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateChat?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateLanguage?: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onSignOut?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigatePersonalInfo,
  onNavigatePaymentHistory,
  onNavigateNotifications,
  onNavigateChat,
  onNavigatePrivacy,
  onNavigateLanguage,
  onNavigateHelp,
  onNavigateTerms,
  onSignOut,
}) => {
  const insets = useSafeAreaInsets();
  const tierColor = TIER_COLORS[USER.tier];
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.springify()} style={styles.profileHeader}>
          <Image source={USER.avatar} style={styles.avatar} />
          <Text style={styles.userName}>{USER.name}</Text>
          <Text style={styles.userEmail}>{USER.email}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '15' }]}>
            <Ionicons name="diamond" size={14} color={tierColor} />
            <Text style={[styles.tierText, { color: tierColor }]}>
              {USER.tier.toUpperCase()} MEMBER
            </Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{USER.bookingsCount}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2024</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </Animated.View>

        {/* Loyalty Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.loyaltyCard}>
          <LinearGradient
            colors={COLORS.gradientOcean as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loyaltyGradient}
          >
            <View style={styles.loyaltyHeader}>
              <Text style={styles.loyaltyBrand}>MDLAND</Text>
              <Ionicons name="diamond" size={20} color="rgba(255,255,255,0.5)" />
            </View>
            <Text style={styles.loyaltyName}>{USER.name}</Text>
            <View style={styles.loyaltyFooter}>
              <View>
                <Text style={styles.loyaltyLabel}>MEMBER ID</Text>
                <Text style={styles.loyaltyValue}>MDL-{USER.id.toUpperCase()}-PLT</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.loyaltyLabel}>POINTS</Text>
                <Text style={styles.loyaltyValue}>24,500</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, index) => (
            <Animated.View key={item.title} entering={FadeInDown.delay(300 + index * 50)}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  if (item.key === 'personalInfo') onNavigatePersonalInfo?.();
                  else if (item.key === 'paymentHistory') onNavigatePaymentHistory?.();
                  else if (item.key === 'notifications') onNavigateNotifications?.();
                  else if (item.key === 'chat') onNavigateChat?.();
                  else if (item.key === 'privacy') onNavigatePrivacy?.();
                  else if (item.key === 'language') onNavigateLanguage?.();
                  else if (item.key === 'help') onNavigateHelp?.();
                  else if (item.key === 'terms') onNavigateTerms?.();
                }}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.gray600} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.logoutContainer}>
          <Pressable style={styles.logoutButton} onPress={() => setShowSignOutModal(true)}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
          <Text style={styles.versionText}>MDLAND v1.0.0 · Build 2026.04</Text>
        </Animated.View>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal visible={showSignOutModal} transparent animationType="none" statusBarTranslucent>
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.modalOverlay}
        >
          <Animated.View entering={SlideInDown.springify()} style={[styles.modalCard, { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 16 }]}>

            {/* Icon */}
            <View style={styles.modalIconWrap}>
              <LinearGradient colors={[COLORS.error + '25', COLORS.error + '08']} style={styles.modalIconBg}>
                <Ionicons name="log-out-outline" size={32} color={COLORS.error} />
              </LinearGradient>
            </View>

            <Text style={styles.modalTitle}>Keluar dari Akun?</Text>
            <Text style={styles.modalSubtitle}>
              Anda akan keluar dari akun MDLAND ini. Data pemesanan & preferensi tetap tersimpan.
            </Text>

            {/* User Preview */}
            <View style={styles.modalUserPreview}>
              <Image source={USER.avatar} style={styles.modalAvatar} />
              <View>
                <Text style={styles.modalUserName}>{USER.name}</Text>
                <Text style={styles.modalUserEmail}>{USER.email}</Text>
              </View>
            </View>

            {/* Actions */}
            <Pressable
              style={styles.signOutConfirmBtn}
              onPress={() => {
                setShowSignOutModal(false);
                onSignOut?.();
              }}
            >
              <LinearGradient
                colors={[COLORS.error, '#FF453A']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.signOutConfirmGrad}
              >
                <Ionicons name="log-out-outline" size={18} color={COLORS.white} />
                <Text style={styles.signOutConfirmText}>Ya, Keluar Sekarang</Text>
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => setShowSignOutModal(false)}>
              <Text style={styles.cancelBtnText}>Batal, Tetap Di Sini</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  // Profile Header
  profileHeader: { alignItems: 'center', paddingTop: SPACING.xxl, paddingBottom: SPACING.xl },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: COLORS.primary, marginBottom: SPACING.lg,
  },
  userName: { ...TYPOGRAPHY.h2, color: COLORS.gray800 },
  userEmail: { ...TYPOGRAPHY.bodySm, color: COLORS.gray500, marginTop: 4 },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.round, marginTop: SPACING.md,
  },
  tierText: { ...TYPOGRAPHY.overline, fontSize: 10 },

  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    marginHorizontal: SPACING.xl, borderRadius: RADIUS.xl,
    padding: SPACING.xl, ...SHADOWS.small,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: COLORS.gray100 },

  // Loyalty
  loyaltyCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.xl },
  loyaltyGradient: { borderRadius: RADIUS.xl, padding: SPACING.xl },
  loyaltyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xxl },
  loyaltyBrand: { ...TYPOGRAPHY.h4, color: COLORS.white, letterSpacing: 4 },
  loyaltyName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, marginBottom: SPACING.xl },
  loyaltyFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  loyaltyLabel: { ...TYPOGRAPHY.overline, color: 'rgba(255,255,255,0.6)', fontSize: 9 },
  loyaltyValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, marginTop: 4 },

  // Menu
  menu: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.gray50, alignItems: 'center', justifyContent: 'center',
  },
  menuTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  menuSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },

  // Logout
  logoutContainer: { alignItems: 'center', marginTop: SPACING.xxxl, paddingBottom: SPACING.xl },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  logoutText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.error },
  versionText: { ...TYPOGRAPHY.caption, color: COLORS.gray300, marginTop: SPACING.md },

  // Sign Out Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: 40,
    alignItems: 'center',
  },
  modalIconWrap: { marginBottom: SPACING.lg },
  modalIconBg: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray800, textAlign: 'center', marginBottom: SPACING.sm },
  modalSubtitle: {
    ...TYPOGRAPHY.body, color: COLORS.gray400, textAlign: 'center',
    lineHeight: 22, marginBottom: SPACING.xl,
  },
  modalUserPreview: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    alignSelf: 'stretch', marginBottom: SPACING.xxl,
  },
  modalAvatar: { width: 44, height: 44, borderRadius: 22 },
  modalUserName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '600' },
  modalUserEmail: { ...TYPOGRAPHY.bodySm, color: COLORS.gray400 },
  signOutConfirmBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', alignSelf: 'stretch' },
  signOutConfirmGrad: {
    height: 54, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: SPACING.sm,
  },
  signOutConfirmText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontWeight: '700' },
  cancelBtn: { paddingVertical: SPACING.lg, alignSelf: 'stretch', alignItems: 'center' },
  cancelBtnText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray500 },
});

export default ProfileScreen;
