import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface HelpSupportScreenProps {
  onBack: () => void;
}

const FAQS = [
  {
    q: 'Bagaimana cara booking villa di MDLAND?',
    a: 'Pilih villa di menu Villa, klik "Pesan Sekarang", pilih tanggal check-in & check-out, isi jumlah tamu, lalu klik "Lanjutkan ke Pembayaran". Pembayaran dapat dilakukan melalui transfer bank, kartu kredit, atau e-wallet.',
  },
  {
    q: 'Apakah bisa refund jika batalkan booking?',
    a: 'Pembatalan lebih dari 7 hari sebelum check-in mendapat refund 100%. Pembatalan 3-7 hari: refund 50%. Pembatalan kurang dari 3 hari: tidak ada refund. Deposit non-refundable.',
  },
  {
    q: 'Fasilitas apa saja yang tersedia di MDLAND?',
    a: 'MDLAND menyediakan kolam renang infinity, beach club, wahana air (jet ski, flyboard, parasailing), spa & wellness center, beberapa restoran, area parkir, dan Kids Zone. Semua fasilitas dapat diakses tamu selama menginap.',
  },
  {
    q: 'Berapa kapasitas maksimum tamu per villa?',
    a: 'Kapasitas tergantung tipe villa. Standard: 2 tamu. Deluxe: 2-6 tamu. Premium: 4-8 tamu. Suite: 2-4 tamu. Silakan cek detail villa untuk informasi kapasitas spesifik.',
  },
  {
    q: 'Apakah ada layanan antar-jemput bandara?',
    a: 'Ya! MDLAND menyediakan layanan shuttle dari dan ke Bandara Fatmawati Soekarno Bengkulu. Biaya Rp 150.000/perjalanan. Pesan minimal 24 jam sebelumnya melalui menu Chat atau hubungi resepsionis.',
  },
  {
    q: 'Jam check-in dan check-out?',
    a: 'Check-in: 14:00 WIB. Check-out: 12:00 WIB. Early check-in (dari 10:00) dan late check-out (sampai 15:00) tersedia dengan biaya tambahan, tergantung ketersediaan kamar.',
  },
  {
    q: 'Bagaimana menghubungi resepsionis?',
    a: 'Gunakan fitur Chat di aplikasi untuk terhubung langsung dengan resepsionis 24/7. Atau hubungi +62 736-XXX-XXX. Resepsionis selalu siap membantu kebutuhan Anda.',
  },
];

const CONTACT_OPTIONS = [
  {
    icon: 'logo-whatsapp',
    label: 'WhatsApp',
    desc: 'Chat langsung, respon cepat',
    value: '+62 736-XXX-XXX',
    color: '#25D366',
    bg: '#25D36615',
    action: () => Linking.openURL('https://wa.me/62736000000'),
  },
  {
    icon: 'mail-outline',
    label: 'Email',
    desc: 'Respon dalam 24 jam',
    value: 'support@mdland.id',
    color: COLORS.primary,
    bg: COLORS.primary + '15',
    action: () => Linking.openURL('mailto:support@mdland.id'),
  },
  {
    icon: 'call-outline',
    label: 'Telepon',
    desc: 'Senin–Minggu, 08:00 – 20:00',
    value: '+62 736-XXX-XXX',
    color: COLORS.accent,
    bg: COLORS.accent + '15',
    action: () => Linking.openURL('tel:+62736000000'),
  },
  {
    icon: 'chatbubble-ellipses-outline',
    label: 'Live Chat',
    desc: 'Langsung dari aplikasi',
    value: 'Chat dengan CS kami',
    color: '#5856D6',
    bg: '#5856D615',
    action: () => {},
  },
];

