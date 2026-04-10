import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

export default function MapViewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.title}>Peta Lokasi</Text>
      </View>
      <View style={styles.mapContainer}>
        <iframe
          title="Peta MDLAND Bengkulu"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15913.12!2d102.2531!3d-3.7843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e35aec73c0c8d03%3A0x61a8c38ac0ce0df6!2sBengkulu%2C%20Kota%20Bengkulu%2C%20Bengkulu!5e0!3m2!1sid!2sid!4v1234567890"
          style={{ width: '100%', height: '100%', border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  mapContainer: {
    flex: 1,
  },
});
