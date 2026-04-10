import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, Pressable, FlatList, Image, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { ChatContact } from './ChatListScreen';

interface ChatRoomScreenProps {
  contact: ChatContact;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
  read: boolean;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  villa: { icon: 'home', color: COLORS.primary },
  restaurant: { icon: 'restaurant', color: COLORS.accent },
  wahana: { icon: 'flash', color: COLORS.teal },
  event: { icon: 'musical-notes', color: COLORS.coral },
  reception: { icon: 'headset', color: COLORS.lagoon },
};

const generateMockMessages = (contact: ChatContact): Message[] => {
  const base: Message[] = [];

  if (contact.category === 'reception') {
    base.push(
      { id: 'm1', text: 'Halo! Selamat datang di MDLAND Bengkulu Resort 🌊', sender: 'other', time: '09:00', read: true },
      { id: 'm2', text: 'Ada yang bisa kami bantu untuk membuat liburan Anda lebih menyenangkan?', sender: 'other', time: '09:00', read: true },
      { id: 'm3', text: 'Halo, saya mau tanya soal fasilitas yang tersedia', sender: 'user', time: '09:05', read: true },
      { id: 'm4', text: 'Tentu! Kami memiliki private beach, infinity pool, spa, water sports, dan berbagai restoran 🏖️', sender: 'other', time: '09:06', read: true },
      { id: 'm5', text: 'Untuk info lebih detail, silakan cek menu Explore di aplikasi ya kak', sender: 'other', time: '09:06', read: true },
      { id: 'm6', text: 'Terima kasih banyak! 🙏', sender: 'user', time: '09:10', read: true },
      { id: 'm7', text: 'Selamat datang di MDLAND Bengkulu! Ada yang bisa kami bantu?', sender: 'other', time: '09:15', read: false },
    );
  } else if (contact.category === 'villa') {
    base.push(
      { id: 'm1', text: `Halo! Terima kasih telah memilih ${contact.name} 🏡`, sender: 'other', time: '14:00', read: true },
      { id: 'm2', text: 'Check-in bisa dilakukan mulai pukul 14:00 WIB', sender: 'other', time: '14:00', read: true },
      { id: 'm3', text: 'Apakah ada request khusus untuk kamar?', sender: 'other', time: '14:01', read: true },
      { id: 'm4', text: 'Boleh minta extra pillow dan towel?', sender: 'user', time: '14:10', read: true },
      { id: 'm5', text: 'Siap kak! Akan kami siapkan sebelum check-in ✅', sender: 'other', time: '14:11', read: true },
      { id: 'm6', text: 'Check-in bisa mulai pukul 14:00 ya kak 🏖️', sender: 'other', time: '14:15', read: false },
    );
  } else if (contact.category === 'restaurant') {
    base.push(
      { id: 'm1', text: `Selamat datang di ${contact.name}! 🍽️`, sender: 'other', time: '12:00', read: true },
      { id: 'm2', text: 'Menu hari ini sangat spesial lho!', sender: 'other', time: '12:00', read: true },
      { id: 'm3', text: 'Ada rekomendasi menu andalan?', sender: 'user', time: '12:05', read: true },
      { id: 'm4', text: 'Untuk hari ini kami rekomendasikan Grilled Lobster with garlic butter dan Seafood Platter 🦞', sender: 'other', time: '12:06', read: true },
      { id: 'm5', text: contact.lastMessage, sender: 'other', time: '12:30', read: true },
    );
  } else {
    base.push(
      { id: 'm1', text: `Halo! Ada yang bisa dibantu terkait ${contact.name}? 😊`, sender: 'other', time: '10:00', read: true },
      { id: 'm2', text: 'Masih ada slot kosong untuk hari ini?', sender: 'user', time: '10:05', read: true },
      { id: 'm3', text: contact.lastMessage, sender: 'other', time: '10:10', read: true },
    );
  }

  return base;
};

