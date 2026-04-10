import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Pressable, FlatList, Image, TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  category: 'villa' | 'restaurant' | 'wahana' | 'event' | 'reception';
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

interface ChatListScreenProps {
  onBack: () => void;
  onOpenChat: (contact: ChatContact) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  villa: { icon: 'home', color: COLORS.primary, label: 'Villa' },
  restaurant: { icon: 'restaurant', color: COLORS.accent, label: 'F&B' },
  wahana: { icon: 'flash', color: COLORS.teal, label: 'Wahana' },
  event: { icon: 'musical-notes', color: COLORS.coral, label: 'Event' },
  reception: { icon: 'headset', color: COLORS.lagoon, label: 'Resepsionis' },
};

const MOCK_CONTACTS: ChatContact[] = [
  {
    id: 'c1', name: 'Resepsionis MDLAND', avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'Front Desk', category: 'reception',
    lastMessage: 'Selamat datang di MDLAND Bengkulu! Ada yang bisa kami bantu?',
    lastTime: 'Baru saja', unread: 1, online: true,
  },
  {
    id: 'c2', name: 'Ocean Breeze Villa', avatar: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=100',
    role: 'Villa Host', category: 'villa',
    lastMessage: 'Check-in bisa mulai pukul 14:00 ya kak 🏖️',
    lastTime: '10 mnt', unread: 2, online: true,
  },
  {
    id: 'c3', name: 'MDLAND Ocean Kitchen', avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100',
    role: 'Restaurant Manager', category: 'restaurant',
    lastMessage: 'Menu spesial hari ini: Grilled Lobster 🦞',
    lastTime: '25 mnt', unread: 0, online: true,
  },
  {
    id: 'c4', name: 'Jet Ski Adventure', avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100',
    role: 'Wahana Operator', category: 'wahana',
    lastMessage: 'Slot jam 10 pagi masih tersedia, kak!',
    lastTime: '1 jam', unread: 0, online: false,
  },
  {
    id: 'c5', name: 'Sunset Sessions', avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100',
    role: 'Event Organizer', category: 'event',
    lastMessage: 'Tiket sudah confirmed. See you tonight! 🎵',
    lastTime: '2 jam', unread: 0, online: false,
  },
  {
    id: 'c6', name: 'Premium Honeymoon Villa', avatar: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=100',
    role: 'Villa Host', category: 'villa',
    lastMessage: 'Terima kasih sudah menginap! Semoga berkesan 💕',
    lastTime: '1 hari', unread: 0, online: false,
  },
  {
    id: 'c7', name: 'Beach Grill & Bar', avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100',
    role: 'Restaurant Manager', category: 'restaurant',
    lastMessage: 'Pesanan sudah siap, bisa diambil di counter ya',
    lastTime: '1 hari', unread: 0, online: false,
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'Semua', icon: 'chatbubbles-outline' },
  { key: 'villa', label: 'Villa', icon: 'home-outline' },
  { key: 'restaurant', label: 'F&B', icon: 'restaurant-outline' },
  { key: 'wahana', label: 'Wahana', icon: 'flash-outline' },
  { key: 'event', label: 'Event', icon: 'musical-notes-outline' },
];

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onBack, onOpenChat }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const totalUnread = MOCK_CONTACTS.reduce((sum, c) => sum + c.unread, 0);

  const filtered = MOCK_CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === 'all' || c.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const renderContact = ({ item, index }: { item: ChatContact; index: number }) => {
    const catConfig = CATEGORY_CONFIG[item.category];

    return (
      <Animated.View entering={FadeInRight.delay(index * 50).duration(350)}>
        <Pressable style={styles.contactCard} onPress={() => onOpenChat(item)}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            {item.online && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactHeader}>
              <View style={styles.nameRow}>
                <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: catConfig.color + '12' }]}>
                  <Ionicons name={catConfig.icon as any} size={9} color={catConfig.color} />
                  <Text style={[styles.categoryText, { color: catConfig.color }]}>{catConfig.label}</Text>
                </View>
              </View>
              <Text style={[styles.contactTime, item.unread > 0 && { color: COLORS.primary, fontWeight: '700' }]}>
                {item.lastTime}
              </Text>
            </View>
            <View style={styles.messageRow}>
              <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray700} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Pesan</Text>
          {totalUnread > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Search Bar */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari percakapan..."
            placeholderTextColor={COLORS.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Quick Reception CTA */}
      {activeFilter === 'all' && searchQuery.length === 0 && (
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.ctaWrapper}>
          <Pressable onPress={() => onOpenChat(MOCK_CONTACTS[0])}>
            <LinearGradient
              colors={COLORS.gradientOcean as any}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaIcon}>
                <Ionicons name="headset" size={24} color={COLORS.white} />
              </View>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Butuh Bantuan?</Text>
                <Text style={styles.ctaSubtitle}>Chat langsung dengan resepsionis kami</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {/* Filters */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          keyExtractor={t => t.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item: tab }) => (
            <Pressable
              onPress={() => setActiveFilter(tab.key)}
              style={[styles.filterChip, activeFilter === tab.key && styles.filterChipActive]}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={activeFilter === tab.key ? COLORS.white : COLORS.gray500}
              />
              <Text style={[styles.filterText, activeFilter === tab.key && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          )}
        />
      </Animated.View>

      {/* Chat List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={56} color={COLORS.gray300} />
            <Text style={styles.emptyTitle}>Belum Ada Pesan</Text>
            <Text style={styles.emptyText}>Mulai chat dari halaman detail villa, resto, atau wahana</Text>
          </View>
        }
      />
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
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray800 },
  headerBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },

  // Search
  searchWrapper: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg, paddingVertical: 12,
    ...SHADOWS.small,
  },
  searchInput: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.gray800, padding: 0 },

  // CTA
  ctaWrapper: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: RADIUS.xl, padding: SPACING.lg,
  },
  ctaIcon: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaContent: { flex: 1 },
  ctaTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, fontWeight: '700' },
  ctaSubtitle: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Filters
  filterScroll: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, paddingBottom: SPACING.md },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },

  // List
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 100, gap: SPACING.sm },

  // Contact Card
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.lg, ...SHADOWS.small,
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 54, height: 54, borderRadius: 18 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: COLORS.success, borderWidth: 2.5, borderColor: COLORS.white,
  },
  contactInfo: { flex: 1 },
  contactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 8 },
  contactName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, flexShrink: 1 },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.round,
  },
  categoryText: { fontSize: 8, fontWeight: '700' },
  contactTime: { ...TYPOGRAPHY.caption, color: COLORS.gray400, fontSize: 11 },
  messageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  lastMessage: { ...TYPOGRAPHY.caption, color: COLORS.gray500, flex: 1, marginRight: 8 },
  lastMessageUnread: { color: COLORS.gray700, fontWeight: '600' },
  unreadBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: SPACING.huge },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray500, marginTop: SPACING.lg },
  emptyText: { ...TYPOGRAPHY.caption, color: COLORS.gray400, marginTop: 4, textAlign: 'center', paddingHorizontal: SPACING.xxxl },
});

export default ChatListScreen;
