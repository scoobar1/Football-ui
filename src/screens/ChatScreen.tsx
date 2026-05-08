/**
 * ChatScreen.tsx — Native
 * Matches screenshots exactly. Keyboard-aware input stays above keyboard.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Modal,
  Clipboard,
  Platform,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, {
  Path,
  Defs,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

import { useAIChatNative, Conversation } from '../hooks/useAIChatNative';
import { AIMessageBubble, UserMessageBubble } from '../components/chat/MessageBubble';
import { ThinkingIndicator } from '../components/chat/ThinkingIndicator';
import { MessageCounter } from '../components/chat/MessageCounter';
import { Toast } from '../components/chat/Toast';
import { ConversationContextMenu } from '../components/chat/ConversationContextMenu';
import { ConversationSkeleton, UserProfileSkeleton } from '../components/chat/SkeletonLoader';
import { Colors, Radius, FontSize, Spacing, Gradients } from '../../constants/theme';

// ─── Background ───────────────────────────────────────────────────────────────

function AppBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#080608' }]} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgRadialGradient
            id="purpleGlowTop"
            cx="50%" cy="0%" rx="70%" ry="50%" fx="50%" fy="0%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#4C1D95" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#purpleGlowTop)" />
      </Svg>
    </View>
  );
}

// ─── Online Pulse ─────────────────────────────────────────────────────────────

function OnlinePulse() {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.8);
  useEffect(() => {
    pulseScale.value = withRepeat(withTiming(1.8, { duration: 1200 }), -1, true);
    pulseOpacity.value = withRepeat(withTiming(0, { duration: 1200 }), -1, true);
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  return (
    <View style={styles.onlinePulseContainer}>
      <Animated.View style={[styles.onlinePulseRing, ringStyle]} />
      <View style={styles.onlinePulseDot} />
    </View>
  );
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

interface RenameModalProps {
  visible: boolean;
  initialValue: string;
  onConfirm: (v: string) => void;
  onCancel: () => void;
}
function RenameModal({ visible, initialValue, onConfirm, onCancel }: RenameModalProps) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { if (visible) setValue(initialValue); }, [visible, initialValue]);
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.renameOverlay}>
        <View style={[styles.renameCard, { backgroundColor: '#1A1525' }]}>
          <View style={styles.renameContent}>
            <Text style={styles.renameTitle}>إعادة تسمية</Text>
            <Text style={styles.renameSubtitle}>أدخل الاسم الجديد للمحادثة</Text>
            <TextInput
              style={styles.renameInput}
              value={value}
              onChangeText={setValue}
              placeholder="اسم المحادثة..."
              placeholderTextColor={Colors.textMuted}
              textAlign="right"
              autoFocus
              maxLength={60}
            />
            <View style={styles.renameActions}>
              <Pressable onPress={onCancel} style={styles.renameCancelBtn}>
                <Text style={styles.renameCancelText}>إلغاء</Text>
              </Pressable>
              <Pressable
                onPress={() => { if (value.trim()) onConfirm(value.trim()); }}
                style={styles.renameConfirmBtn}
              >
                <LinearGradient
                  colors={Gradients.purpleCTA}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.renameConfirmGradient}
                >
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

// ─── Chips ────────────────────────────────────────────────────────────────────

function ChipButton({ icon, text, onClick }: { icon: string; text: string; onClick: () => void }) {
  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => [styles.chipButton, pressed && { opacity: 0.75 }]}
    >
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={styles.chipText}>{text}</Text>
    </Pressable>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function SpinnerRing() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 800 }), -1, false);
  }, []);
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <View style={styles.spinnerContainer}>
      <Animated.View style={[styles.spinnerRing, spinStyle]} />
      <View style={styles.spinnerSquare} />
    </View>
  );
}

// ─── History Item ─────────────────────────────────────────────────────────────

function HistoryItem({
  title, date, isActive, isPinned, onPress, onLongPress,
}: {
  id: string; title: string; date: string;
  isActive: boolean; isPinned: boolean;
  onPress: () => void; onLongPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.historyItem, isActive && styles.historyItemActive]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.historyItemIcon}><Text style={{ fontSize: 14 }}>💬</Text></View>
      <View style={styles.historyItemContent}>
        <View style={styles.historyItemTitleRow}>
          <Text style={styles.historyItemTitle} numberOfLines={1}>{title}</Text>
          {isPinned && <Text style={{ fontSize: 10 }}>📌</Text>}
        </View>
        <Text style={styles.historyItemDate}>{date}</Text>
      </View>
    </Pressable>
  );
}

// ─── History Panel ────────────────────────────────────────────────────────────

interface HistoryPanelProps {
  isOpen: boolean; onClose: () => void;
  messagesRemaining: number; resetTime: Date | null;
  conversations: Conversation[]; activeConversationId: string | null;
  onSelectConversation: (id: string) => Promise<void>;
  onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
  onRenameConversation: (id: string, title: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  onNewChat: () => Promise<void>;
  isOnline: boolean; isLoading: boolean;
}

function HistoryPanel({
  isOpen, onClose, messagesRemaining, resetTime,
  conversations, activeConversationId,
  onSelectConversation, onTogglePin, onRenameConversation, onDeleteConversation,
  onNewChat, isOnline, isLoading,
}: HistoryPanelProps) {
  const insets = useSafeAreaInsets();
  const [contextMenu, setContextMenu] = useState<{ conversation: Conversation } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [renameModal, setRenameModal] = useState<{ conversation: Conversation } | null>(null);

  const pinned = conversations.filter(c => c.isPinned);
  const unpinned = conversations.filter(c => !c.isPinned);

  if (!isOpen) return null;

  return (
    <>
      <Pressable style={[StyleSheet.absoluteFill, styles.panelBackdrop]} onPress={onClose} />
      <View style={[styles.panel, { width: '85%', backgroundColor: '#0D0A14', paddingTop: insets.top }]}>
        <View style={styles.panelContent}>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>المحادثات</Text>
            <Pressable onPress={onClose} style={styles.panelCloseButton}>
              <Text style={styles.panelCloseText}>×</Text>
            </Pressable>
          </View>

          {isLoading && conversations.length === 0 ? (
            <>
              <UserProfileSkeleton />
              <ConversationSkeleton />
            </>
          ) : (
            <>
              <View style={styles.profileCard}>
                <View style={styles.profileLeft}>
                  <View style={styles.avatar}>
                    <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={StyleSheet.absoluteFill} />
                    <Text style={styles.avatarText}>م</Text>
                    <View style={styles.onlineDot} />
                  </View>
                  <View>
                    <Text style={styles.profileName}>محمود</Text>
                    <View style={styles.onlineRow}>
                      {isOnline && <OnlinePulse />}
                      <Text style={styles.onlineText}>{isOnline ? 'نشط الآن' : 'غير متصل'}</Text>
                    </View>
                  </View>
                </View>
                <MessageCounter messagesRemaining={messagesRemaining} />
              </View>

              <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
                {pinned.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>المحادثات المثبتة</Text>
                    </View>
                    <View style={styles.conversationsGroup}>
                      {pinned.map(c => (
                        <HistoryItem
                          key={c.id} id={c.id} title={c.title} date="اليوم"
                          isActive={c.id === activeConversationId} isPinned={c.isPinned}
                          onPress={() => onSelectConversation(c.id)}
                          onLongPress={() => setContextMenu({ conversation: c })}
                        />
                      ))}
                    </View>
                  </>
                )}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>المحادثات السابقة</Text>
                </View>
                <View style={styles.conversationsGroup}>
                  {unpinned.map(c => (
                    <HistoryItem
                      key={c.id} id={c.id} title={c.title} date="اليوم"
                      isActive={c.id === activeConversationId} isPinned={c.isPinned}
                      onPress={() => onSelectConversation(c.id)}
                      onLongPress={() => setContextMenu({ conversation: c })}
                    />
                  ))}
                </View>
              </ScrollView>

              <Pressable style={styles.newChatButton} onPress={onNewChat}>
                <LinearGradient
                  colors={Gradients.purpleCTA}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.newChatGradient}
                >
                  <Text style={styles.newChatText}>+ محادثة جديدة</Text>
                </LinearGradient>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {contextMenu && (
        <ConversationContextMenu
          conversationTitle={contextMenu.conversation.title}
          isPinned={contextMenu.conversation.isPinned}
          onPin={async () => {
            await onTogglePin(contextMenu.conversation.id, contextMenu.conversation.isPinned);
            setToast({ message: contextMenu.conversation.isPinned ? 'تم إلغاء التثبيت ✓' : 'تم التثبيت ✓', type: 'success' });
            setContextMenu(null);
          }}
          onRename={() => { setContextMenu(null); setRenameModal({ conversation: contextMenu.conversation }); }}
          onShare={() => { setToast({ message: 'سيتم إضافة هذه الميزة قريباً', type: 'info' }); setContextMenu(null); }}
          onDelete={() => {
            const c = contextMenu.conversation;
            setContextMenu(null);
            Alert.alert('حذف المحادثة', `هل أنت متأكد من حذف "${c.title}"؟`, [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'حذف', style: 'destructive', onPress: async () => { await onDeleteConversation(c.id); setToast({ message: 'تم الحذف بنجاح ✓', type: 'success' }); } },
            ]);
          }}
          onCopy={() => { setToast({ message: 'تم نسخ المحادثة ✓', type: 'success' }); setContextMenu(null); }}
          onClose={() => setContextMenu(null)}
        />
      )}

      <RenameModal
        visible={renameModal !== null}
        initialValue={renameModal?.conversation.title ?? ''}
        onConfirm={async (newName) => {
          if (renameModal) {
            await onRenameConversation(renameModal.conversation.id, newName);
            setToast({ message: 'تم تغيير الاسم بنجاح ✓', type: 'success' });
            setRenameModal(null);
          }
        }}
        onCancel={() => setRenameModal(null)}
      />
    </>
  );
}

// ─── Main ChatScreen ──────────────────────────────────────────────────────────

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; text: string } | null>(null);

  // ── Keyboard offset tracking ──────────────────────────────────────────────
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll to bottom when keyboard opens
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };
    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => { subShow.remove(); subHide.remove(); };
  }, []);

  const {
    messages, conversations, currentConversationId,
    inputValue, setInputValue, isLoading, isThinking,
    messagesRemaining, resetTime,
    sendMessage, editMessage, deleteMessage, clearChat,
    selectConversation, startNewConversation,
    togglePinConversation, renameConversation, deleteConversation,
  } = useAIChatNative();

  const handleSend = useCallback((textOverride?: string) => {
    const textToSend = textOverride ?? inputValue;
    if (editingMessage) {
      if (textToSend.trim()) {
        editMessage(editingMessage.id, textToSend.trim());
        setEditingMessage(null);
        setInputValue('');
      }
    } else {
      if (textToSend.trim()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        sendMessage(textOverride);
        setInputValue('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    }
  }, [editingMessage, inputValue, editMessage, sendMessage, setInputValue]);

  const handleStartEdit = useCallback((id: string, text: string) => {
    setEditingMessage({ id, text });
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [setInputValue]);

  // Bottom area padding: when keyboard is open use keyboard height,
  // otherwise fall back to safe-area inset
  const bottomPad = keyboardHeight > 0
    ? keyboardHeight + 8
    : Math.max(insets.bottom, 16);

  const hasMessages = messages.length > 1;

  return (
    <View style={styles.root}>
      <AppBackground />

      {/* ── History Panel ── */}
      <HistoryPanel
        isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}
        messagesRemaining={messagesRemaining} resetTime={resetTime}
        conversations={conversations} activeConversationId={currentConversationId}
        onSelectConversation={async (id) => { await selectConversation(id); setIsPanelOpen(false); }}
        onTogglePin={togglePinConversation}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        onNewChat={async () => { clearChat(); await startNewConversation(); setIsPanelOpen(false); }}
        isOnline={true} isLoading={isLoading}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          {/* Right: menu (RTL → visually left) */}
          <Pressable onPress={() => setIsPanelOpen(true)} style={styles.iconButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
              <Path d="M3 12h18M3 6h18M3 18h18" />
            </Svg>
          </Pressable>

          {/* Center title */}
          <Text style={styles.headerTitle}>90Plus Captin AI</Text>

          {/* Left: back arrow */}
          <Pressable onPress={() => router.push('/')} style={styles.iconButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Content ── */}
      {!hasMessages ? (
        /* Welcome screen */
        <ScrollView
          contentContainerStyle={[
            styles.welcomeContent,
            { paddingTop: insets.top + 60 + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.welcomeHero}>
            <Text style={styles.welcomeTitle}>أهلاً يا محمود!</Text>
            <Text style={styles.welcomeSubtitle}>كيف أقدر أساعدك؟</Text>
            <Text style={styles.welcomeBrand}>90Plus AI</Text>
          </View>
          <View style={styles.chipGrid}>
            <View style={styles.chipRow}>
              <ChipButton icon="⚽" text="معلومات كرة القدم" onClick={() => handleSend('معلومات كرة القدم')} />
              <ChipButton icon="🌙" text="إحصائيات الدوريات" onClick={() => handleSend('إحصائيات الدوريات')} />
            </View>
            <View style={styles.chipRow}>
              <ChipButton icon="✏️" text="خطة تمرين" onClick={() => handleSend('خطة تمرين')} />
              <ChipButton icon="📅" text="نظام غذائي" onClick={() => handleSend('نظام غذائي')} />
            </View>
            <View style={styles.chipRow}>
              <ChipButton icon="🎵" text="نصائح الاستشفاء" onClick={() => handleSend('نصائح الاستشفاء')} />
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Messages list */
        <ScrollView
          ref={scrollViewRef}
          style={[styles.messagesList, { marginTop: insets.top + 60 }]}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.slice(1).map((msg, i) =>
            msg.role === 'ai' ? (
              <AIMessageBubble key={msg.id} message={msg} index={i} />
            ) : (
              <UserMessageBubble
                key={msg.id} message={msg} index={i}
                onResend={() => handleSend(msg.text)}
                onEdit={() => handleStartEdit(msg.id, msg.text)}
                onDelete={() => deleteMessage(msg.id)}
                onCopy={() => Clipboard.setString(msg.text)}
              />
            )
          )}
          {isThinking && (
            <ThinkingIndicator isThinking={isThinking} lastMessage={messages[messages.length - 1]?.text ?? ''} />
          )}
          {/* Spacer so last message doesn't hide behind input bar */}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* ── Input Bar — absolutely positioned, moves with keyboard ── */}
      <View
        style={[
          styles.bottomArea,
          { bottom: bottomPad },
        ]}
        pointerEvents="box-none"
      >
        {messagesRemaining === 0 && resetTime ? (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>انتهت رسائلك اليومية</Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            {/* Edit banner */}
            {editingMessage && (
              <View style={styles.editHeader}>
                <View style={styles.editLabel}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth={2}>
                    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </Svg>
                  <Text style={styles.editText}>تعديل الرسالة</Text>
                </View>
                <Pressable onPress={() => { setEditingMessage(null); setInputValue(''); }}>
                  <Text style={styles.editCancel}>×</Text>
                </Pressable>
              </View>
            )}

            {/* Input row */}
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={editingMessage ? 'عدّل...' : 'Ask 90Plus AI ...'}
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                textAlign="right"
                onSubmitEditing={() => handleSend()}
                blurOnSubmit={false}
              />
              <Pressable
                onPress={() => handleSend()}
                disabled={!inputValue.trim()}
                style={[styles.sendButton, inputValue.trim() && styles.sendButtonActive]}
              >
                {isLoading
                  ? <SpinnerRing />
                  : (
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </Svg>
                  )
                }
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>powered by mr.dev ai</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080608',
  },

  // ── Header ──
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    height: 60,
  },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  backArrow: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
  },

  // ── Welcome ──
  welcomeContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 120,
  },
  welcomeHero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28, fontWeight: '700',
    color: 'white', textAlign: 'center', marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 28, fontWeight: '700',
    color: 'white', textAlign: 'center', marginBottom: 12,
  },
  welcomeBrand: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  chipGrid: { width: '100%', alignItems: 'center', gap: 10 },
  chipRow: { flexDirection: 'row', gap: 10 },
  chipButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    height: 38,
  },
  chipIcon: { fontSize: 16, opacity: 0.7 },
  chipText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  // ── Messages ──
  messagesList: { flex: 1 },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },

  // ── Bottom / Input ──
  bottomArea: {
    position: 'absolute',
    left: 0, right: 0,
    paddingHorizontal: 16,
    zIndex: 40,
  },
  inputContainer: { width: '100%' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 30,
    minHeight: 52,
    paddingLeft: 6,
    paddingRight: 16,
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 4,
    flexShrink: 0,
  },
  sendButtonActive: { backgroundColor: '#7C3AED' },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 8,
    maxHeight: 120,
  },
  editHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.3)',
    borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 8,
    marginBottom: 8,
  },
  editLabel: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  editText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  editCancel: { fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: -2 },
  footerInfo: { alignItems: 'center', marginTop: 8 },
  footerText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  limitBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  limitText: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },

  // ── History Panel ──
  panel: {
    position: 'absolute', top: 0, bottom: 0, right: 0,
    zIndex: 100,
  },
  panelBackdrop: { backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99 },
  panelContent: { flex: 1, padding: 24 },
  panelHeader: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24,
  },
  panelTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  panelCloseButton: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  panelCloseText: { color: 'white', fontSize: 18 },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, padding: 16, marginBottom: 24,
  },
  profileLeft: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: 'white', fontWeight: '700', fontSize: 18 },
  onlineDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2, borderColor: '#0D0A14',
  },
  profileName: { color: 'white', fontWeight: '600', fontSize: 16 },
  onlineRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginTop: 2 },
  onlineText: { fontSize: 12, fontWeight: '500', color: '#34D399' },
  conversationsList: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: 8, marginBottom: 12, marginTop: 16,
  },
  sectionLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  conversationsGroup: { gap: 10 },
  historyItem: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)',
  },
  historyItemActive: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderColor: 'rgba(124,58,237,0.5)',
  },
  historyItemIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)',
  },
  historyItemContent: { flex: 1 },
  historyItemTitleRow: {
    flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between',
  },
  historyItemTitle: {
    color: 'white', fontWeight: '500', fontSize: 14, textAlign: 'right',
  },
  historyItemDate: {
    color: 'rgba(255,255,255,0.3)', fontSize: 10, textAlign: 'right', marginTop: 2,
  },
  newChatButton: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  newChatGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  newChatText: { color: 'white', fontWeight: '700', fontSize: 14 },

  // ── Online pulse ──
  onlinePulseContainer: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  onlinePulseRing: {
    position: 'absolute', width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#10B981',
  },
  onlinePulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },

  // ── Rename modal ──
  renameOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  renameCard: {
    width: '100%', maxWidth: 340, borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
  },
  renameContent: { padding: 24, gap: 16 },
  renameTitle: { fontSize: 20, fontWeight: '700', color: 'white', textAlign: 'right' },
  renameSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'right' },
  renameInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: 'white',
  },
  renameActions: {
    flexDirection: 'row', gap: 12, marginTop: 8, justifyContent: 'flex-end',
  },
  renameCancelBtn: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)',
  },
  renameCancelText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  renameConfirmBtn: { borderRadius: 12, overflow: 'hidden' },
  renameConfirmGradient: { paddingHorizontal: 24, paddingVertical: 12 },
  renameConfirmText: { fontSize: 14, fontWeight: '700', color: 'white' },

  // ── Spinner ──
  spinnerContainer: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  spinnerRing: {
    position: 'absolute', width: 20, height: 20, borderRadius: 10,
    borderTopWidth: 2, borderRightWidth: 2, borderColor: 'white',
  },
  spinnerSquare: { width: 6, height: 6, backgroundColor: 'white', borderRadius: 1 },
});