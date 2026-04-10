import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInDown,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface PrivacySecurityScreenProps {
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PrivacySecurityScreen: React.FC<PrivacySecurityScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [twoFA, setTwoFA] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [loginNotif, setLoginNotif] = useState(true);
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const SESSIONS = [
    { device: 'iPhone 14 Pro', location: 'Bengkulu, ID', time: 'Sekarang', current: true, icon: 'phone-portrait-outline' },
    { device: 'MacBook Pro', location: 'Jakarta, ID', time: '2 jam lalu', current: false, icon: 'laptop-outline' },
    { device: 'iPad Air', location: 'Bengkulu, ID', time: '1 hari lalu', current: false, icon: 'tablet-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <LinearGradient
            colors={['#0A84FF', '#5856D6']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <Ionicons name="shield-checkmark" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.heroTitle}>Your Account is Protected</Text>
            <Text style={styles.heroSubtitle}>2FA active · Last checked just now</Text>
          </LinearGradient>
        </Animated.View>

        {/* Section: Account Security */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Text style={styles.sectionLabel}>KEAMANAN AKUN</Text>
          <View style={[styles.card, SHADOWS.small]}>

            {/* Change Password */}
            <Pressable style={styles.row} onPress={() => setShowChangePwModal(true)}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Ganti Password</Text>
                <Text style={styles.rowSub}>Perbarui password secara berkala</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray300} />
            </Pressable>

            <View style={styles.divider} />

            {/* 2FA */}
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#5856D6' + '15' }]}>
                <Ionicons name="key-outline" size={18} color="#5856D6" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
                <Text style={styles.rowSub}>{twoFA ? 'Aktif via SMS' : 'Nonaktif'}</Text>
              </View>
              <Switch
                value={twoFA}
                onValueChange={setTwoFA}
                trackColor={{ false: COLORS.gray200, true: COLORS.primary + '60' }}
                thumbColor={twoFA ? COLORS.primary : COLORS.white}
                ios_backgroundColor={COLORS.gray200}
              />
            </View>

            <View style={styles.divider} />

            {/* Login notification */}
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.success + '15' }]}>
                <Ionicons name="notifications-outline" size={18} color={COLORS.success} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Notifikasi Login</Text>
                <Text style={styles.rowSub}>Alert jika ada login baru</Text>
              </View>
              <Switch
                value={loginNotif}
                onValueChange={setLoginNotif}
                trackColor={{ false: COLORS.gray200, true: COLORS.success + '60' }}
                thumbColor={loginNotif ? COLORS.success : COLORS.white}
                ios_backgroundColor={COLORS.gray200}
              />
            </View>
          </View>
        </Animated.View>

        {/* Section: Active Sessions */}
        <Animated.View entering={FadeInDown.delay(220).springify()}>
          <Text style={styles.sectionLabel}>SESI AKTIF</Text>
          <View style={[styles.card, SHADOWS.small]}>
            {SESSIONS.map((session, i) => (
              <View key={i}>
                <View style={styles.sessionRow}>
                  <View style={[styles.rowIcon, { backgroundColor: session.current ? COLORS.primary + '15' : COLORS.gray100 }]}>
                    <Ionicons name={session.icon as any} size={18} color={session.current ? COLORS.primary : COLORS.gray500} />
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.sessionTitleRow}>
                      <Text style={styles.rowTitle}>{session.device}</Text>
                      {session.current && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>Ini</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.rowSub}>{session.location} · {session.time}</Text>
                  </View>
                  {!session.current && (
                    <Pressable style={styles.revokeBtn}>
                      <Text style={styles.revokeBtnText}>Cabut</Text>
                    </Pressable>
                  )}
                </View>
                {i < SESSIONS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Section: Privacy */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.sectionLabel}>PRIVASI</Text>
          <View style={[styles.card, SHADOWS.small]}>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.teal + '15' }]}>
                <Ionicons name="location-outline" size={18} color={COLORS.teal} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Akses Lokasi</Text>
                <Text style={styles.rowSub}>Untuk fitur peta & rekomendasi</Text>
              </View>
              <Switch
                value={locationAccess}
                onValueChange={setLocationAccess}
                trackColor={{ false: COLORS.gray200, true: COLORS.teal + '60' }}
                thumbColor={locationAccess ? COLORS.teal : COLORS.white}
                ios_backgroundColor={COLORS.gray200}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.accent + '15' }]}>
                <Ionicons name="analytics-outline" size={18} color={COLORS.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Pengumpulan Data</Text>
                <Text style={styles.rowSub}>Untuk meningkatkan layanan</Text>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{ false: COLORS.gray200, true: COLORS.accent + '60' }}
                thumbColor={dataCollection ? COLORS.accent : COLORS.white}
                ios_backgroundColor={COLORS.gray200}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#FF9F0A' + '15' }]}>
                <Ionicons name="megaphone-outline" size={18} color="#FF9F0A" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Iklan Dipersonalisasi</Text>
                <Text style={styles.rowSub}>Penawaran sesuai preferensi</Text>
              </View>
              <Switch
                value={personalizedAds}
                onValueChange={setPersonalizedAds}
                trackColor={{ false: COLORS.gray200, true: '#FF9F0A' + '60' }}
                thumbColor={personalizedAds ? '#FF9F0A' : COLORS.white}
                ios_backgroundColor={COLORS.gray200}
              />
            </View>
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(380).springify()}>
          <Text style={styles.sectionLabel}>ZONA BERBAHAYA</Text>
          <View style={[styles.card, SHADOWS.small]}>
            <Pressable style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.error + '15' }]}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: COLORS.error }]}>Hapus Akun</Text>
                <Text style={styles.rowSub}>Tindakan ini tidak dapat dibatalkan</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.error + '80'} />
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showChangePwModal} transparent animationType="none" statusBarTranslucent>
        <Animated.View entering={FadeInDown.springify()} exiting={FadeOut.duration(200)} style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', padding: SPACING.xl }}>
            <Animated.View entering={SlideInDown.springify()} style={[styles.modalCard, SHADOWS.large]}>
              <View style={styles.modalHeader}>
                <View style={[styles.rowIcon, { backgroundColor: COLORS.primary + '15', width: 48, height: 48, borderRadius: RADIUS.md }]}>
                  <Ionicons name="lock-closed" size={22} color={COLORS.primary} />
                </View>
                <Pressable onPress={() => setShowChangePwModal(false)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={20} color={COLORS.gray500} />
                </Pressable>
              </View>
              <Text style={styles.modalTitle}>Ganti Password</Text>
              <Text style={styles.modalSubtitle}>Buat password baru yang kuat dan unik</Text>

              {[
                { label: 'Password Saat Ini', value: currentPw, setter: setCurrentPw, show: showCurrentPw, toggle: setShowCurrentPw },
                { label: 'Password Baru', value: newPw, setter: setNewPw, show: showNewPw, toggle: setShowNewPw },
                { label: 'Konfirmasi Password', value: confirmPw, setter: setConfirmPw, show: showConfirmPw, toggle: setShowConfirmPw },
              ].map((field, i) => (
                <View key={i} style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      value={field.value}
                      onChangeText={field.setter}
                      secureTextEntry={!field.show}
                      style={styles.modalInput}
                      placeholderTextColor={COLORS.gray400}
                      placeholder="••••••••"
                    />
                    <Pressable onPress={() => field.toggle(!field.show)} style={styles.eyeBtn}>
                      <Ionicons name={field.show ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.gray400} />
                    </Pressable>
                  </View>
                </View>
              ))}

              <Pressable
                style={styles.modalSaveBtn}
                onPress={() => setShowChangePwModal(false)}
              >
                <LinearGradient colors={COLORS.gradientOcean as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalSaveBtnGrad}>
                  <Text style={styles.modalSaveBtnText}>Simpan Password</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={() => setShowChangePwModal(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Batal</Text>
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
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
    width: 40, height: 40, borderRadius: RADIUS.round,
    backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontWeight: '700' },

  heroBanner: {
    margin: SPACING.lg, borderRadius: RADIUS.xxl,
    padding: SPACING.xxl, alignItems: 'center', gap: SPACING.sm,
  },
  heroTitle: { ...TYPOGRAPHY.h4, color: COLORS.white, textAlign: 'center', fontWeight: '700' },
  heroSubtitle: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },

  sectionLabel: {
    ...TYPOGRAPHY.overline, color: COLORS.gray400, fontWeight: '700',
    marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, marginTop: SPACING.lg,
  },
  card: {
    marginHorizontal: SPACING.lg, backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, gap: SPACING.md,
  },
  rowIcon: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '600' },
  rowSub: { ...TYPOGRAPHY.bodySmall, color: COLORS.gray400, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginHorizontal: SPACING.lg },

  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, gap: SPACING.md,
  },
  sessionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  currentBadge: {
    backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.success },
  revokeBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.error + '40',
  },
  revokeBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.error },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: RADIUS.round,
    backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontWeight: '700', marginBottom: SPACING.xs },
  modalSubtitle: { ...TYPOGRAPHY.bodySmall, color: COLORS.gray400, marginBottom: SPACING.xl },
  inputWrapper: { marginBottom: SPACING.lg },
  inputLabel: { ...TYPOGRAPHY.bodySmall, color: COLORS.gray600, fontWeight: '600', marginBottom: SPACING.sm },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.gray200, paddingHorizontal: SPACING.lg,
  },
  modalInput: {
    flex: 1, height: 50,
    ...TYPOGRAPHY.body, color: COLORS.gray800,
  },
  eyeBtn: { padding: SPACING.sm },
  modalSaveBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: SPACING.md },
  modalSaveBtnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  modalSaveBtnText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontWeight: '700' },
  modalCancelBtn: { alignItems: 'center', paddingVertical: SPACING.lg },
  modalCancelText: { ...TYPOGRAPHY.body, color: COLORS.gray400 },
});

export default PrivacySecurityScreen;
