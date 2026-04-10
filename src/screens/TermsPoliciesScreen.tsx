import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface TermsPoliciesScreenProps {
  onBack: () => void;
}

const POLICIES = [
  {
    key: 'terms',
    title: 'Syarat & Ketentuan',
    icon: 'document-text-outline',
    color: COLORS.primary,
    bg: COLORS.primary + '12',
    lastUpdate: '1 Januari 2026',
    content: [
      {
        heading: '1. Penerimaan Syarat',
        body: 'Dengan mengakses dan menggunakan aplikasi MDLAND, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju, harap hentikan penggunaan aplikasi ini.',
      },
      {
        heading: '2. Penggunaan Layanan',
        body: 'Layanan MDLAND hanya tersedia untuk pengguna berusia 18 tahun ke atas atau di bawah pengawasan orang tua/wali. Anda bertanggung jawab penuh atas semua aktivitas yang terjadi di akun Anda.',
      },
      {
        heading: '3. Pemesanan & Pembayaran',
        body: 'Semua pemesanan bersifat mengikat setelah pembayaran dikonfirmasi. Harga yang tertera adalah harga final termasuk pajak. MDLAND berhak mengubah harga tanpa pemberitahuan sebelumnya.',
      },
      {
        heading: '4. Larangan',
        body: 'Dilarang menggunakan layanan untuk tujuan ilegal, menyebarkan konten berbahaya, melakukan penipuan, atau mengganggu keamanan sistem. Pelanggaran dapat mengakibatkan pemblokiran akun permanen.',
      },
      {
        heading: '5. Perubahan Syarat',
        body: 'MDLAND berhak memperbarui syarat ini kapan saja. Perubahan akan diberitahukan melalui notifikasi aplikasi. Penggunaan berkelanjutan dianggap sebagai penerimaan perubahan.',
      },
    ],
  },
  {
    key: 'privacy',
    title: 'Kebijakan Privasi',
    icon: 'lock-closed-outline',
    color: '#5856D6',
    bg: '#5856D612',
    lastUpdate: '1 Januari 2026',
    content: [
      {
        heading: '1. Data yang Dikumpulkan',
        body: 'Kami mengumpulkan nama, email, nomor telepon, data lokasi (opsional), riwayat pemesanan, dan preferensi penggunaan untuk memberikan layanan terbaik kepada Anda.',
      },
      {
        heading: '2. Penggunaan Data',
        body: 'Data digunakan untuk memproses pemesanan, mengirim notifikasi relevan, meningkatkan layanan, dan keperluan analitik internal. Kami tidak menjual data pribadi Anda kepada pihak ketiga.',
      },
      {
        heading: '3. Penyimpanan Data',
        body: 'Data disimpan di server aman dengan enkripsi AES-256. Data akan disimpan selama akun aktif dan dihapus dalam 30 hari setelah permintaan penghapusan akun.',
      },
      {
        heading: '4. Hak Pengguna',
        body: 'Anda berhak mengakses, memperbarui, mengunduh, atau menghapus data pribadi Anda kapan saja. Hubungi privacy@mdland.id untuk permintaan terkait data.',
      },
    ],
  },
  {
    key: 'refund',
    title: 'Kebijakan Refund',
    icon: 'card-outline',
    color: COLORS.success,
    bg: COLORS.success + '12',
    lastUpdate: '15 Maret 2026',
    content: [
      {
        heading: 'Pembatalan Villa',
        body: 'Lebih dari 7 hari sebelum check-in: refund 100%.\n3–7 hari sebelum: refund 50%.\nKurang dari 3 hari atau no-show: tidak ada refund.',
      },
      {
        heading: 'Pembatalan Event & Wahana',
        body: 'Lebih dari 48 jam: refund 100%.\n24–48 jam: refund 50%.\nKurang dari 24 jam: tidak ada refund.\nEvent dibatalkan oleh MDLAND: refund penuh + kompensasi 10%.',
      },
      {
        heading: 'Proses Refund',
        body: 'Refund diproses dalam 3–7 hari kerja ke metode pembayaran asli. Biaya admin bank tidak ditanggung MDLAND. Untuk mempercepat proses, hubungi tim support kami.',
      },
    ],
  },
  {
    key: 'cookie',
    title: 'Kebijakan Cookie',
    icon: 'browsers-outline',
    color: '#FF9F0A',
    bg: '#FF9F0A12',
    lastUpdate: '1 Januari 2026',
    content: [
      {
        heading: 'Apa itu Cookie?',
        body: 'Cookie adalah file kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman penggunaan, menyimpan preferensi, dan membantu analitik layanan.',
      },
      {
        heading: 'Cookie yang Kami Gunakan',
        body: 'Cookie esensial (wajib untuk fungsi dasar), cookie preferensi (menyimpan pengaturan bahasa & mata uang), dan cookie analitik (membantu kami memahami pola penggunaan).',
      },
      {
        heading: 'Kontrol Cookie',
        body: 'Anda dapat menonaktifkan cookie non-esensial melalui menu Pengaturan → Privasi → Pengumpulan Data. Menonaktifkan semua cookie dapat mempengaruhi fungsi aplikasi.',
      },
    ],
  },
  {
    key: 'community',
    title: 'Panduan Komunitas',
    icon: 'people-outline',
    color: COLORS.coral,
    bg: COLORS.coral + '12',
    lastUpdate: '1 Februari 2026',
    content: [
      {
        heading: 'Etika Berkomunitas',
        body: 'MDLAND mendorong interaksi yang positif, saling menghormati, dan inklusif. Selalu jaga kesopanan dalam setiap interaksi dengan sesama tamu maupun staf MDLAND.',
      },
      {
        heading: 'Konten yang Dilarang',
        body: 'Dilarang keras: konten SARA, pelecehan, spam, konten seksual eksplisit, penipuan, dan provokasi. Pelanggaran akan dikenakan sanksi berupa peringatan hingga pemutusan akun.',
      },
      {
        heading: 'Pelaporan',
        body: 'Jika menemukan pelanggaran komunitas, laporkan melalui tombol "Laporkan" atau hubungi support kami. Setiap laporan ditindaklanjuti dalam 24 jam.',
      },
    ],
  },
];