const FaqItem: React.FC<{ faq: typeof FAQS[0]; index: number }> = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  const height = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({ height: height.value, overflow: 'hidden' }));

  const toggle = () => {
    height.value = withTiming(open ? 0 : 80, { duration: 250 });
    setOpen(!open);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable style={styles.faqHeader} onPress={toggle}>
        <Text style={styles.faqQ} numberOfLines={open ? undefined : 2}>{faq.q}</Text>
        <View style={[styles.faqChevron, open && styles.faqChevronOpen]}>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray500} />
        </View>
      </Pressable>
      {open && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqA}>{faq.a}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const CATEGORIES = ['Semua', 'Booking', 'Wahana', 'Pembayaran', 'Fasilitas'];

  const filteredFaqs = FAQS.filter(f =>
    search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <LinearGradient
            colors={['#00B4D8', '#0096C7']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <Ionicons name="help-buoy" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.heroTitle}>Ada yang bisa kami bantu?</Text>
            <Text style={styles.heroSubtitle}>Tim kami siap membantu 24/7</Text>
          </LinearGradient>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.searchWrapper}>
          <View style={[styles.searchBar, SHADOWS.small]}>
            <Ionicons name="search-outline" size={18} color={COLORS.gray400} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari pertanyaan..."
              placeholderTextColor={COLORS.gray400}
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View entering={FadeInDown.delay(220).springify()}>
          <Text style={styles.sectionLabel}>HUBUNGI KAMI</Text>
          <View style={styles.contactGrid}>
            {CONTACT_OPTIONS.map((opt, i) => (
              <Animated.View key={opt.label} entering={FadeInRight.delay(200 + i * 60).springify()} style={{ width: '48%' }}>
                <Pressable style={[styles.contactCard, SHADOWS.small, { backgroundColor: COLORS.white }]} onPress={opt.action}>
                  <View style={[styles.contactIcon, { backgroundColor: opt.bg }]}>
                    <Ionicons name={opt.icon as any} size={22} color={opt.color} />
                  </View>
                  <Text style={styles.contactLabel}>{opt.label}</Text>
                  <Text style={styles.contactDesc}>{opt.desc}</Text>
                  <Text style={[styles.contactValue, { color: opt.color }]} numberOfLines={1}>{opt.value}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(320).springify()}>
          <Text style={styles.sectionLabel}>PERTANYAAN UMUM</Text>
          <View style={[styles.faqCard, SHADOWS.small]}>
            {filteredFaqs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={40} color={COLORS.gray300} />
                <Text style={styles.emptyText}>Tidak ada hasil untuk "{search}"</Text>
              </View>
            ) : (
              filteredFaqs.map((faq, i) => (
                <View key={i}>
                  <FaqItem faq={faq} index={i} />
                  {i < filteredFaqs.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            )}
          </View>
        </Animated.View>

        {/* Report Issue */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.reportBox}>
          <View style={[styles.reportCard, SHADOWS.small]}>
            <View style={styles.reportLeft}>
              <View style={[styles.reportIcon, { backgroundColor: COLORS.error + '15' }]}>
                <Ionicons name="bug-outline" size={22} color={COLORS.error} />
              </View>
              <View>
                <Text style={styles.reportTitle}>Laporkan Masalah</Text>
                <Text style={styles.reportSub}>Bug atau keluhan teknis</Text>
              </View>
            </View>
            <Pressable style={styles.reportBtn}>
              <Text style={styles.reportBtnText}>Laporkan</Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>
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

  searchWrapper: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  searchInput: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.gray800, height: 36 },

  sectionLabel: {
    ...TYPOGRAPHY.overline, color: COLORS.gray400, fontWeight: '700',
    marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, marginTop: SPACING.lg,
  },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginHorizontal: SPACING.lg },

  contactGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  contactCard: {
    borderRadius: RADIUS.xl, padding: SPACING.lg, gap: SPACING.xs,
  },
  contactIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xs,
  },
  contactLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '700' },
  contactDesc: { ...TYPOGRAPHY.caption, color: COLORS.gray400 },
  contactValue: { ...TYPOGRAPHY.caption, fontWeight: '600' },

  faqCard: {
    marginHorizontal: SPACING.lg, backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, gap: SPACING.md,
  },
  faqQ: { flex: 1, ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '600' },
  faqChevron: { padding: 4 },
  faqChevronOpen: { transform: [{ rotate: '180deg' }] },
  faqAnswer: {
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg,
  },
  faqA: { ...TYPOGRAPHY.body, color: COLORS.gray500, lineHeight: 22 },

  emptyState: { alignItems: 'center', padding: SPACING.xxxl, gap: SPACING.md },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, textAlign: 'center' },

  reportBox: { marginHorizontal: SPACING.lg, marginTop: SPACING.xl },
  reportCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    padding: SPACING.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  reportLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  reportIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  reportTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '600' },
  reportSub: { ...TYPOGRAPHY.bodySmall, color: COLORS.gray400 },
  reportBtn: {
    backgroundColor: COLORS.error + '15',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.round,
  },
  reportBtnText: { ...TYPOGRAPHY.bodySmall, color: COLORS.error, fontWeight: '700' },
});

export default HelpSupportScreen;