const QUICK_REPLIES = [
  'Terima kasih! 🙏',
  'Baik, saya mengerti',
  'Kapan bisa check-in?',
  'Berapa harganya?',
  'Bisa booking sekarang?',
];

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ contact, onBack }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(() => generateMockMessages(contact));
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const catConfig = CATEGORY_CONFIG[contact.category];

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 300);
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMsg: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setShowQuickReplies(false);

    // Simulate reply after delay
    setTimeout(() => {
      const replies = [
        'Baik kak, akan segera kami proses! 🙌',
        'Terima kasih atas informasinya. Mohon ditunggu sebentar ya 😊',
        'Siap kak! Ada yang lain yang bisa kami bantu?',
        'Noted! Kami akan segera menghubungi Anda kembali ✅',
      ];
      const reply: Message = {
        id: `reply-${Date.now()}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === 'user';
    const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender === 'user');

    return (
      <Animated.View
        entering={isUser ? FadeInRight.duration(300) : FadeInDown.duration(300)}
        style={[styles.messageRow, isUser && styles.messageRowUser]}
      >
        {!isUser && showAvatar ? (
          <Image source={{ uri: contact.avatar }} style={styles.msgAvatar} />
        ) : !isUser ? (
          <View style={styles.msgAvatarSpacer} />
        ) : null}

        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
          {isUser ? (
            <LinearGradient
              colors={COLORS.gradientOcean as any}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.bubbleGradient}
            >
              <Text style={styles.bubbleTextUser}>{item.text}</Text>
              <View style={styles.timeRow}>
                <Text style={styles.timeTextUser}>{item.time}</Text>
                <Ionicons name={item.read ? 'checkmark-done' : 'checkmark'} size={14} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          ) : (
            <>
              <Text style={styles.bubbleTextOther}>{item.text}</Text>
              <Text style={styles.timeTextOther}>{item.time}</Text>
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.gray700} />
        </Pressable>

        <Pressable style={styles.headerProfile}>
          <View style={styles.headerAvatarWrap}>
            <Image source={{ uri: contact.avatar }} style={styles.headerAvatar} />
            {contact.online && <View style={styles.headerOnline} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{contact.name}</Text>
            <View style={styles.headerStatusRow}>
              <View style={[styles.headerCatDot, { backgroundColor: catConfig.color }]} />
              <Text style={styles.headerStatus}>
                {contact.online ? 'Online' : contact.role}
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable style={styles.headerAction}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
        </Pressable>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Quick Replies */}
        {showQuickReplies && (
          <Animated.View entering={SlideInDown.duration(400)}>
            <FlatList
              horizontal
              data={QUICK_REPLIES}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickReplyScroll}
              renderItem={({ item, index }) => (
                <Animated.View entering={ZoomIn.delay(index * 60).duration(300)}>
                  <Pressable
                    style={styles.quickReplyChip}
                    onPress={() => sendMessage(item)}
                  >
                    <Text style={styles.quickReplyText}>{item}</Text>
                  </Pressable>
                </Animated.View>
              )}
            />
          </Animated.View>
        )}

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.inputWrapper}>
            <Pressable style={styles.inputAction}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </Pressable>
            <TextInput
              style={styles.textInput}
              placeholder="Ketik pesan..."
              placeholderTextColor={COLORS.gray400}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable style={styles.inputAction}>
              <Ionicons name="image-outline" size={22} color={COLORS.gray400} />
            </Pressable>
          </View>
          <Pressable
            style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]}
            onPress={() => sendMessage(inputText)}
            disabled={inputText.trim().length === 0}
          >
            <LinearGradient
              colors={inputText.trim().length > 0 ? COLORS.gradientOcean as any : [COLORS.gray200, COLORS.gray300]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={18} color={inputText.trim().length > 0 ? COLORS.white : COLORS.gray400} />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  flex1: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, ...SHADOWS.small,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.offWhite, alignItems: 'center', justifyContent: 'center',
  },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 42, height: 42, borderRadius: 14 },
  headerOnline: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.white,
  },
  headerInfo: { flex: 1 },
  headerName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray800 },
  headerStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  headerCatDot: { width: 6, height: 6, borderRadius: 3 },
  headerStatus: { ...TYPOGRAPHY.caption, color: COLORS.gray500, fontSize: 11 },
  headerAction: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center', justifyContent: 'center',
  },

  // Messages
  messagesList: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: SPACING.sm, gap: 8 },
  messageRowUser: { justifyContent: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: 10 },
  msgAvatarSpacer: { width: 28 },

  bubble: { maxWidth: '78%', borderRadius: RADIUS.lg, overflow: 'hidden' },
  bubbleUser: {},
  bubbleOther: {
    backgroundColor: COLORS.white, padding: SPACING.md, paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  bubbleGradient: { padding: SPACING.md, paddingHorizontal: SPACING.lg },
  bubbleTextUser: { ...TYPOGRAPHY.body, color: COLORS.white, fontSize: 14, lineHeight: 20 },
  bubbleTextOther: { ...TYPOGRAPHY.body, color: COLORS.gray700, fontSize: 14, lineHeight: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
  timeTextUser: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  timeTextOther: { fontSize: 10, color: COLORS.gray400, marginTop: 4, textAlign: 'right' },

  // Quick Replies
  quickReplyScroll: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingVertical: SPACING.sm },
  quickReplyChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: RADIUS.round, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.primary + '30',
    ...SHADOWS.small,
  },
  quickReplyText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  // Input
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm,
    backgroundColor: COLORS.white, ...SHADOWS.medium,
  },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: COLORS.offWhite, borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.sm, paddingVertical: Platform.OS === 'ios' ? 10 : 4,
  },
  inputAction: { paddingBottom: Platform.OS === 'ios' ? 2 : 6, paddingHorizontal: 2 },
  textInput: {
    flex: 1, ...TYPOGRAPHY.body, color: COLORS.gray800,
    maxHeight: 100, padding: 0, fontSize: 14,
  },
  sendBtn: {},
  sendBtnActive: {},
  sendGradient: {
    width: 44, height: 44, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default ChatRoomScreen;