const PolicyAccordion: React.FC<{ policy: typeof POLICIES[0]; index: number }> = ({ policy, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(150 + index * 80).springify()} style={[styles.accordion, SHADOWS.small]}>
      <Pressable style={styles.accordionHeader} onPress={() => setOpen(!open)}>
        <View style={[styles.accordionIcon, { backgroundColor: policy.bg }]}>
          <Ionicons name={policy.icon as any} size={20} color={policy.color} />
        </View>
        <View style={styles.accordionTitleWrap}>
          <Text style={styles.accordionTitle}>{policy.title}</Text>
          <Text style={styles.accordionDate}>Diperbarui {policy.lastUpdate}</Text>
        </View>
        <View style={[styles.chevronWrap, open && styles.chevronOpen]}>
          <Ionicons name="chevron-down" size={18} color={COLORS.gray400} />
        </View>
      </Pressable>

      {open && (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.accordionBody}>
          <View style={[styles.divider, { marginHorizontal: 0 }]} />
          {policy.content.map((section, i) => (
            <View key={i} style={styles.policySection}>
              <Text style={[styles.policySectionTitle, { color: policy.color }]}>{section.heading}</Text>
              <Text style={styles.policySectionBody}>{section.body}</Text>
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const TermsPoliciesScreen: React.FC<TermsPoliciesScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms & Policies</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <LinearGradient
            colors={['#1C1C1E', '#3A3A3C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <Ionicons name="shield-half-outline" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.heroTitle}>Transparansi & Kepercayaan</Text>
            <Text style={styles.heroSubtitle}>Semua kebijakan MDLAND tersimpan di sini untuk kemudahanmu</Text>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#30D158" />
                <Text style={styles.heroBadgeText}>GDPR Compliant</Text>
              </View>
              <View style={styles.heroBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#30D158" />
                <Text style={styles.heroBadgeText}>ISO 27001</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Terakhir diperbarui: <Text style={{ fontWeight: '700' }}>15 Maret 2026</Text>. Ketuk setiap bagian untuk membaca selengkapnya.
          </Text>
        </Animated.View>

        {/* Accordions */}
        <View style={styles.policyList}>
          {POLICIES.map((policy, i) => (
            <PolicyAccordion key={policy.key} policy={policy} index={i} />
          ))}
        </View>

        {/* Footer Note */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footerNote}>
          <Ionicons name="mail-outline" size={18} color={COLORS.gray400} />
          <Text style={styles.footerNoteText}>
            Pertanyaan tentang kebijakan kami? Hubungi <Text style={styles.footerLink}>legal@mdland.id</Text>
          </Text>
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
  heroSubtitle: { ...TYPOGRAPHY.bodySmall, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  heroBadgeRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: SPACING.md,
    paddingVertical: 5, borderRadius: RADIUS.round,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
    backgroundColor: COLORS.primary + '10', margin: SPACING.lg,
    borderRadius: RADIUS.lg, padding: SPACING.lg, marginTop: 0,
  },
  infoText: { flex: 1, ...TYPOGRAPHY.bodySmall, color: COLORS.gray600, lineHeight: 20 },

  policyList: { paddingHorizontal: SPACING.lg, gap: SPACING.md },

  accordion: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl, overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.lg, gap: SPACING.md,
  },
  accordionIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  accordionTitleWrap: { flex: 1 },
  accordionTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '700' },
  accordionDate: { ...TYPOGRAPHY.caption, color: COLORS.gray400, marginTop: 2 },
  chevronWrap: { padding: 4 },
  chevronOpen: { transform: [{ rotate: '180deg' }] },

  accordionBody: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginBottom: SPACING.lg },
  policySection: { marginBottom: SPACING.lg },
  policySectionTitle: { ...TYPOGRAPHY.bodyMedium, fontWeight: '700', marginBottom: SPACING.sm },
  policySectionBody: { ...TYPOGRAPHY.body, color: COLORS.gray500, lineHeight: 22 },

  footerNote: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    margin: SPACING.lg, marginTop: SPACING.xl,
    backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, padding: SPACING.lg,
  },
  footerNoteText: { flex: 1, ...TYPOGRAPHY.bodySmall, color: COLORS.gray500, lineHeight: 20 },
  footerLink: { color: COLORS.primary, fontWeight: '600' },
});

export default TermsPoliciesScreen;
