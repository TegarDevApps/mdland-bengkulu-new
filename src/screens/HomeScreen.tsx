import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeIn,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { VILLAS, EVENTS, USER, WAHANA } from '../data/mockData';
import { Villa } from '../types';
import EventCard from '../components/cards/EventCard';

interface HomeScreenProps {
  onNavigateVilla: (villa: Villa) => void;
  onNavigateExplore: () => void;
  onNavigateEvents: () => void;
  onNavigateEvent?: (event: any) => void;
  onNavigateSearch: () => void;
  onNavigateFnB: () => void;
  onNavigateWahana: () => void;
  onNavigateMap?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateChat?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateVilla,
  onNavigateExplore,
  onNavigateEvents,
  onNavigateEvent,
  onNavigateSearch,
  onNavigateFnB,
  onNavigateWahana,
  onNavigateMap,
  onNavigateNotifications,
  onNavigateChat,
}) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255,255,255,${interpolate(scrollY.value, [0, 100], [0, 1], Extrapolation.CLAMP)})`,
  }));

  const upcomingEvents = EVENTS.slice(0, 3);
  const featuredWahana = WAHANA.slice(0, 4);

  const categories = [
    { icon: 'home', label: 'Villa', color: COLORS.primary, onPress: () => onNavigateExplore() },
    { icon: 'restaurant', label: 'F&B', color: COLORS.accent, onPress: () => onNavigateFnB() },
    { icon: 'boat', label: 'Wahana', color: COLORS.teal, onPress: () => onNavigateWahana() },
    { icon: 'musical-notes', label: 'Events', color: COLORS.coral, onPress: () => onNavigateEvents() },
    { icon: 'map', label: 'Map', color: COLORS.lagoon, onPress: () => onNavigateMap?.() },
  ];

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerStyle]}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/mdland-logo.jpeg')}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.greeting}>Selamat datang,</Text>
            <Text style={styles.userName}>{USER.name.split(' ')[0]}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={onNavigateSearch} style={styles.headerIcon}>
            <Ionicons name="search" size={22} color={COLORS.gray700} />
          </Pressable>
          <Pressable onPress={onNavigateChat} style={styles.headerIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.gray700} />
          </Pressable>
          <Pressable onPress={onNavigateNotifications} style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.gray700} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 70, paddingBottom: 100 }}
      >
        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroBanner}>
          <LinearGradient
            colors={COLORS.gradientOcean as any}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 2 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroOverline}>MDLAND BENGKULU</Text>
              <Text style={styles.heroTitle}>Hi, Welcome!</Text>
              <Text style={styles.heroSubtitle}>Villa, wahana air, & kuliner terbaik</Text>
              <Pressable onPress={onNavigateExplore} style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Jelajahi</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.categoriesContainer}>
            {categories.map((cat, index) => (
              <Animated.View
                key={cat.label}
                entering={FadeInRight.delay(200 + index * 80).springify()}
                style={styles.categoryWrapper}
              >
                <Pressable style={styles.categoryItem} onPress={cat.onPress}>
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                    <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Popular Villas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Villa Populer</Text>
              <Text style={styles.sectionSubtitle}>Pilihan akomodasi terbaik</Text>
            </View>
            <Pressable onPress={onNavigateExplore} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </Pressable>
          </View>

          <FlatList
            data={VILLAS.filter(v => v.available).slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: SPACING.xl }}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
                <Pressable
                  onPress={() => onNavigateVilla(item)}
                  style={styles.villaCard}
                >
                  <Image source={item.images[0]} style={styles.villaCardImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.villaCardGradient}
                  >
                    <Text style={styles.villaCardName}>{item.name}</Text>
                    <Text style={styles.villaCardPrice}>{formatPrice(item.pricePerNight)}/malam</Text>
                  </LinearGradient>
                  <View style={styles.villaCardRating}>
                    <Ionicons name="star" size={12} color={COLORS.accent} />
                    <Text style={styles.villaCardRatingText}>{item.rating}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            )}
          />
        </View>

        {/* Wahana Seru */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: SPACING.xl }]}>
            <View>
              <Text style={styles.sectionTitle}>Wahana Seru</Text>
              <Text style={styles.sectionSubtitle}>Aktivitas air & petualangan</Text>
            </View>
            <Pressable onPress={onNavigateWahana} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </Pressable>
          </View>

          <FlatList
            data={featuredWahana}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: SPACING.xl }}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
                <Pressable onPress={onNavigateWahana} style={styles.wahanaCard}>
                  <Image source={item.image} style={styles.wahanaImage} />
                  <View style={styles.wahanaInfo}>
                    <Text style={styles.wahanaName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.wahanaDuration}>{item.duration}</Text>
                    <Text style={styles.wahanaPrice}>{formatPrice(item.price)}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            )}
          />
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: SPACING.xl }]}>
            <View>
              <Text style={styles.sectionTitle}>Event Mendatang</Text>
              <Text style={styles.sectionSubtitle}>Musik & hiburan malam</Text>
            </View>
            <Pressable onPress={onNavigateEvents} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: SPACING.xl }}>
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => onNavigateEvent?.(event)}
                variant="horizontal"
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Membership Banner */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.membershipBanner}>
          <LinearGradient
            colors={COLORS.gradientGold as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.membershipGradient}
          >
            <View>
              <Text style={styles.membershipTitle}>MDLAND Member</Text>
              <Text style={styles.membershipSubtitle}>Dapatkan diskon & reward eksklusif</Text>
            </View>
            <Ionicons name="diamond" size={36} color="rgba(255,255,255,0.4)" />
          </LinearGradient>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoImage: { width: 44, height: 44, borderRadius: 12 },
  greeting: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  userName: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error,
  },
  heroBanner: { marginHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  heroGradient: {
    borderRadius: RADIUS.xxl, padding: SPACING.xxl,
    flexDirection: 'row', justifyContent: 'space-between',
    minHeight: 180, overflow: 'hidden',
  },
  heroContent: { flex: 1 },
  heroOverline: { ...TYPOGRAPHY.overline, color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 8 },
  heroTitle: { ...TYPOGRAPHY.h1, color: COLORS.white, marginBottom: 8 },
  heroSubtitle: { ...TYPOGRAPHY.bodySm, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  heroButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: RADIUS.round, alignSelf: 'flex-start',
  },
  heroButtonText: { ...TYPOGRAPHY.buttonSm, color: COLORS.primary },
  heroLogo: { width: 80, height: 80, borderRadius: 16, opacity: 0.3, alignSelf: 'center' },
  categoriesContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  categoryWrapper: { flex: 1, alignItems: 'center' },
  categoryItem: { alignItems: 'center', gap: 8 },
  categoryIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray600 },
  section: { marginBottom: SPACING.xxl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg, paddingHorizontal: SPACING.xl,
  },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  sectionSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { ...TYPOGRAPHY.buttonSm, color: COLORS.primary },

  // Villa horizontal cards
  villaCard: {
    width: SCREEN_WIDTH * 0.55, marginRight: SPACING.md,
    borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.medium,
  },
  villaCardImage: { width: '100%', height: 160 },
  villaCardGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.md, paddingTop: 40,
  },
  villaCardName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontSize: 14 },
  villaCardPrice: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  villaCardRating: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  villaCardRatingText: { ...TYPOGRAPHY.caption, color: COLORS.gray800, fontWeight: '700', fontSize: 12 },

  // Wahana horizontal cards
  wahanaCard: {
    width: 150, marginRight: SPACING.md,
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl, overflow: 'hidden',
    ...SHADOWS.small,
  },
  wahanaImage: { width: '100%', height: 100 },
  wahanaInfo: { padding: SPACING.sm },
  wahanaName: { ...TYPOGRAPHY.caption, color: COLORS.gray800, fontWeight: '600', fontSize: 13, marginBottom: 2 },
  wahanaDuration: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11 },
  wahanaPrice: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700', fontSize: 13, marginTop: 4 },

  membershipBanner: { marginHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  membershipGradient: {
    borderRadius: RADIUS.xl, padding: SPACING.xl,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  membershipTitle: { ...TYPOGRAPHY.h4, color: COLORS.white },
  membershipSubtitle: { ...TYPOGRAPHY.bodySm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
});

export default HomeScreen;
