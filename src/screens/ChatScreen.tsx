/**
 * ChatScreen.tsx — Native
 * Fixed:
 *  1. Keyboard dismiss jump → behavior='height' on Android + fixed bottom padding
 *  2. Background = deep mauve-purple → near-black blur gradient (matches screenshot)
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Modal,
  Clipboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  useAnimatedStyle,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Line, Polyline } from 'react-native-svg';

import { useAIChatNative, Conversation } from '../hooks/useAIChatNative';
import { AIMessageBubble, UserMessageBubble } from '../components/chat/MessageBubble';
import { ThinkingIndicator } from '../components/chat/ThinkingIndicator';
import { MessageCounter } from '../components/chat/MessageCounter';
import { LimitReachedCountdown } from '../components/chat/LimitReachedCountdown';
import { LimitReachedMessage } from '../components/chat/LimitReachedMessage';
import { ErrorBanner } from '../components/chat/ErrorBanner';
import { Toast } from '../components/chat/Toast';
import { ScrollToBottomButton } from '../components/chat/ScrollToBottomButton';
import { ConversationContextMenu } from '../components/chat/ConversationContextMenu';
import { ConversationSkeleton, UserProfileSkeleton } from '../components/chat/SkeletonLoader';
import {
  Colors,
  Radius,
  FontSize,
  Spacing,
  Gradients,
  BlurIntensity,
  QUICK_CHIPS,
  Layout,
} from '../../constants/theme';

// ─── Background ───────────────────────────────────────────────────────────────
// Solid near-black with a heavy BlurView pass — no animations, no orbs

function AppBackground() {
  return (
    <>
      {/* Solid base */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#060308' }]} pointerEvents="none" />
      {/* Heavy blur overlay for frosted-glass depth */}
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
      {/* Subtle dark tint on top of blur */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(6,3,8,0.55)' }]} pointerEvents="none" />
    </>
  );
}

// ─── Online Pulse ─────────────────────────────────────────────────────────────

function OnlinePulse() {
  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.8);
  useEffect(() => {
    pulseScale.value   = withRepeat(withTiming(1.8, { duration: 1200 }), -1, true);
    pulseOpacity.value = withRepeat(withTiming(0,   { duration: 1200 }), -1, true);
  }, [pulseScale, pulseOpacity]);
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], opacity: pulseOpacity.value }));
  return (
    <View style={styles.onlinePulseContainer}>
      <Animated.View style={[styles.onlinePulseRing, ringStyle]} />
      <View style={styles.onlinePulseDot} />
    </View>
  );
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

interface RenameModalProps { visible: boolean; initialValue: string; onConfirm: (v: string) => void; onCancel: () => void; }

function RenameModal({ visible, initialValue, onConfirm, onCancel }: RenameModalProps) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { if (visible) setValue(initialValue); }, [visible, initialValue]);
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.renameOverlay}>
        <View style={styles.renameCard}>
          <BlurView intensity={BlurIntensity.contextMenu} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.renameFallback} />
          <View style={styles.renameContent}>
            <Text style={styles.renameTitle}>إعادة تسمية</Text>
            <Text style={styles.renameSubtitle}>أدخل الاسم الجديد للمحادثة</Text>
            <TextInput style={styles.renameInput} value={value} onChangeText={setValue} placeholder="اسم المحادثة..." placeholderTextColor={Colors.textMuted} textAlign="right" autoFocus maxLength={60} />
            <View style={styles.renameActions}>
              <Pressable onPress={onCancel} style={styles.renameCancelBtn}><Text style={styles.renameCancelText}>إلغاء</Text></Pressable>
              <Pressable onPress={() => { if (value.trim()) onConfirm(value.trim()); }} style={styles.renameConfirmBtn}>
                <LinearGradient colors={Gradients.purpleCTA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.renameConfirmGradient}>
                  <Text style={styles.renameConfirmText}>تأكيد</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Animated Pressable helpers ───────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GlassButton({ onPress, children, style }: { onPress: () => void; children: React.ReactNode; style?: object }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable style={[styles.glassButton, animStyle, style]} onPressIn={() => { scale.value = withSpring(0.88, { stiffness: 300, damping: 20 }); }} onPressOut={() => { scale.value = withSpring(1, { stiffness: 300, damping: 20 }); }} onPress={onPress}>
      <BlurView intensity={BlurIntensity.glass} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.glassButtonFallback} />
      {children}
    </AnimatedPressable>
  );
}

