import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface LanguageRegionScreenProps {
  onBack: () => void;
}

const LANGUAGES = [
  { code: 'id', label: 'Bahasa Indonesia', region: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', region: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', label: 'English', region: 'United Kingdom', flag: '🇬🇧' },
  { code: 'zh', label: '中文 (简体)', region: 'China', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', region: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'ko', label: '한국어', region: 'South Korea', flag: '🇰🇷' },
];

const CURRENCIES = [
  { code: 'IDR', label: 'Rupiah', symbol: 'Rp', country: 'Indonesia' },
  { code: 'USD', label: 'US Dollar', symbol: '$', country: 'United States' },
  { code: 'EUR', label: 'Euro', symbol: '€', country: 'Europe' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia' },
];

const DATE_FORMATS = [
  { label: 'DD/MM/YYYY', example: '08/04/2026' },
  { label: 'MM/DD/YYYY', example: '04/08/2026' },
  { label: 'YYYY-MM-DD', example: '2026-04-08' },
];

const LanguageRegionScreen: React.FC<LanguageRegionScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState('id');
  const [selectedCurrency, setSelectedCurrency] = useState('IDR');
  const [selectedDateFormat, setSelectedDateFormat] = useState('DD/MM/YYYY');
  const [use24h, setUse24h] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray800} />
        </Pressable>
        <Text style={styles.headerTitle}>Language & Region</Text>
        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Simpan</Text>
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <LinearGradient
            colors={['#FF6B35', '#FF9F0A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <Ionicons name="language" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.heroTitle}>Sesuaikan Bahasa & Wilayahmu</Text>
            <Text style={styles.heroSubtitle}>Pilihan akan diterapkan ke seluruh aplikasi</Text>
          </LinearGradient>
        </Animated.View>

        {/* Language */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Text style={styles.sectionLabel}>BAHASA</Text>
          <View style={[styles.card, SHADOWS.small]}>
            {LANGUAGES.map((lang, i) => (
              <View key={lang.code}>
                <Pressable style={styles.optionRow} onPress={() => setSelectedLang(lang.code)}>
                  <Text style={styles.flagText}>{lang.flag}</Text>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{lang.label}</Text>
                    <Text style={styles.optionSub}>{lang.region}</Text>
                  </View>
                  <Animated.View entering={selectedLang === lang.code ? ZoomIn.springify() : undefined}>
                    {selectedLang === lang.code ? (
                      <View style={styles.radioSelected}>
                        <Ionicons name="checkmark" size={14} color={COLORS.white} />
                      </View>
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </Animated.View>
                </Pressable>
                {i < LANGUAGES.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Currency */}
        <Animated.View entering={FadeInDown.delay(220).springify()}>
          <Text style={styles.sectionLabel}>MATA UANG</Text>
          <View style={[styles.card, SHADOWS.small]}>
            {CURRENCIES.map((cur, i) => (
              <View key={cur.code}>
                <Pressable style={styles.optionRow} onPress={() => setSelectedCurrency(cur.code)}>
                  <View style={styles.symbolBox}>
                    <Text style={styles.symbolText}>{cur.symbol}</Text>
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{cur.label}</Text>
                    <Text style={styles.optionSub}>{cur.code} · {cur.country}</Text>
                  </View>
                  {selectedCurrency === cur.code ? (
                    <View style={styles.radioSelected}>
                      <Ionicons name="checkmark" size={14} color={COLORS.white} />
                    </View>
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                </Pressable>
                {i < CURRENCIES.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Date Format */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.sectionLabel}>FORMAT TANGGAL</Text>
          <View style={[styles.card, SHADOWS.small]}>
            {DATE_FORMATS.map((fmt, i) => (
              <View key={fmt.label}>
                <Pressable style={styles.optionRow} onPress={() => setSelectedDateFormat(fmt.label)}>
                  <View style={[styles.symbolBox, { backgroundColor: COLORS.primary + '10' }]}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{fmt.label}</Text>
                    <Text style={styles.optionSub}>Contoh: {fmt.example}</Text>
                  </View>
                  {selectedDateFormat === fmt.label ? (
                    <View style={styles.radioSelected}>
                      <Ionicons name="checkmark" size={14} color={COLORS.white} />
                    </View>
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                </Pressable>
                {i < DATE_FORMATS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Time Format */}
        <Animated.View entering={FadeInDown.delay(380).springify()}>
          <Text style={styles.sectionLabel}>FORMAT WAKTU</Text>
          <View style={[styles.card, SHADOWS.small]}>
            <Pressable style={styles.optionRow} onPress={() => setUse24h(false)}>
              <View style={[styles.symbolBox, { backgroundColor: COLORS.teal + '10' }]}>
                <Ionicons name="time-outline" size={16} color={COLORS.teal} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>12 Jam</Text>
                <Text style={styles.optionSub}>Contoh: 2:30 PM</Text>
              </View>
              {!use24h ? (
                <View style={styles.radioSelected}><Ionicons name="checkmark" size={14} color={COLORS.white} /></View>
              ) : <View style={styles.radioEmpty} />}
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.optionRow} onPress={() => setUse24h(true)}>
              <View style={[styles.symbolBox, { backgroundColor: COLORS.teal + '10' }]}>
                <Ionicons name="time-outline" size={16} color={COLORS.teal} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>24 Jam</Text>
                <Text style={styles.optionSub}>Contoh: 14:30</Text>
              </View>
              {use24h ? (
                <View style={styles.radioSelected}><Ionicons name="checkmark" size={14} color={COLORS.white} /></View>
              ) : <View style={styles.radioEmpty} />}
            </Pressable>
          </View>
        </Animated.View>

        {/* Apply Button */}
        <Animated.View entering={FadeInDown.delay(450).springify()} style={{ marginHorizontal: SPACING.lg, marginTop: SPACING.xl }}>
          <Pressable style={styles.applyBtn}>
            <LinearGradient colors={COLORS.gradientOcean as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyBtnGrad}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.applyBtnText}>Terapkan Perubahan</Text>
            </LinearGradient>
          </Pressable>
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
  saveBtn: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.round,
  },
  saveBtnText: { ...TYPOGRAPHY.bodySmall, color: COLORS.primary, fontWeight: '700' },

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
  divider: { height: 1, backgroundColor: COLORS.gray100, marginHorizontal: SPACING.lg },

  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, gap: SPACING.md,
  },
  flagText: { fontSize: 24, width: 38, textAlign: 'center' },
  symbolBox: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center',
  },
  symbolText: { fontSize: 15, fontWeight: '700', color: COLORS.gray700 },
  optionContent: { flex: 1 },
  optionTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontWeight: '600' },
  optionSub: { ...TYPOGRAPHY.bodySmall, color: COLORS.gray400, marginTop: 2 },

  radioSelected: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  radioEmpty: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.gray200,
  },

  applyBtn: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  applyBtnGrad: {
    height: 54, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: SPACING.sm,
  },
  applyBtnText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontWeight: '700' },
});

export default LanguageRegionScreen;
