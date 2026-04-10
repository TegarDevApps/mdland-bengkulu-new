import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet, View, Text, Pressable, Image, ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import Animated, {
  SlideInDown, SlideOutDown,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SCREEN_WIDTH } from '../constants/theme';
import { MAP_MARKERS, VILLAS, RESTAURANTS, WAHANA, EVENTS } from '../data/mockData';
import { MapMarker, Villa, Restaurant, Wahana, Event } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Bengkulu center ──
const INITIAL_REGION: Region = {
  latitude: -3.7843,
  longitude: 102.2531,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

// ── Category config ──
const CATEGORIES = [
  { key: 'all', label: 'Semua', icon: 'apps-outline' },
  { key: 'villa', label: 'Villa', icon: 'home-outline' },
  { key: 'restaurant', label: 'Restoran', icon: 'restaurant-outline' },
  { key: 'wahana', label: 'Wahana', icon: 'flash-outline' },
  { key: 'event', label: 'Event', icon: 'musical-notes-outline' },
  { key: 'facility', label: 'Fasilitas', icon: 'business-outline' },
];

const TYPE_COLORS: Record<string, string> = {
  villa: COLORS.primary,
  restaurant: COLORS.accent,
  wahana: COLORS.coral,
  event: COLORS.teal,
  facility: COLORS.lagoon,
};

const TYPE_ICONS: Record<string, string> = {
  villa: 'home',
  restaurant: 'restaurant',
  wahana: 'flash',
  event: 'musical-notes',
  facility: 'business',
};

// ── Haversine distance ──
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Simulated route between 2 points ──
function generateRoute(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const steps = 20;
  const points = [];
  const midLat = (from.latitude + to.latitude) / 2 + (Math.random() - 0.5) * 0.002;
  const midLng = (from.longitude + to.longitude) / 2 + (Math.random() - 0.5) * 0.002;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * from.latitude + 2 * (1 - t) * t * midLat + t * t * to.latitude;
    const lng = (1 - t) * (1 - t) * from.longitude + 2 * (1 - t) * t * midLng + t * t * to.longitude;
    points.push({ latitude: lat, longitude: lng });
  }
  return points;
}

const formatPrice = (p: number) => 'Rp ' + p.toLocaleString('id-ID');

// ── Main Component ──
interface MapViewScreenProps {
  onBack: () => void;
  onSearch?: () => void;
  onNavigateVilla?: (villa: Villa) => void;
  onNavigateRestaurant?: (restaurant: Restaurant) => void;
  onNavigateWahana?: (wahana: Wahana) => void;
  onNavigateEvent?: (event: Event) => void;
}

