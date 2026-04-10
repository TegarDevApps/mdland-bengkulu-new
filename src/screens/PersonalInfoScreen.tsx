import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { USER } from '../data/mockData';

interface PersonalInfoScreenProps {
  onBack: () => void;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(USER.name);
  const [email, setEmail] = useState(USER.email);
  const [phone, setPhone] = useState('+62 812 3456 7890');
  const [birthDate, setBirthDate] = useState('15 Juni 1990');
  const [address, setAddress] = useState('Jl. Pantai Panjang No. 88, Bengkulu');
  const [gender, setGender] = useState('Laki-laki');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
    Alert.alert('Berhasil', 'Informasi personal telah diperbarui.');
  };

  const fields = [
    { icon: 'person-outline', label: 'Nama Lengkap', value: name, setter: setName, key: 'name' },
    { icon: 'mail-outline', label: 'Email', value: email, setter: setEmail, key: 'email', keyboard: 'email-address' as const },
    { icon: 'call-outline', label: 'Nomor Telepon', value: phone, setter: setPhone, key: 'phone', keyboard: 'phone-pad' as const },
    { icon: 'calendar-outline', label: 'Tanggal Lahir', value: birthDate, setter: setBirthDate, key: 'birth' },
    { icon: 'location-outline', label: 'Alamat', value: address, setter: setAddress, key: 'address' },
    { icon: 'male-female-outline', label: 'Jenis Kelamin', value: gender, setter: setGender, key: 'gender' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray700} />
        </Pressable>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <Pressable onPress={() => isEditing ? handleSave() : setIsEditing(true)} style={styles.editBtn}>
          <Text style={[styles.editBtnText, isEditing && { color: COLORS.success }]}>
            {isEditing ? 'Simpan' : 'Edit'}
          </Text>
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Avatar Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={USER.avatar} style={styles.avatar} />
              {isEditing && (
                <Animated.View entering={SlideInDown.duration(300)} style={styles.cameraBtn}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </Animated.View>
              )}
            </View>
            <Text style={styles.avatarName}>{name}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="diamond" size={12} color={COLORS.primary} />
              <Text style={styles.memberBadgeText}>{USER.tier.toUpperCase()} MEMBER</Text>
            </View>
          </Animated.View>

          {/* ID Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.idCard}>
            <LinearGradient
              colors={COLORS.gradientOcean as any}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.idCardGradient}
            >
              <View style={styles.idCardRow}>
                <Text style={styles.idCardLabel}>Member ID</Text>
                <Ionicons name="shield-checkmark" size={18} color="rgba(255,255,255,0.6)" />
              </View>
              <Text style={styles.idCardValue}>MDL-{USER.id.toUpperCase()}-PLT</Text>
              <Text style={styles.idCardSince}>Bergabung sejak {USER.memberSince.split('-')[0]}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Fields */}
          <View style={styles.fieldsContainer}>
            {fields.map((field, index) => (
              <Animated.View
                key={field.key}
                entering={FadeInRight.delay(300 + index * 80).duration(400)}
              >
                <View style={styles.fieldCard}>
                  <View style={styles.fieldIconWrap}>
                    <Ionicons name={field.icon as any} size={18} color={COLORS.primary} />
                  </View>
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={field.value}
                        onChangeText={field.setter}
                        keyboardType={field.keyboard || 'default'}
                        placeholderTextColor={COLORS.gray400}
                      />
                    ) : (
                      <Text style={styles.fieldValue}>{field.value}</Text>
                    )}
                  </View>
                  {isEditing && (
                    <Ionicons name="create-outline" size={16} color={COLORS.gray400} />
                  )}
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Verification Section */}
          <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.verificationSection}>
            <Text style={styles.sectionTitle}>Verifikasi</Text>
            <View style={styles.verifyRow}>
              <View style={styles.verifyItem}>
                <View style={[styles.verifyIcon, { backgroundColor: COLORS.success + '15' }]}>
                  <Ionicons name="mail" size={18} color={COLORS.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifyLabel}>Email</Text>
                  <Text style={styles.verifyStatus}>Terverifikasi</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              </View>
              <View style={styles.verifyItem}>
                <View style={[styles.verifyIcon, { backgroundColor: COLORS.success + '15' }]}>
                  <Ionicons name="call" size={18} color={COLORS.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifyLabel}>Telepon</Text>
                  <Text style={styles.verifyStatus}>Terverifikasi</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              </View>
              <View style={styles.verifyItem}>
                <View style={[styles.verifyIcon, { backgroundColor: COLORS.warning + '15' }]}>
                  <Ionicons name="id-card" size={18} color={COLORS.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifyLabel}>KTP / Identitas</Text>
                  <Text style={[styles.verifyStatus, { color: COLORS.warning }]}>Belum Verifikasi</Text>
                </View>
                <Pressable style={styles.verifyBtn}>
                  <Text style={styles.verifyBtnText}>Verifikasi</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Delete Account */}
          <Animated.View entering={FadeInDown.delay(950).duration(400)} style={styles.dangerSection}>
            <Pressable style={styles.dangerBtn}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              <Text style={styles.dangerText}>Hapus Akun</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  // Header
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
  editBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  editBtnText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontWeight: '600' },

  // Avatar
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: COLORS.primary,
  },
  cameraBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  avatarName: { ...TYPOGRAPHY.h3, color: COLORS.gray800, marginTop: SPACING.md },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary + '12', borderRadius: RADIUS.round,
    paddingHorizontal: 14, paddingVertical: 6, marginTop: SPACING.sm,
  },
  memberBadgeText: { ...TYPOGRAPHY.overline, color: COLORS.primary, fontSize: 10 },

  // ID Card
  idCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  idCardGradient: { borderRadius: RADIUS.xl, padding: SPACING.xl },
  idCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idCardLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  idCardValue: { ...TYPOGRAPHY.h3, color: COLORS.white, marginTop: 6, letterSpacing: 1 },
  idCardSince: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.5)', marginTop: SPACING.md },

  // Fields
  fieldsContainer: { paddingHorizontal: SPACING.xl, gap: SPACING.sm },
  fieldCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  fieldIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  fieldContent: { flex: 1 },
  fieldLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginBottom: 2 },
  fieldValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  fieldInput: {
    ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800,
    borderBottomWidth: 1, borderBottomColor: COLORS.primary + '40',
    paddingVertical: 2, paddingHorizontal: 0,
  },

  // Verification
  verificationSection: { marginTop: SPACING.xxl, paddingHorizontal: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md },
  verifyRow: { gap: SPACING.sm },
  verifyItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  verifyIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  verifyLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  verifyStatus: { ...TYPOGRAPHY.caption, color: COLORS.success, marginTop: 2 },
  verifyBtn: {
    backgroundColor: COLORS.warning + '15', borderRadius: RADIUS.round,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  verifyBtnText: { ...TYPOGRAPHY.caption, color: COLORS.warning, fontWeight: '700' },

  // Danger
  dangerSection: { alignItems: 'center', marginTop: SPACING.xxxl, paddingBottom: SPACING.xl },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  dangerText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.error },
});

export default PersonalInfoScreen;
