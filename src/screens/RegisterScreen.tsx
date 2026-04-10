import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import AnimatedButton from '../components/common/AnimatedButton';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800' }}
      style={styles.background}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(10,22,40,0.95)']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
              <Image
                source={require('../../assets/mdland-logo.jpeg')}
                style={styles.logoImage}
              />
              <Text style={styles.title}>Buat Akun</Text>
              <Text style={styles.subtitle}>Bergabung dengan MDLAND Bengkulu</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.gray400} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={COLORS.gray500}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray400} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.gray500}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray400} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.gray500}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.gray400}
                  />
                </Pressable>
              </View>

              <AnimatedButton
                title="Daftar"
                onPress={onRegister}
                variant="gradient"
                size="lg"
                fullWidth
                gradientColors={COLORS.gradientSunset as any}
              />

              <View style={styles.termsRow}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <Pressable onPress={onNavigateLogin}>
                <Text style={styles.footerLink}>Masuk</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.huge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginBottom: SPACING.xl,
  },
  title: { ...TYPOGRAPHY.h1, color: COLORS.white, marginBottom: 8 },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.gray400 },
  form: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: SPACING.lg,
    height: 56,
    marginBottom: SPACING.lg,
  },
  inputIcon: { marginRight: SPACING.md },
  input: { flex: 1, color: COLORS.white, fontSize: 16 },
  termsRow: { marginTop: SPACING.xl, alignItems: 'center' },
  termsText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: COLORS.primaryLight },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxxl,
  },
  footerText: { ...TYPOGRAPHY.body, color: COLORS.gray400 },
  footerLink: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primaryLight },
});

export default RegisterScreen;