function ChipButton({ icon, text, onPress }: { icon: string; text: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable style={[styles.chip, animStyle]} onPressIn={() => { scale.value = withSpring(0.95, { stiffness: 300, damping: 20 }); }} onPressOut={() => { scale.value = withSpring(1, { stiffness: 300, damping: 20 }); }} onPress={onPress}>
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={styles.chipText}>{text}</Text>
    </AnimatedPressable>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function SpinnerRing() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withTiming(360, { duration: 800 });
    const id = setInterval(() => { rotation.value = 0; rotation.value = withTiming(360, { duration: 800 }); }, 800);
    return () => clearInterval(id);
  }, [rotation]);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  return (
    <View style={styles.spinnerContainer}>
      <Animated.View style={[styles.spinnerRing, spinStyle]} />
      <View style={styles.spinnerSquare} />
    </View>
  );
}

// ─── History helpers ──────────────────────────────────────────────────────────

function formatConversationDate(updatedAt: string): string {
  const h = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 3600000);
  if (h < 24) return 'اليوم';
  if (h < 48) return 'أمس';
  const d = Math.floor(h / 24);
  return d <= 7 ? `منذ ${d} أيام` : 'منذ فترة';
}

function HistoryItem({ title, date, isActive, isPinned, onPress, onLongPress }: { id: string; title: string; date: string; isActive: boolean; isPinned: boolean; onPress: () => void; onLongPress: () => void }) {
  const scale      = useSharedValue(1);
  const bgProgress = useSharedValue(0);
  const animStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], backgroundColor: interpolateColor(bgProgress.value, [0, 1], ['transparent', 'rgba(255,255,255,0.08)']) }));
  return (
    <AnimatedPressable style={[styles.historyItem, isActive && styles.historyItemActive, animStyle]} onPressIn={() => { scale.value = withSpring(0.98); bgProgress.value = withTiming(1, { duration: 100 }); }} onPressOut={() => { scale.value = withSpring(1); bgProgress.value = withTiming(0, { duration: 200 }); }} onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
      {isActive && <View style={styles.historyItemActiveBorder} />}
      <View style={styles.historyItemIcon}><Text style={{ fontSize: 14 }}>💬</Text></View>
      <View style={styles.historyItemContent}>
        <View style={styles.historyItemTitleRow}>
          <Text style={styles.historyItemTitle} numberOfLines={1}>{title}</Text>
          {isPinned && <Text style={{ fontSize: 10 }}>📌</Text>}
        </View>
        <Text style={styles.historyItemDate}>{date}</Text>
      </View>
    </AnimatedPressable>
  );
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'mock-1', title: 'تمارين لتحسين السرعة',       isPinned: false, createdAt: new Date(Date.now() - 86400000).toISOString(),  updatedAt: new Date(Date.now() - 86400000).toISOString(),  lastMessage: '' },
  { id: 'mock-2', title: 'نظام غذائي للاعبين',         isPinned: false, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString(), lastMessage: '' },
  { id: 'mock-3', title: 'إحصائيات الدوري الإنجليزي',  isPinned: false, createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date(Date.now() - 259200000).toISOString(), lastMessage: '' },
  { id: 'mock-4', title: 'خطة تدريب أسبوعية',          isPinned: false, createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 604800000).toISOString(), lastMessage: '' },
];

// ─── History Panel ────────────────────────────────────────────────────────────

interface HistoryPanelProps {
  isOpen: boolean; onClose: () => void; messagesRemaining: number; resetTime: Date | null;
  conversations: Conversation[]; activeConversationId: string | null;
  onSelectConversation: (id: string) => Promise<void>; onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
  onRenameConversation: (id: string, title: string) => Promise<void>; onDeleteConversation: (id: string) => Promise<void>;
  onNewChat: () => Promise<void>;
}

