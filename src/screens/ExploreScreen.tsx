import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { VILLAS } from '../data/mockData';
import { Villa } from '../types';
import SearchBar from '../components/common/SearchBar';

const TABS = ['Semua', 'Standard', 'Deluxe', 'Premium', 'Suite'];
const TAB_ICONS: Record<string, string> = {
  Semua: 'grid-outline',
  Standard: 'bed-outline',
  Deluxe: 'flower-outline',
  Premium: 'diamond-outline',
  Suite: 'star-outline',
};

interface ExploreScreenProps {
  onNavigateVilla: (villa: Villa) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onNavigateVilla }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  const filteredVillas = VILLAS.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeTab === 'Semua' || v.category.toLowerCase() === activeTab.toLowerCase();
    return matchSearch && matchCategory;
  });

  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <Animated.View entering={FadeIn} style={styles.header}>
        <Image
          source={require('../../assets/mdland-logo.jpeg')}
          style={styles.headerLogo}
        />
        <View>
          <Text style={styles.title}>Explore Villas</Text>
          <Text style={styles.subtitle}>MDLAND Bengkulu</Text>
        </View>
      </Animated.View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Fixed category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsWrapper}
        contentContainerStyle={styles.tabsContainer}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Ionicons
              name={TAB_ICONS[tab] as any}
              size={15}
              color={activeTab === tab ? COLORS.white : COLORS.gray500}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredVillas.length} villa ditemukan</Text>
      </View>

      <FlatList
        data={filteredVillas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
            <Pressable
              style={styles.villaCard}
              onPress={() => onNavigateVilla(item)}
            >
              <Image source={item.images[0]} style={styles.villaImage} />
              <View style={styles.villaContent}>
                <View style={[styles.categoryBadge, {
                  backgroundColor: item.category === 'suite' ? COLORS.accent + '15' :
                    item.category === 'premium' ? COLORS.primary + '15' :
                    item.category === 'deluxe' ? COLORS.teal + '15' : COLORS.gray100,
                }]}>
                  <Text style={[styles.categoryText, {
                    color: item.category === 'suite' ? COLORS.accent :
                      item.category === 'premium' ? COLORS.primary :
                      item.category === 'deluxe' ? COLORS.teal : COLORS.gray600,
                  }]}>
                    {item.category.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.villaName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.villaInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="bed-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.infoText}>{item.bedrooms} Bed</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="people-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.infoText}>{item.maxGuests} Tamu</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="star" size={14} color={COLORS.accent} />
                    <Text style={styles.infoText}>{item.rating}</Text>
                  </View>
                </View>
                <View style={styles.villaFooter}>
                  <Text style={styles.villaPrice}>{formatPrice(item.pricePerNight)}</Text>
                  <Text style={styles.villaPriceUnit}>/malam</Text>
                </View>
                {!item.available && (
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableText}>Tidak Tersedia</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>Tidak ada villa ditemukan</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md,
  },
  headerLogo: { width: 44, height: 44, borderRadius: 12 },
  title: { ...TYPOGRAPHY.h2, color: COLORS.gray800, fontSize: 22 },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  searchContainer: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  tabsWrapper: {
    height: 54,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: SPACING.sm,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.xl,
    gap: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontSize: 13 },
  tabTextActive: { color: COLORS.white },
  resultsHeader: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  resultsCount: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  listContainer: { paddingHorizontal: SPACING.xl, paddingBottom: 100, flexGrow: 1 },
  villaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  villaImage: { width: 120, height: 140 },
  villaContent: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    marginBottom: 4,
  },
  categoryText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  villaName: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontSize: 15, marginBottom: 4 },
  villaInfo: { flexDirection: 'row', gap: 12, marginBottom: 6 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  infoText: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11 },
  villaFooter: { flexDirection: 'row', alignItems: 'baseline' },
  villaPrice: { ...TYPOGRAPHY.h4, color: COLORS.primary, fontSize: 15 },
  villaPriceUnit: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11, marginLeft: 2 },
  unavailableBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: COLORS.error + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.round,
  },
  unavailableText: { fontSize: 9, fontWeight: '600', color: COLORS.error },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.lg },
});

export default ExploreScreen;
