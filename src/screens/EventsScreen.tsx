import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { EVENTS } from '../data/mockData';
import EventCard from '../components/cards/EventCard';

const GENRE_FILTER = ['Semua', 'Open Trip', 'Chill & Relax', 'Music & Nightlife', 'Food & Beverage', 'Sport & Activity', 'Couple & Private'];
const GENRE_ICONS: Record<string, string> = {
  Semua: 'apps-outline',
  'Open Trip': 'boat-outline',
  'Chill & Relax': 'leaf-outline',
  'Music & Nightlife': 'musical-notes-outline',
  'Food & Beverage': 'restaurant-outline',
  'Sport & Activity': 'barbell-outline',
  'Couple & Private': 'heart-outline',
};

interface EventsScreenProps {
  onNavigateEvent?: (event: any) => void;
  onBack?: () => void;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ onNavigateEvent, onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeGenre, setActiveGenre] = useState('Semua');

  const filteredEvents = activeGenre === 'Semua'
    ? EVENTS
    : EVENTS.filter(e => e.genre.toLowerCase().includes(activeGenre.toLowerCase()));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Hero */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
        style={styles.hero}
      >
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
          {onBack && (
            <Pressable onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color={COLORS.white} />
            </Pressable>
          )}
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={styles.heroOverline}>BEACH CLUB</Text>
            <Text style={styles.heroTitle}>Events &{'\n'}Experiences</Text>
            <Text style={styles.heroSubtitle}>Open Trip · Music · Chill · F&B · Sport · Private</Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>

      {/* Genre Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreWrapper}
        contentContainerStyle={styles.genreContainer}
      >
        {GENRE_FILTER.map(genre => (
          <Pressable
            key={genre}
            onPress={() => setActiveGenre(genre)}
            style={[styles.genreChip, activeGenre === genre && styles.genreChipActive]}
          >
            <Ionicons
              name={GENRE_ICONS[genre] as any}
              size={15}
              color={activeGenre === genre ? COLORS.white : COLORS.gray500}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.genreText, activeGenre === genre && styles.genreTextActive]}>
              {genre}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
      >
        {/* Featured Event */}
        {filteredEvents.length > 0 && (
          <EventCard
            event={filteredEvents[0]}
            onPress={() => onNavigateEvent?.(filteredEvents[0])}
            variant="full"
            index={0}
          />
        )}

        {/* Other Events */}
        {filteredEvents.slice(1).map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => onNavigateEvent?.(event)}
            variant="horizontal"
            index={index + 1}
          />
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>No events in this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  hero: { height: 220 },
  heroGradient: { flex: 1, justifyContent: 'flex-end', padding: SPACING.xl },
  backButton: {
    position: 'absolute', top: 12, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroOverline: { ...TYPOGRAPHY.overline, color: COLORS.accentWarm, fontSize: 11, marginBottom: 4 },
  heroTitle: { ...TYPOGRAPHY.h1, color: COLORS.white },
  heroSubtitle: { ...TYPOGRAPHY.body, color: COLORS.gray300, marginTop: 4 },
  genreWrapper: {
    height: 54,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: SPACING.sm,
  },
  genreContainer: {
    paddingHorizontal: SPACING.xl,
    gap: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  genreChip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.gray200,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  genreText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontSize: 13 },
  genreTextActive: { color: COLORS.white },
  eventsList: { paddingHorizontal: SPACING.xl, paddingBottom: 100, flexGrow: 1 },
  emptyState: { alignItems: 'center', paddingTop: SPACING.huge },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.lg },
});

export default EventsScreen;