function HistoryPanel({ isOpen, onClose, messagesRemaining, resetTime, conversations, activeConversationId, onSelectConversation, onTogglePin, onRenameConversation, onDeleteConversation, onNewChat }: HistoryPanelProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-Layout.sidePanel as number);
  const [contextMenu, setContextMenu] = useState<{ conversation: Conversation } | null>(null);
  const [toast, setToast]             = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [renameModal, setRenameModal] = useState<{ conversation: Conversation } | null>(null);
  const display = conversations.length > 0 ? conversations : MOCK_CONVERSATIONS;

  useEffect(() => { translateX.value = withSpring(isOpen ? 0 : -(Layout.sidePanel as number), { stiffness: 200, damping: 25 }); }, [isOpen, translateX]);
  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const pinned   = display.filter(c => c.isPinned);
  const unpinned = display.filter(c => !c.isPinned);

  return (
    <>
      <Pressable style={[StyleSheet.absoluteFill, styles.panelBackdrop, !isOpen && { pointerEvents: 'none', opacity: 0 }]} onPress={onClose} pointerEvents={isOpen ? 'auto' : 'none'} />
      <Animated.View pointerEvents={isOpen ? 'auto' : 'none'} style={[styles.panel, { width: Layout.sidePanel, paddingTop: insets.top + Spacing.base }, panelStyle]}>
        <BlurView intensity={BlurIntensity.panel} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.panelFallback} />
        <View style={styles.panelContent}>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>المحادثات</Text>
            <GlassButton onPress={onClose} style={styles.panelCloseButton}><Text style={styles.panelCloseText}>×</Text></GlassButton>
          </View>
          <View style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <View style={styles.avatar}>
                <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={StyleSheet.absoluteFill} />
                <Text style={styles.avatarText}>م</Text>
                <View style={styles.onlineDot} />
              </View>
              <View>
                <Text style={styles.profileName}>محمود</Text>
                <View style={styles.onlineRow}><OnlinePulse /><Text style={styles.onlineText}>نشط الآن</Text></View>
              </View>
            </View>
            <MessageCounter messagesRemaining={messagesRemaining} />
          </View>
          <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
            {pinned.length > 0 && (
              <><Text style={styles.sectionLabel}>📌 المحادثات المثبتة</Text>
              <View style={styles.conversationsGroup}>
                {pinned.map(c => <HistoryItem key={c.id} id={c.id} title={c.title} date={formatConversationDate(c.updatedAt)} isActive={c.id === activeConversationId} isPinned={c.isPinned} onPress={() => onSelectConversation(c.id)} onLongPress={() => setContextMenu({ conversation: c })} />)}
              </View></>
            )}
            <Text style={styles.sectionLabel}>💬 المحادثات السابقة</Text>
            {unpinned.length === 0 ? (
              <View style={styles.emptyState}><Text style={styles.emptyStateIcon}>💬</Text><Text style={styles.emptyStateTitle}>لا توجد محادثات</Text><Text style={styles.emptyStateSubtitle}>ابدأ محادثة جديدة الآن</Text></View>
            ) : (
              <View style={styles.conversationsGroup}>
                {unpinned.map(c => <HistoryItem key={c.id} id={c.id} title={c.title} date={formatConversationDate(c.updatedAt)} isActive={c.id === activeConversationId} isPinned={c.isPinned} onPress={() => onSelectConversation(c.id)} onLongPress={() => setContextMenu({ conversation: c })} />)}
              </View>
            )}
          </ScrollView>
          <AnimatedPressable style={styles.newChatButton} onPress={onNewChat}>
            <LinearGradient colors={Gradients.purpleCTA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.newChatGradient}><Text style={styles.newChatText}>+ محادثة جديدة</Text></LinearGradient>
          </AnimatedPressable>
        </View>
      </Animated.View>
      {contextMenu && (
        <ConversationContextMenu
          conversationTitle={contextMenu.conversation.title} isPinned={contextMenu.conversation.isPinned}
          onPin={async () => { await onTogglePin(contextMenu.conversation.id, contextMenu.conversation.isPinned); setToast({ message: contextMenu.conversation.isPinned ? 'تم إلغاء التثبيت ✓' : 'تم التثبيت ✓', type: 'success' }); setContextMenu(null); }}
          onRename={() => { setContextMenu(null); setRenameModal({ conversation: contextMenu.conversation }); }}
          onShare={() => { setToast({ message: 'سيتم إضافة هذه الميزة قريباً', type: 'info' }); setContextMenu(null); }}
          onDelete={() => { const c = contextMenu.conversation; setContextMenu(null); Alert.alert('حذف المحادثة', `هل أنت متأكد من حذف "${c.title}"؟`, [{ text: 'إلغاء', style: 'cancel' }, { text: 'حذف', style: 'destructive', onPress: async () => { await onDeleteConversation(c.id); setToast({ message: 'تم الحذف بنجاح ✓', type: 'success' }); } }]); }}
          onCopy={() => { setToast({ message: 'تم نسخ المحادثة ✓', type: 'success' }); setContextMenu(null); }}
          onClose={() => setContextMenu(null)}
        />
      )}
      <RenameModal visible={renameModal !== null} initialValue={renameModal?.conversation.title ?? ''}
        onConfirm={async (newName) => { if (renameModal) { await onRenameConversation(renameModal.conversation.id, newName); setToast({ message: 'تم تغيير الاسم بنجاح ✓', type: 'success' }); setRenameModal(null); } }}
        onCancel={() => setRenameModal(null)}
      />
    </>
  );
}