const MapViewScreen: React.FC<MapViewScreenProps> = ({
  onBack,
  onSearch,
  onNavigateVilla,
  onNavigateRestaurant,
  onNavigateWahana,
  onNavigateEvent,
}) => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [navMode, setNavMode] = useState<'idle' | 'preview' | 'navigating'>('idle');
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [navDistance, setNavDistance] = useState(0);
  const [navWalkMin, setNavWalkMin] = useState(0);
  const [navArrival, setNavArrival] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const dist = getDistance(loc.coords.latitude, loc.coords.longitude, -3.7843, 102.2531);
          if (dist < 50000) {
            setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            return;
          }
        }
      } catch {}
      setUserLocation({ latitude: -3.7885, longitude: 102.2512 });
    })();
  }, []);

  const isMarkerVisible = useCallback((marker: MapMarker) => {
    return activeCategory === 'all' || marker.type === activeCategory;
  }, [activeCategory]);

  const handleMarkerPress = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
    setNavMode('idle');
    setRouteCoords([]);
    mapRef.current?.animateToRegion({
      ...marker.coordinate,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    }, 500);
  }, []);

  const handleGoHere = useCallback(() => {
    if (!selectedMarker || !userLocation) return;
    const route = generateRoute(userLocation, selectedMarker.coordinate);
    setRouteCoords(route);
    const dist = Math.round(getDistance(
      userLocation.latitude, userLocation.longitude,
      selectedMarker.coordinate.latitude, selectedMarker.coordinate.longitude
    ));
    const walkMin = Math.max(1, Math.round(dist / 75));
    const now = new Date();
    now.setMinutes(now.getMinutes() + walkMin);
    const arrival = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}`;

    setNavDistance(dist);
    setNavWalkMin(walkMin);
    setNavArrival(arrival);
    setNavMode('preview');

    mapRef.current?.fitToCoordinates([userLocation, selectedMarker.coordinate], {
      edgePadding: { top: 150, right: 60, bottom: 350, left: 60 },
      animated: true,
    });
  }, [selectedMarker, userLocation]);

  const handleStartNav = useCallback(() => setNavMode('navigating'), []);

  const handleStopNav = useCallback(() => {
    setNavMode('idle');
    setRouteCoords([]);
    setSelectedMarker(null);
    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  }, []);

  const handleCenterUser = useCallback(() => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    }, 500);
  }, [userLocation]);

  const handleDetail = useCallback(() => {
    if (!selectedMarker) return;
    switch (selectedMarker.type) {
      case 'villa': {
        const villa = VILLAS.find(v => v.category === selectedMarker.category) || VILLAS[0];
        onNavigateVilla?.(villa);
        break;
      }
      case 'restaurant': {
        const rest = RESTAURANTS.find(r =>
          r.name.toLowerCase().includes(selectedMarker.title.split(' ')[0].toLowerCase())
        ) || RESTAURANTS[0];
        onNavigateRestaurant?.(rest);
        break;
      }
      case 'wahana': {
        const wahana = WAHANA.find(w => w.category === selectedMarker.category) || WAHANA[0];
        onNavigateWahana?.(wahana);
        break;
      }
      case 'event': {
        const event = EVENTS[0];
        onNavigateEvent?.(event);
        break;
      }
      default:
        break;
    }
  }, [selectedMarker, onNavigateVilla, onNavigateRestaurant, onNavigateWahana, onNavigateEvent]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* User Location */}
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner}>
                <Ionicons name="person" size={14} color={COLORS.white} />
              </View>
            </View>
          </Marker>
        )}

        {/* POI Markers — always render all, hide via opacity to avoid native crash */}
        {MAP_MARKERS.map((marker) => {
          const visible = isMarkerVisible(marker);
          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => visible && handleMarkerPress(marker)}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={false}
              opacity={visible ? 1 : 0}
              tappable={visible}
            >
              <View style={styles.markerContainer}>
                <View style={[
                  styles.markerBubble,
                  { backgroundColor: TYPE_COLORS[marker.type] },
                ]}>
                  <Ionicons name={TYPE_ICONS[marker.type] as any} size={16} color={COLORS.white} />
                </View>
                <View style={[styles.markerArrow, { borderTopColor: TYPE_COLORS[marker.type] }]} />
              </View>
            </Marker>
          );
        })}

        {/* Destination flag */}
        {navMode !== 'idle' && selectedMarker && (
          <Marker coordinate={selectedMarker.coordinate} anchor={{ x: 0.3, y: 1 }} tracksViewChanges={false}>
            <View style={styles.flagMarker}>
              <Ionicons name="flag" size={28} color={COLORS.coral} />
            </View>
          </Marker>
        )}

        {/* Route polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.primary}
            strokeWidth={5}
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      {/* ── Navigation Banner ── */}
      {navMode === 'navigating' && selectedMarker && (
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={[styles.navBanner, { top: insets.top + 8 }]}
        >
          <View style={styles.navBannerContent}>
            <View style={styles.navBannerArrow}>
              <Ionicons name="arrow-up" size={22} color={COLORS.white} />
            </View>
            <View style={styles.navBannerTextWrap}>
              <Text style={styles.navBannerLabel}>Menuju</Text>
              <Text style={styles.navBannerTitle} numberOfLines={1}>{selectedMarker.title}</Text>
            </View>
            <Text style={styles.navBannerDist}>{navDistance}m</Text>
          </View>
        </Animated.View>
      )}

      {/* ── Top Controls ── */}
      {navMode !== 'navigating' && (
        <View style={[styles.topControls, { top: insets.top + 8 }]}>
          <Pressable style={styles.circleBtn} onPress={onBack}>
            <Ionicons name="chevron-back" size={22} color={COLORS.gray700} />
          </Pressable>
          {onSearch && (
            <Pressable style={styles.circleBtn} onPress={onSearch}>
              <Ionicons name="search" size={22} color={COLORS.gray700} />
            </Pressable>
          )}
        </View>
      )}

      {/* ── Category Chips ── */}
      {navMode === 'idle' && (
        <Animated.View entering={FadeInDown.delay(200)} style={[styles.categoryRow, { top: insets.top + 64 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => { setActiveCategory(cat.key); setSelectedMarker(null); }}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={16}
                    color={isActive ? COLORS.white : COLORS.gray600}
                  />
                  <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}

      {/* ── Right controls ── */}
      <View style={[styles.rightControls, { bottom: selectedMarker ? 310 : 120 }]}>
        <Pressable style={styles.circleBtn} onPress={handleCenterUser}>
          <Ionicons name="locate" size={22} color={COLORS.primary} />
        </Pressable>
        {navMode === 'idle' && (
          <>
            <Pressable style={styles.circleBtn} onPress={() => mapRef.current?.animateToRegion({
              ...INITIAL_REGION,
              latitudeDelta: INITIAL_REGION.latitudeDelta * 0.6,
              longitudeDelta: INITIAL_REGION.longitudeDelta * 0.6,
            }, 300)}>
              <Ionicons name="add" size={22} color={COLORS.gray700} />
            </Pressable>
            <Pressable style={styles.circleBtn} onPress={() => mapRef.current?.animateToRegion({
              ...INITIAL_REGION,
              latitudeDelta: INITIAL_REGION.latitudeDelta * 2,
              longitudeDelta: INITIAL_REGION.longitudeDelta * 2,
            }, 300)}>
              <Ionicons name="remove" size={22} color={COLORS.gray700} />
            </Pressable>
          </>
        )}
      </View>

      {/* ── Bottom Sheet: Idle ── */}
      {selectedMarker && navMode === 'idle' && (
        <Animated.View
          key={`idle-${selectedMarker.id}`}
          entering={SlideInDown.duration(350)}
          exiting={SlideOutDown.duration(250)}
          style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetRow}>
            <Image source={selectedMarker.image as any} style={styles.sheetImage} />
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetTitle} numberOfLines={1}>{selectedMarker.title}</Text>
              <Text style={styles.sheetCategory}>{selectedMarker.description}</Text>
              <View style={styles.sheetMeta}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={COLORS.accentWarm} />
                  <Text style={styles.ratingText}>{selectedMarker.rating}</Text>
                  {selectedMarker.reviewCount != null && (
                    <Text style={styles.reviewCountText}>({selectedMarker.reviewCount.toLocaleString('id-ID')})</Text>
                  )}
                </View>
                {selectedMarker.price != null && (
                  <Text style={styles.sheetPrice}>{formatPrice(selectedMarker.price)}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.sheetButtons}>
            <Pressable style={styles.outlineBtn} onPress={handleDetail}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.outlineBtnText}>Details</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={handleGoHere}>
              <LinearGradient
                colors={COLORS.gradientOcean as any}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGradient}
              >
                <Ionicons name="navigate" size={18} color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Go Here</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* ── Bottom Sheet: Preview Route ── */}
      {selectedMarker && navMode === 'preview' && (
        <Animated.View
          key={`preview-${selectedMarker.id}`}
          entering={SlideInDown.duration(350)}
          exiting={SlideOutDown.duration(250)}
          style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetRow}>
            <Image source={selectedMarker.image as any} style={styles.sheetImage} />
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetTitle} numberOfLines={1}>{selectedMarker.title}</Text>
              <Text style={styles.sheetCategory}>{selectedMarker.description}</Text>
              <View style={styles.sheetMetaRow}>
                {selectedMarker.waitTime != null && (
                  <>
                    <Ionicons name="time-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.metaText}>Wait: {selectedMarker.waitTime}min</Text>
                  </>
                )}
                <View style={styles.openBadge}>
                  <View style={[styles.openDot, { backgroundColor: selectedMarker.isOpen ? COLORS.success : COLORS.error }]} />
                  <Text style={[styles.openText, { color: selectedMarker.isOpen ? COLORS.success : COLORS.error }]}>
                    {selectedMarker.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{navDistance}</Text>
              <Text style={styles.statLabel}>meters</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{navWalkMin}</Text>
              <Text style={styles.statLabel}>min walk</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{navArrival}</Text>
              <Text style={styles.statLabel}>arrival</Text>
            </View>
          </View>

          <View style={styles.sheetButtons}>
            <Pressable style={styles.outlineBtn} onPress={handleDetail}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.outlineBtnText}>Details</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={handleStartNav}>
              <LinearGradient
                colors={COLORS.gradientOcean as any}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGradient}
              >
                <Ionicons name="navigate" size={18} color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Start Navigation</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* ── Bottom Sheet: Navigating ── */}
      {selectedMarker && navMode === 'navigating' && (
        <Animated.View
          key={`nav-${selectedMarker.id}`}
          entering={SlideInDown.duration(350)}
          exiting={SlideOutDown.duration(250)}
          style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetRow}>
            <Image source={selectedMarker.image as any} style={styles.sheetImage} />
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetTitle} numberOfLines={1}>{selectedMarker.title}</Text>
              <Text style={styles.sheetCategory}>{selectedMarker.description}</Text>
              <View style={styles.sheetMetaRow}>
                {selectedMarker.waitTime != null && (
                  <>
                    <Ionicons name="time-outline" size={14} color={COLORS.gray500} />
                    <Text style={styles.metaText}>Wait: {selectedMarker.waitTime}min</Text>
                  </>
                )}
                <View style={styles.openBadge}>
                  <View style={[styles.openDot, { backgroundColor: COLORS.success }]} />
                  <Text style={[styles.openText, { color: COLORS.success }]}>Open</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{navDistance}</Text>
              <Text style={styles.statLabel}>meters</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{navWalkMin}</Text>
              <Text style={styles.statLabel}>min walk</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{navArrival}</Text>
              <Text style={styles.statLabel}>arrival</Text>
            </View>
          </View>

          <Text style={styles.navigatingLabel}>Navigating...</Text>

          <View style={styles.sheetButtons}>
            <Pressable style={styles.outlineBtn} onPress={handleDetail}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.outlineBtnText}>Details</Text>
            </Pressable>
            <Pressable style={styles.stopBtn} onPress={handleStopNav}>
              <View style={styles.stopBtnInner}>
                <Ionicons name="stop" size={18} color={COLORS.white} />
                <Text style={styles.stopBtnText}>Stop</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  // User marker
  userMarkerOuter: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(10,132,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  userMarkerInner: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.white,
    ...SHADOWS.medium,
  },

  // POI markers
  markerContainer: { alignItems: 'center' },
  markerBubble: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  markerArrow: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -2,
  },
  flagMarker: { alignItems: 'center' },

  // Nav banner
  navBanner: {
    position: 'absolute', left: 16, right: 16,
    backgroundColor: COLORS.gray800, borderRadius: RADIUS.xl,
    overflow: 'hidden', ...SHADOWS.large,
  },
  navBannerContent: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  navBannerArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBannerTextWrap: { flex: 1 },
  navBannerLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray400, fontSize: 11 },
  navBannerTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white },
  navBannerDist: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontSize: 16 },

  // Top controls
  topControls: {
    position: 'absolute', left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.medium,
  },

  // Category chips
  categoryRow: { position: 'absolute', left: 0, right: 0 },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.white, borderRadius: RADIUS.round,
    paddingHorizontal: 14, paddingVertical: 8,
    ...SHADOWS.small,
  },
  categoryChipActive: { backgroundColor: COLORS.primary },
  categoryChipText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontWeight: '600' },
  categoryChipTextActive: { color: COLORS.white },

  // Right controls
  rightControls: { position: 'absolute', right: 16, gap: 10 },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: 20, paddingTop: 12,
    ...SHADOWS.large,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.gray200, alignSelf: 'center', marginBottom: 16,
  },
  sheetRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  sheetImage: { width: 80, height: 80, borderRadius: RADIUS.lg },
  sheetInfo: { flex: 1, justifyContent: 'center' },
  sheetTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800, fontSize: 17 },
  sheetCategory: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  sheetMeta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 6,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  reviewCountText: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  sheetPrice: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontWeight: '700', fontSize: 15 },
  sheetMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  metaText: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },
  openBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 12 },

  // Stats row
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.xl, paddingVertical: 14,
    marginBottom: 16, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.h3, color: COLORS.gray800, fontSize: 22 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.gray500, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: COLORS.gray200 },

  navigatingLabel: {
    ...TYPOGRAPHY.bodyMedium, color: COLORS.primary,
    textAlign: 'center', marginBottom: 12,
  },

  // Buttons
  sheetButtons: { flexDirection: 'row', gap: 12 },
  outlineBtn: {
    flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: RADIUS.xl, paddingVertical: 14,
  },
  outlineBtnText: { ...TYPOGRAPHY.button, color: COLORS.primary, fontSize: 14 },
  primaryBtn: { flex: 0.6, borderRadius: RADIUS.xl, overflow: 'hidden' },
  primaryBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
  },
  primaryBtnText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 14 },
  stopBtn: {
    flex: 0.6, borderRadius: RADIUS.xl, overflow: 'hidden',
    backgroundColor: COLORS.error,
  },
  stopBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
  },
  stopBtnText: { ...TYPOGRAPHY.button, color: COLORS.white, fontSize: 14 },
});

export default MapViewScreen;
