import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList, Pressable, Image,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { VILLAS, WAHANA, EVENTS, RESTAURANTS } from '../data/mockData';
import SearchBar from '../components/common/SearchBar';

type SearchCategory = 'all' | 'villas' | 'wahana' | 'events' | 'dining';

const TRENDING = ['Villa', 'Jet Ski', 'Flyboard', 'DJ Night', 'Sunset', 'Bebek Air'];

const SearchScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');

  const getResults = () => {
    const q = query.toLowerCase();
    if (!q) return [];

    const results: any[] = [];
    if (category === 'all' || category === 'villas') {
      VILLAS.filter(v => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
        .forEach(v => results.push({ ...v, type: 'villa' }));
    }
    if (category === 'all' || category === 'wahana') {
      WAHANA.filter(w => w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q))
        .forEach(w => results.push({ ...w, type: 'wahana' }));
    }
    if (category === 'all' || category === 'events') {
      EVENTS.filter(e => e.title.toLowerCase().includes(q) || e.genre.toLowerCase().includes(q))
        .forEach(e => results.push({ ...e, type: 'event' }));
    }
    if (category === 'all' || category === 'dining') {
      RESTAURANTS.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q))
        .forEach(r => results.push({ ...r, type: 'dining' }));
    }
    return results;
  };

  const results = getResults();

  const renderResult = ({ item, index }: any) => {
    // Get the correct image based on item type
    const getImage = () => {
      if (item.type === 'villa') return item.images[0];
      if (item.type === 'wahana') return item.image;
      if (item.type === 'event') return item.image;
      if (item.type === 'dining') return item.image;
      return item.image;
    };

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <Pressable style={styles.resultCard}>
          <Image source={getImage() as any} style={styles.resultImage} />
          <View style={styles.resultContent}>
            <View style={[styles.typeBadge, {
              backgroundColor: item.type === 'villa' ? COLORS.primary + '15' :
                item.type === 'wahana' ? COLORS.coral + '15' :
                item.type === 'event' ? COLORS.accent + '15' : COLORS.teal + '15'
            }]}>
              <Text style={[styles.typeText, {
                color: item.type === 'villa' ? COLORS.primary :
                  item.type === 'wahana' ? COLORS.coral :
                  item.type === 'event' ? COLORS.accent : COLORS.teal
              }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.resultName} numberOfLines={1}>
              {item.name || item.title}
            </Text>
            <Text style={styles.resultSub} numberOfLines={1}>
              {item.location || item.genre || item.cuisine}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="Cari villa, wahana, event..."
          />
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categories}>
        {(['all', 'villas', 'wahana', 'events', 'dining'] as SearchCategory[]).map(cat => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.catChip, category === cat && styles.catChipActive]}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {query.length === 0 ? (
        <Animated.View entering={FadeIn} style={styles.trending}>
          <Text style={styles.trendingTitle}>Pencarian Populer</Text>
          <View style={styles.trendingGrid}>
            {TRENDING.map((term, index) => (
              <Animated.View key={term} entering={FadeInDown.delay(index * 50)}>
                <Pressable
                  onPress={() => setQuery(term)}
                  style={styles.trendingChip}
                >
                  <Ionicons name="trending-up" size={14} color={COLORS.primary} />
                  <Text style={styles.trendingText}>{term}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>

          <Text style={[styles.trendingTitle, { marginTop: SPACING.xxl }]}>Pencarian Terbaru</Text>
          {['Villa Deluxe', 'Jet Ski'].map((recent, index) => (
            <Pressable key={recent} onPress={() => setQuery(recent)} style={styles.recentItem}>
              <Ionicons name="time-outline" size={18} color={COLORS.gray400} />
              <Text style={styles.recentText}>{recent}</Text>
              <Ionicons name="arrow-forward-outline" size={16} color={COLORS.gray300} />
            </Pressable>
          ))}
        </Animated.View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={renderResult}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.resultsCount}>{results.length} results</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, gap: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  categories: {
    flexDirection: 'row', paddingHorizontal: SPACING.xl, gap: 8, marginBottom: SPACING.lg,
  },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.round,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray200,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { ...TYPOGRAPHY.caption, color: COLORS.gray600 },
  catTextActive: { color: COLORS.white },

  // Trending
  trending: { paddingHorizontal: SPACING.xl },
  trendingTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, marginBottom: SPACING.md },
  trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.white, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: RADIUS.round, ...SHADOWS.small,
  },
  trendingText: { ...TYPOGRAPHY.bodySm, color: COLORS.gray700 },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  recentText: { ...TYPOGRAPHY.body, color: COLORS.gray600, flex: 1 },

  // Results
  resultsList: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  resultsCount: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginBottom: SPACING.md },
  resultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    overflow: 'hidden', marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  resultImage: { width: 70, height: 70 },
  resultContent: { flex: 1, paddingHorizontal: SPACING.md },
  typeBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: RADIUS.round, marginBottom: 3,
  },
  typeText: { ...TYPOGRAPHY.overline, fontSize: 8 },
  resultName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  resultSub: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.lg },
});

export default SearchScreen;