// ─── Main ChatScreen ──────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef      = useRef<TextInput>(null);
  const [inputHeight,      setInputHeight]      = useState(52);
  const [isPanelOpen,      setIsPanelOpen]      = useState(false);
  const [editingMessage,   setEditingMessage]   = useState<{ id: string; text: string } | null>(null);
  const [toast,            setToast]            = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const isNearBottomRef = useRef(true);

  const {
    messages, conversations, currentConversationId,
    inputValue, setInputValue, isLoading, isThinking,
    messagesRemaining, resetTime, error,
    sendMessage, stopGeneration, retryLastMessage,
    editMessage, deleteMessage, clearChat, dismissError,
    selectConversation, startNewConversation,
    togglePinConversation, renameConversation, deleteConversation,
  } = useAIChatNative();

  const showChat = messages.length > 1;

  useEffect(() => {
    if (isNearBottomRef.current) { setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50); }
    else if (messages.length > 1) { setNewMessagesCount(prev => prev + 1); }
  }, [messages.length, isLoading]);

  const handleScroll = useCallback((e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const near = contentSize.height - contentOffset.y - layoutMeasurement.height < 100;
    isNearBottomRef.current = near;
    setShowScrollButton(!near && showChat);
    if (near) setNewMessagesCount(0);
  }, [showChat]);

  const scrollToBottom    = useCallback(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); setNewMessagesCount(0); }, []);
  const handleCopyMessage = useCallback((text: string) => { Clipboard.setString(text); setToast('تم النسخ بنجاح! ✓'); }, []);
  const handleChipPress   = useCallback((text: string) => { sendMessage(text); }, [sendMessage]);

  const handleSend = useCallback(() => {
    if (editingMessage) { if (inputValue.trim()) { editMessage(editingMessage.id, inputValue.trim()); setEditingMessage(null); setInputValue(''); } }
    else { if (inputValue.trim()) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); sendMessage(); } }
  }, [editingMessage, inputValue, editMessage, sendMessage, setInputValue]);

  const handleStartEdit  = useCallback((id: string, text: string) => { setEditingMessage({ id, text }); setInputValue(text); setTimeout(() => inputRef.current?.focus(), 100); }, [setInputValue]);
  const handleCancelEdit = useCallback(() => { setEditingMessage(null); setInputValue(''); }, [setInputValue]);

  const canSend = inputValue.trim().length > 0 && !(isLoading && !editingMessage);

  // paddingBottom للـ input bar — iOS يستخدم safe area، Android يستخدم insets مباشرة
  const inputPaddingBottom = Platform.OS === 'ios'
    ? Math.max(insets.bottom, 8) + 8
    : Math.max(insets.bottom, 12);

  return (
    <View style={styles.root}>
      {/* ✅ FIX 2 — Deep mauve background */}
      <AppBackground />

      <HistoryPanel
        isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}
        messagesRemaining={messagesRemaining} resetTime={resetTime}
        conversations={conversations} activeConversationId={currentConversationId}
        onSelectConversation={async (id) => { await selectConversation(id); setIsPanelOpen(false); }}
        onTogglePin={togglePinConversation} onRenameConversation={renameConversation} onDeleteConversation={deleteConversation}
        onNewChat={async () => { clearChat(); await startNewConversation(); setIsPanelOpen(false); }}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={styles.header}>
            <BlurView intensity={BlurIntensity.header} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.headerFallback} />
            <View style={styles.headerContent}>
              <GlassButton onPress={() => setIsPanelOpen(true)} style={styles.headerButton}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M3 12h18M3 6h18M3 18h18" stroke="white" strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </GlassButton>
              <Text style={styles.headerTitle} numberOfLines={1}>{showChat ? '90Plus Captin AI' : '90Plus AI'}</Text>
              <GlassButton onPress={() => router.back()} style={styles.headerButton}>
                <Text style={styles.headerBackArrow}>›</Text>
              </GlassButton>
            </View>
          </View>

          {showChat ? (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesList}
                contentContainerStyle={[styles.messagesContent, { paddingTop: Layout.headerHeight, paddingBottom: Spacing.sm }]}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyboardDismissMode="interactive"
              >
                {messages.slice(1).map((msg, i) =>
                  msg.role === 'ai' ? (
                    <AIMessageBubble key={msg.id} message={msg} index={i} />
                  ) : (
                    <UserMessageBubble key={msg.id} message={msg} index={i} onResend={() => sendMessage(msg.text)} onEdit={() => handleStartEdit(msg.id, msg.text)} onDelete={() => deleteMessage(msg.id)} onCopy={() => handleCopyMessage(msg.text)} />
                  )
                )}
                {isThinking && <ThinkingIndicator isThinking={isThinking} lastMessage={messages[messages.length - 1]?.text ?? ''} />}
                {messagesRemaining === 0 && resetTime && <LimitReachedMessage resetTime={resetTime} />}
              </ScrollView>
              {showScrollButton && <ScrollToBottomButton onPress={scrollToBottom} newMessagesCount={newMessagesCount} />}
            </>
          ) : (
            <ScrollView style={styles.welcomeScroll} contentContainerStyle={[styles.welcomeContent, { paddingTop: Layout.headerHeight + Spacing.xl }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.welcomeHero}>
                <Text style={styles.welcomeTitle}>أهلاً يا محمود!</Text>
                <Text style={styles.welcomeSubtitle}>كيف أقدر أساعدك؟</Text>
                <Text style={styles.welcomeBrand}>90Plus AI</Text>
              </View>
              <View style={styles.welcomeChips}>
                {[
                  { icon: '⚽', text: 'معلومات كرة القدم' },
                  { icon: '🌙', text: 'إحصائيات الدوريات' },
                  { icon: '✏️', text: 'خطة تمرين' },
                  { icon: '📅', text: 'نظام غذائي' },
                  { icon: '🎵', text: 'نصائح الاستشفاء' },
                  { icon: '💪', text: 'تمارين اللياقة' },
                ].map(c => <ChipButton key={c.text} icon={c.icon} text={c.text} onPress={() => handleChipPress(c.text)} />)}
              </View>
            </ScrollView>
          )}

          {/* Input Bar */}
          <View style={[styles.inputBar, { paddingBottom: inputPaddingBottom }]}>
            <BlurView intensity={18} tint="dark" style={[StyleSheet.absoluteFill, styles.inputBarBlur]} pointerEvents="none" />
            <LinearGradient colors={['transparent', 'rgba(6,3,10,0.94)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} pointerEvents="none" />

            {messagesRemaining === 0 && resetTime ? (
              <View style={styles.limitBar}>
                <BlurView intensity={BlurIntensity.glass} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.limitBarFallback} />
                <View style={styles.limitBarContent}>
                  <Text style={styles.limitBarLabel}>انتهت رسائلك اليومية</Text>
                  <LimitReachedCountdown resetTime={resetTime} style={styles.limitBarCountdown} />
                </View>
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                {editingMessage && (
                  <Animated.View entering={FadeIn.duration(200)} style={styles.editIndicator}>
                    <View style={styles.editIndicatorLeft}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={Colors.purpleSoft} strokeWidth={2} strokeLinecap="round" />
                        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={Colors.purpleSoft} strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                      <Text style={styles.editIndicatorText}>تعديل الرسالة</Text>
                    </View>
                    <Pressable onPress={handleCancelEdit} style={styles.editCancelButton}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Line x1={18} y1={6} x2={6} y2={18} stroke={Colors.white50} strokeWidth={2} strokeLinecap="round" />
                        <Line x1={6} y1={6} x2={18} y2={18} stroke={Colors.white50} strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                    </Pressable>
                  </Animated.View>
                )}
                <View style={[styles.inputRow, { minHeight: Math.min(Math.max(inputHeight, 52), 120) }]}>
                  <BlurView intensity={BlurIntensity.glass} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: Radius.full }]} pointerEvents="none" />
                  <LinearGradient colors={['rgba(255,255,255,0.07)', 'rgba(124,58,237,0.05)', 'rgba(255,255,255,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.full }]} pointerEvents="none" />
                  <TextInput
                    ref={inputRef}
                    style={[styles.textInput, { writingDirection: 'rtl' }]}
                    value={inputValue} onChangeText={setInputValue}
                    placeholder={editingMessage ? 'عدّل رسالتك...' : 'Ask 90Plus AI ...'}
                    placeholderTextColor={Colors.textDisabled}
                    multiline maxLength={2000} textAlign="right"
                    editable={!(isLoading && !editingMessage)}
                    returnKeyType="default" blurOnSubmit={false}
                    onContentSizeChange={(e) => { const h = e.nativeEvent.contentSize.height; setInputHeight(Math.min(Math.max(h + 16, 52), 120)); }}
                  />
                  {isLoading && !editingMessage ? (
                    <Pressable onPress={stopGeneration} style={styles.stopButton}>
                      <LinearGradient colors={Gradients.stopButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionButtonGradient}><SpinnerRing /></LinearGradient>
                    </Pressable>
                  ) : (
                    <Pressable onPress={handleSend} disabled={!canSend} style={styles.sendButtonWrapper}>
                      {canSend ? (
                        <LinearGradient colors={Gradients.purpleCTA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionButtonGradient}>
                          {editingMessage ? (
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Polyline points="20 6 9 17 4 12" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></Svg>
                          ) : (
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
                          )}
                        </LinearGradient>
                      ) : (
                        <View style={[styles.actionButtonGradient, styles.sendButtonDisabled]} />
                      )}
                    </Pressable>
                  )}
                </View>
              </View>
            )}
            <Text style={styles.poweredBy}>powered by mr.dev ai</Text>
            {Platform.OS === 'ios' && <View style={styles.homeIndicator} />}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#060308' },
  safeArea:     { flex: 1 },
  keyboardView: { flex: 1 },

  orb: { position: 'absolute' },

  header:         { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, overflow: 'hidden', borderBottomWidth: 0.5, borderBottomColor: Colors.white10 },
  headerFallback: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.surfaceDark },
  headerContent:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, height: 60 },
  headerButton:   { width: 40, height: 40, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  headerTitle:    { fontSize: FontSize.md, fontWeight: '500', color: Colors.white60, letterSpacing: 0.5 },
  headerBackArrow:{ fontSize: 20, color: Colors.white, fontWeight: '300' },

  glassButton:         { borderRadius: Radius.full, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  glassButtonFallback: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.surfaceGlass },

  messagesList:    { flex: 1 },
  messagesContent: { paddingHorizontal: Spacing.xs, gap: Spacing.xs },

  welcomeScroll:   { flex: 1 },
  welcomeContent:  { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing['4xl'], alignItems: 'center', justifyContent: 'center' },
  welcomeHero:     { alignItems: 'center', width: '100%', marginBottom: Spacing.xl },
  welcomeTitle:    { fontSize: FontSize['5xl'], fontWeight: '700', color: Colors.white, lineHeight: 32, textAlign: 'center', writingDirection: 'rtl' },
  welcomeSubtitle: { fontSize: FontSize['3xl'], fontWeight: '500', color: Colors.white60, lineHeight: 28, marginBottom: Spacing.md, textAlign: 'center', writingDirection: 'rtl' },
  welcomeBrand:    { fontSize: FontSize.md, color: Colors.white40, textAlign: 'center' },
  welcomeChips:    { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', width: '100%' },

  chip:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: Radius.full, backgroundColor: Colors.white08, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.14)' },
  chipIcon: { fontSize: FontSize.lg },
  chipText: { fontSize: FontSize.sm, color: Colors.white80, writingDirection: 'rtl', fontWeight: '500' },

  inputBar:     { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, overflow: 'hidden' },
  inputBarBlur: { borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.06)' },
  inputWrapper: { gap: Spacing.sm },

  editIndicator:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.xl, backgroundColor: 'rgba(124,58,237,0.15)', borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.3)' },
  editIndicatorLeft:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  editIndicatorText:  { fontSize: FontSize.sm, color: Colors.white70, writingDirection: 'rtl' },
  editCancelButton:   { padding: Spacing.xs },

  inputRow:              { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.xs, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.full, paddingLeft: Spacing.xs + 2, paddingRight: Spacing.xs + 2, paddingVertical: Spacing.xs + 2, minHeight: 52, overflow: 'hidden', shadowColor: Colors.purplePrimary, shadowOffset: { width: 0, height: 0 }, shadowRadius: 14, shadowOpacity: 0.18, elevation: 4 },
  textInput:             { flex: 1, fontSize: FontSize.lg, color: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxHeight: 120, textAlign: 'right', writingDirection: 'rtl' },
  sendButtonWrapper:     { borderRadius: Radius.full, overflow: 'hidden' },
  stopButton:            { borderRadius: Radius.full, overflow: 'hidden' },
  actionButtonGradient:  { width: 40, height: 40, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled:    { backgroundColor: Colors.white08 },

  spinnerContainer: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  spinnerRing:      { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' },
  spinnerSquare:    { width: 8, height: 8, borderRadius: 2, backgroundColor: 'white' },

  limitBar:         { borderRadius: Radius.full, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.borderSubtle, height: 52 },
  limitBarFallback: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.04)' },
  limitBarContent:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  limitBarLabel:    { fontSize: FontSize.sm, color: Colors.textMuted, writingDirection: 'rtl' },
  limitBarCountdown:{ fontSize: FontSize['5xl'], fontWeight: '300', color: Colors.white50, letterSpacing: 1 },

  poweredBy:     { fontSize: FontSize['2xs'], color: Colors.white20, textAlign: 'center', letterSpacing: 1.5, marginTop: Spacing.xs + 2 },
  homeIndicator: { width: Layout.homeIndicatorWidth, height: Layout.homeIndicatorHeight, borderRadius: Radius.full, backgroundColor: Colors.white30, alignSelf: 'center', marginTop: Spacing.md },

  panelBackdrop:   { backgroundColor: Colors.overlayDark, zIndex: 40 },
  panel:           { position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 50, overflow: 'hidden', borderRightWidth: 0.5, borderRightColor: Colors.white10 },
  panelFallback:   { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.surfacePanel },
  panelContent:    { flex: 1, paddingHorizontal: Spacing.xl },
  panelHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  panelTitle:      { fontSize: FontSize['4xl'], fontWeight: '700', color: Colors.white, writingDirection: 'rtl' },
  panelCloseButton:{ width: 32, height: 32, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  panelCloseText:  { fontSize: 20, color: Colors.white, lineHeight: 22 },

  profileCard:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.base, borderRadius: Radius.xl, backgroundColor: Colors.white04, borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: Spacing.xl },
  profileLeft:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar:       { width: 48, height: 48, borderRadius: Radius.full, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: FontSize['3xl'], fontWeight: '700', color: Colors.white, zIndex: 1 },
  onlineDot:    { position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.surfaceDark },
  profileName:  { fontSize: FontSize.lg, fontWeight: '600', color: Colors.white, writingDirection: 'rtl' },
  onlineRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 2 },
  onlineText:   { fontSize: FontSize.xs, fontWeight: '500', color: '#34D399', writingDirection: 'rtl' },

  conversationsList:   { flex: 1 },
  sectionLabel:        { fontSize: FontSize.sm, color: Colors.white40, marginBottom: Spacing.md, marginTop: Spacing.xs, writingDirection: 'rtl' },
  conversationsGroup:  { gap: Spacing.md - 2, marginBottom: Spacing.base },

  historyItem:             { flexDirection: 'row', alignItems: 'center', gap: Spacing.md - 2, padding: Spacing.md - 2, borderRadius: Radius.xl, backgroundColor: Colors.white04, borderWidth: 0.5, borderColor: Colors.borderSubtle, overflow: 'hidden' },
  historyItemActive:       { backgroundColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)' },
  historyItemActiveBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: Colors.purplePrimary, borderTopLeftRadius: Radius.xl, borderBottomLeftRadius: Radius.xl },
  historyItemIcon:         { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.white06, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  historyItemContent:      { flex: 1 },
  historyItemTitleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyItemTitle:        { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary, writingDirection: 'rtl' },
  historyItemDate:         { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2, writingDirection: 'rtl' },

  emptyState:         { alignItems: 'center', paddingVertical: Spacing['4xl'], gap: Spacing.sm },
  emptyStateIcon:     { fontSize: 36, opacity: 0.4 },
  emptyStateTitle:    { fontSize: FontSize.md, color: Colors.white40, fontWeight: '600', writingDirection: 'rtl' },
  emptyStateSubtitle: { fontSize: FontSize.sm, color: Colors.white20, writingDirection: 'rtl' },

  newChatButton:   { borderRadius: Radius.xl, overflow: 'hidden', marginTop: Spacing.xl, marginBottom: Spacing.base },
  newChatGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  newChatText:     { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, writingDirection: 'rtl' },

  onlinePulseContainer: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  onlinePulseRing:      { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  onlinePulseDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },

  renameOverlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  renameCard:           { width: '100%', maxWidth: 340, borderRadius: Radius['2xl'], overflow: 'hidden', borderWidth: 1, borderColor: Colors.purpleMuted },
  renameFallback:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,10,25,0.98)' },
  renameContent:        { padding: Spacing.xl, gap: Spacing.md },
  renameTitle:          { fontSize: FontSize['4xl'], fontWeight: '700', color: Colors.white, textAlign: 'right', writingDirection: 'rtl' },
  renameSubtitle:       { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'right', writingDirection: 'rtl' },
  renameInput:          { backgroundColor: Colors.white08, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, fontSize: FontSize.lg, color: Colors.white, marginTop: Spacing.xs },
  renameActions:        { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xs, justifyContent: 'flex-end' },
  renameCancelBtn:      { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.white08, borderWidth: 0.5, borderColor: Colors.borderLight },
  renameCancelText:     { fontSize: FontSize.md, color: Colors.textSecondary, writingDirection: 'rtl' },
  renameConfirmBtn:     { borderRadius: Radius.lg, overflow: 'hidden' },
  renameConfirmGradient:{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  renameConfirmText:    { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, writingDirection: 'rtl' },
});