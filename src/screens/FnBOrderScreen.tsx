import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList,
} from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Restaurant, DiningItem } from '../types';

const CATEGORIES = ['Semua', 'Appetizer', 'Main', 'Snack', 'Dessert', 'Beverage', 'Cocktail'];
const CAT_ICONS: Record<string, string> = {
  Semua: 'apps-outline',
  Appetizer: 'flame-outline',
  Main: 'restaurant-outline',
  Snack: 'pizza-outline',
  Dessert: 'ice-cream-outline',
  Beverage: 'cafe-outline',
  Cocktail: 'wine-outline',
};

interface FnBOrderScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
  onCheckout: (items: { item: DiningItem; qty: number }[], total: number) => void;
  onChat?: () => void;
}

const FnBOrderScreen: React.FC<FnBOrderScreenProps> = ({ restaurant, onBack, onCheckout, onChat }) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  const filteredItems = activeCategory === 'Semua'
    ? restaurant.items
    : restaurant.items.filter(i => i.category.toLowerCase() === activeCategory.toLowerCase());

  const addItem = useCallback((id: string) => {
    setCart(prev => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => {
      const next = new Map(prev);
      const qty = next.get(id) || 0;
      if (qty <= 1) next.delete(id);
      else next.set(id, qty - 1);
      return next;
    });
  }, []);

  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);
  const cartTotal = Array.from(cart.entries()).reduce((sum, [id, qty]) => {
    const item = restaurant.items.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  const handleCheckout = () => {
    const items = Array.from(cart.entries())
      .map(([id, qty]) => ({
        item: restaurant.items.find(i => i.id === id)!,
        qty,
      }))
      .filter(i => i.item);
    onCheckout(items, cartTotal);
  };

  const renderItem = ({ item, index }: { item: DiningItem; index: number }) => {
    const qty = cart.get(item.id) || 0;
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
        <View style={styles.menuItem}>
          <Image source={item.image} style={styles.menuImage} />
          <View style={styles.menuContent}>
            {item.isSignature && (
              <View style={styles.signatureBadge}>
                <Ionicons name="star" size={10} color={COLORS.accent} />
                <Text style={styles.signatureText}>Signature</Text>
              </View>
            )}
            <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.menuFooter}>
              <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
              {qty === 0 ? (
                <Pressable onPress={() => addItem(item.id)} style={styles.addButton}>
                  <Ionicons name="add" size={18} color={COLORS.white} />
                </Pressable>
              ) : (
                <View style={styles.qtyControl}>
                  <Pressable onPress={() => removeItem(item.id)} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                  </Pressable>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <Pressable onPress={() => addItem(item.id)} style={styles.qtyBtn}>
                    <Ionicons name="add" size={16} color={COLORS.primary} />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{restaurant.name}</Text>
          <Text style={styles.headerSubtitle}>{restaurant.cuisine}</Text>
        </View>
        <Pressable onPress={onChat} style={styles.chatHeaderBtn}>
          <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryWrapper}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
          >
            <Ionicons
              name={CAT_ICONS[cat] as any}
              size={15}
              color={activeCategory === cat ? COLORS.white : COLORS.gray500}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>Belum ada menu di kategori ini</Text>
          </View>
        }
      />

      {/* Cart Bar */}
      {cartCount > 0 && (
        <Animated.View entering={FadeIn} style={[styles.cartBar, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable onPress={handleCheckout} style={styles.cartButton}>
            <LinearGradient
              colors={COLORS.gradientOcean as any}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.cartGradient}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
              <Text style={styles.cartText}>Lihat Pesanan</Text>
              <Text style={styles.cartTotal}>{formatPrice(cartTotal)}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  chatHeaderBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '10', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.gray800 },
  headerSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.gray500 },

  categoryWrapper: {
    height: 54,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: SPACING.sm,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.xl, gap: 10,
    alignItems: 'center', paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.gray200,
    height: 38, justifyContent: 'center', alignItems: 'center',
  },
  categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryText: { ...TYPOGRAPHY.caption, color: COLORS.gray600, fontSize: 13 },
  categoryTextActive: { color: COLORS.white },

  menuList: { paddingHorizontal: SPACING.xl, paddingBottom: 140 },
  menuItem: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, overflow: 'hidden',
    marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  menuImage: { width: 100, height: 110 },
  menuContent: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  signatureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start', backgroundColor: COLORS.accent + '15',
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: RADIUS.round, marginBottom: 3,
  },
  signatureText: { fontSize: 9, fontWeight: '700', color: COLORS.accent },
  menuName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800, fontSize: 14 },
  menuDesc: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11, marginTop: 2 },
  menuFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  menuPrice: { ...TYPOGRAPHY.h4, color: COLORS.primary, fontSize: 14 },
  addButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary + '10', borderRadius: RADIUS.round,
    paddingHorizontal: 4, paddingVertical: 2,
  },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  qtyText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.primary, fontSize: 14, minWidth: 20, textAlign: 'center' },

  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    backgroundColor: COLORS.offWhite,
  },
  cartButton: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.medium },
  cartGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  cartBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  cartBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '700' },
  cartText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.white, flex: 1 },
  cartTotal: { ...TYPOGRAPHY.h4, color: COLORS.white },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.gray400, marginTop: SPACING.lg },
});

export default FnBOrderScreen;
