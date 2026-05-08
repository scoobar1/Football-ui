/**
 * MessageBubble.tsx — Native
 * AI and User chat bubbles with typing animation, markdown rendering,
 * and long-press context menu support.
 *
 * Mirrors web MessageBubble.tsx behavior exactly.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withDelay,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import {
  Colors,
  Radius,
  FontSize,
  LineHeight,
  Spacing,
  Gradients,
  BlurIntensity,
  Layout,
} from '../../../constants/theme';
import { MessageContextMenu } from '../chat/MessageContextMenu';
import { Message } from '@/src/hooks/useAIChatNative';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  index?: number;
  onResend?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

// ─── Markdown Parser ──────────────────────────────────────────────────────────
// Markdown helpers live outside the component to avoid recreating closures each render.

interface TableBlock {
  headers: string[];
  rows: string[][];
}

function isMarkdownTableLine(line: string): boolean {
  return line.includes('|');
}

function isMarkdownSeparator(line: string): boolean {
  const trimmed = line.trim().replace(/\|/g, '').trim();
  return /^:?-{3,}:?$/.test(trimmed) || /^:?-{3,}:?(\s+:?-{3,}:?)*$/.test(trimmed);
}

function parseTableLine(line: string): string[] {
  const normalized = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return normalized.split('|').map(cell => cell.trim());
}

function extractTableBlock(
  lines: string[],
  startIndex: number,
): { block: TableBlock; endIndex: number } | null {
  if (startIndex + 1 >= lines.length) return null;
  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];

  if (
    !isMarkdownTableLine(headerLine) ||
    !isMarkdownTableLine(separatorLine) ||
    !isMarkdownSeparator(separatorLine)
  ) return null;

  const headers = parseTableLine(headerLine);
  const rows: string[][] = [];
  let idx = startIndex + 2;

  while (idx < lines.length && isMarkdownTableLine(lines[idx])) {
    const row = parseTableLine(lines[idx]);
    if (row.length) rows.push(row);
    idx += 1;
  }

  return { block: { headers, rows }, endIndex: idx - 1 };
}

// ─── Inline Markdown ─────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <Text key={idx} style={styles.inlineBold}>{part.slice(2, -2)}</Text>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <Text key={idx} style={styles.inlineItalic}>{part.slice(1, -1)}</Text>;
    return part;
  });
}

function renderStructuredContent(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // Table
    const table = extractTableBlock(lines, i);
    if (table) {
      elements.push(
        <ScrollView key={`table-${i}`} horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              {table.block.headers.map((header, hIdx) => (
                <View key={`h-${hIdx}`} style={styles.tableCell}>
                  <Text style={styles.tableHeaderText}>{header}</Text>
                </View>
              ))}
            </View>
            {table.block.rows.map((row, rIdx) => (
              <View key={`r-${rIdx}`} style={[styles.tableRow, rIdx % 2 === 1 && styles.tableRowAlt]}>
                {row.map((cell, cIdx) => (
                  <View key={`c-${rIdx}-${cIdx}`} style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>,
      );
      i = table.endIndex;
      continue;
    }

    // Code block: ```
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('```')) {
        codeLines.push(lines[j]);
        j += 1;
      }
      elements.push(
        <View key={`code-${i}`} style={styles.codeBlock}>
          <Text style={styles.codeText}>{codeLines.join('\n')}</Text>
        </View>,
      );
      i = j;
      continue;
    }

    // Divider: ---
    if (/^-{3,}$/.test(line.trim())) {
      elements.push(<View key={`hr-${i}`} style={styles.divider} />);
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(<Text key={`h1-${i}`} style={styles.heading1}>{line.slice(2)}</Text>);
      continue;
    }
    // H2
    if (line.startsWith('## ')) {
      elements.push(<Text key={`h2-${i}`} style={styles.heading2}>{line.slice(3)}</Text>);
      continue;
    }
    // H3
    if (line.startsWith('### ')) {
      elements.push(<Text key={`h3-${i}`} style={styles.heading3}>{line.slice(4)}</Text>);
      continue;
    }

    // Bold title: **text** (full line)
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<Text key={`title-${i}`} style={styles.boldTitle}>{line.slice(2, -2)}</Text>);
      continue;
    }

    // Numbered list: 1. item
    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      elements.push(
        <View key={`num-${i}`} style={styles.bulletRow}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberBadgeText}>{numMatch[1]}</Text>
          </View>
          <Text style={styles.bulletText}>{renderInline(numMatch[2])}</Text>
        </View>,
      );
      continue;
    }

    // Bullet point
    if (line.startsWith('• ') || line.startsWith('- ')) {
      elements.push(
        <View key={`bullet-${i}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{renderInline(line.slice(2))}</Text>
        </View>,
      );
      continue;
    }

    // Empty line → spacer
    if (!line.trim()) {
      elements.push(<View key={`s-${i}`} style={styles.spacer} />);
      continue;
    }

    // Regular paragraph with inline formatting
    elements.push(
      <Text key={`p-${i}`} style={styles.paragraph}>{renderInline(line)}</Text>,
    );
  }

  return elements;
}

// ─── Streaming Cursor ─────────────────────────────────────────────────────────

const StreamingCursor = React.memo(function StreamingCursor() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // shared values مستقرة — [] صح هنا
    opacity.value = withRepeat(
      withTiming(0.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cursorStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text style={[styles.streamingCursor, cursorStyle]}>▋</Animated.Text>
  );
});

// ─── Wave Dot ─────────────────────────────────────────────────────────────────

const WaveDot = React.memo(function WaveDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Interval cleanup must live in effect teardown (not inside spring callback).
    let interval: ReturnType<typeof setInterval>;

    const doWave = () => {
      translateY.value = withSpring(-8, { stiffness: 200, damping: 8 }, () => {
        translateY.value = withSpring(0, { stiffness: 200, damping: 8 });
      });
    };

    const timeout = setTimeout(() => {
      doWave();
      interval = setInterval(doWave, 1400);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.waveDot, animStyle]} />;
});

// ─── Typing Indicator ─────────────────────────────────────────────────────────

export const TypingIndicator = React.memo(function TypingIndicator() {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.aiRow}>
      <View style={styles.aiBubbleOuter}>
        {isLiquidGlassSupported ? (
          <LiquidGlassView
            {...({
              style: StyleSheet.absoluteFill,
              tint: "rgba(30,15,50,0.72)",
              effect: "clear"
            } as any)}
          />
        ) : (
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.typingDots}>
          {([0, 150, 300] as const).map((delay, i) => (
            <WaveDot key={i} delay={delay} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
});

// ─── AI Message Bubble ────────────────────────────────────────────────────────

export const AIMessageBubble = React.memo(function AIMessageBubble({
  message,
  index = 0,
}: MessageBubbleProps) {
  // Reset cached stream when the message id changes.
  const initialTextRef = useRef<string | null>(null);
  const prevMessageId = useRef<string | null>(null);

  const [visibleText, setVisibleText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  // Timestamp fade on tap
  const timestampOpacity = useSharedValue(0);
  const timestampStyle = useAnimatedStyle(() => ({ opacity: timestampOpacity.value }));

  const handleBubblePress = useCallback(() => {
    timestampOpacity.value = withTiming(1, { duration: 200 });
    timestampOpacity.value = withDelay(2500, withTiming(0, { duration: 300 }));
  }, []);

  useEffect(() => {
    let mounted = true;
    const fullText = message.text ?? '';

    // Reset ref لما message.id يتغير
    if (prevMessageId.current !== message.id) {
      prevMessageId.current = message.id;
      initialTextRef.current = null;
    }

    if (initialTextRef.current === null) {
      initialTextRef.current = fullText;
    }

    // Streaming mode — text arrives token-by-token
    if (initialTextRef.current === '') {
      setVisibleText(fullText);
      setTypingDone(true);
      return () => { mounted = false; };
    }

    // History mode — local typing animation
    setVisibleText('');
    setTypingDone(false);

    if (!fullText) {
      setTypingDone(true);
      return () => { mounted = false; };
    }

    let charIndex = 0;
    const textLen = fullText.length;
    const step = textLen > 1000 ? 6 : textLen > 500 ? 4 : 2;
    const interval = textLen > 1000 ? 8 : 14;

    const timer = setInterval(() => {
      if (!mounted) return;
      charIndex = Math.min(textLen, charIndex + step);
      setVisibleText(fullText.slice(0, charIndex));
      if (charIndex >= textLen) {
        clearInterval(timer);
        setTypingDone(true);
      }
    }, interval);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [message.id]); // message.id فقط — مقصود

  const displayText = typingDone ? (message.text ?? '') : visibleText;
  const isStreaming = initialTextRef.current === '' && message.text !== '' && !typingDone;
  const showCursor = isStreaming || (!typingDone && initialTextRef.current !== '');
  const renderedContent = useMemo(() => renderStructuredContent(displayText), [displayText]);

  return (
    <Animated.View
      entering={FadeIn
        .withInitialValues({ transform: [{ translateX: 30 }], opacity: 0 })
        .springify()
        .stiffness(180)
        .damping(12)
        .delay(index * 40)}
      style={styles.aiRow}
    >
      <View style={styles.aiMaxWidth}>
        <Pressable
          onPress={handleBubblePress}
          accessibilityRole="text"
          accessibilityLabel={`AI message: ${displayText}`}
        >
          <View style={styles.aiBubbleOuter}>
            {isLiquidGlassSupported ? (
              <LiquidGlassView
                {...({
                  style: StyleSheet.absoluteFill,
                  tint: "rgba(30,15,50,0.72)",
                  effect: "clear"
                } as any)}
              />
            ) : (
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            <LinearGradient
              colors={['rgba(168,85,247,0.08)', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.aiBubbleContent}>
              <View style={styles.textContent}>
                {renderedContent}
                {showCursor && <StreamingCursor />}
              </View>
            </View>
          </View>
        </Pressable>

        {/* Timestamp — يظهر عند الضغط فقط */}
        <Animated.Text style={[styles.aiTimestamp, timestampStyle]}>
          {message.time}
        </Animated.Text>
      </View>
    </Animated.View>
  );
});

// ─── User Message Bubble ──────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const UserMessageBubble = React.memo(function UserMessageBubble({
  message,
  index = 0,
  onResend,
  onEdit,
  onDelete,
  onCopy,
}: MessageBubbleProps) {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const scale = useSharedValue(1);

  // Timestamp fade on tap
  const timestampOpacity = useSharedValue(0);
  const timestampStyle = useAnimatedStyle(() => ({ opacity: timestampOpacity.value }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { stiffness: 300, damping: 20 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { stiffness: 300, damping: 20 });
  }, []);

  const handlePress = useCallback(() => {
    timestampOpacity.value = withTiming(1, { duration: 200 });
    timestampOpacity.value = withDelay(2500, withTiming(0, { duration: 300 }));
  }, []);

  const handleLongPress = useCallback(() => {
    setContextMenuVisible(true);
  }, []);

  const handleClose = useCallback(() => setContextMenuVisible(false), []);

  const handleResend = useCallback(() => {
    onResend?.();
    setContextMenuVisible(false);
  }, [onResend]);

  const handleEdit = useCallback(() => {
    onEdit?.();
    setContextMenuVisible(false);
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.();
    setContextMenuVisible(false);
  }, [onDelete]);

  const handleCopy = useCallback(() => {
    onCopy?.();
    setContextMenuVisible(false);
  }, [onCopy]);

  return (
    <>
      <Animated.View
        entering={FadeIn
          .withInitialValues({ transform: [{ translateX: -30 }], opacity: 0 })
          .springify()
          .stiffness(180)
          .damping(12)
          .delay(index * 40)}
        style={styles.userRow}
      >
        <View style={styles.userMaxWidth}>
          <AnimatedPressable
            style={animatedStyle}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={450}
            accessibilityRole="text"
            accessibilityLabel={`Your message: ${message.text}`}
          >
            <View style={styles.userBubbleOuter}>
              <LinearGradient
                colors={['rgba(124,58,237,0.55)', 'rgba(91,33,182,0.45)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.userText}>{message.text}</Text>
            </View>
          </AnimatedPressable>

          {/* Timestamp — يظهر عند الضغط فقط */}
          <Animated.Text style={[styles.userTimestamp, timestampStyle]}>
            {message.time}
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Context menu mounts even when optional handlers are omitted */}
      {contextMenuVisible && (
        <MessageContextMenu
          messageText={message.text}
          onResend={handleResend}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onClose={handleClose}
        />
      )}
    </>
  );
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // AI bubble
  aiRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  aiMaxWidth: {
    maxWidth: '85%',
  },
  aiBubbleOuter: {
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(168,85,247,0.22)',
    overflow: 'hidden',
    maxWidth: '82%',
  },
  aiBubbleContent: {
    padding: Spacing.base,
    zIndex: 1,
  },
  textContent: {
    gap: Spacing.xs / 2,
  },
  aiTimestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs / 2,
    marginLeft: Spacing.xs,
    textAlign: 'left',
  },

  // User bubble
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  userMaxWidth: {
    maxWidth: '75%',
  },
  userBubbleOuter: {
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(168,85,247,0.4)',
    overflow: 'hidden',
    maxWidth: '82%',
    alignSelf: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  userText: {
    fontSize: FontSize['md+'],
    color: Colors.white,
    lineHeight: LineHeight.relaxed,
    textAlign: 'left',
  },
  userTimestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs / 2,
    marginLeft: Spacing.xs,
    textAlign: 'left',
  },

  // Typing indicator
  typingBubbleWrapper: {
    borderRadius: Radius.bubble,
    borderBottomRightRadius: Radius.bubbleTailAI,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.aiBubbleBorder,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  waveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.purpleSoft,
  },

  // Streaming cursor
  streamingCursor: {
    color: 'rgba(196,181,253,0.8)',
    fontSize: FontSize.md,
  },

  // Markdown: paragraph
  paragraph: {
    fontSize: FontSize['md+'],
    color: Colors.textPrimary,
    lineHeight: LineHeight.relaxed,
    textAlign: 'left',
  },

  // Markdown: bold title
  boldTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.sm,
    marginBottom: 2,
    textAlign: 'left',
  },

  // Markdown: bullet
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bulletDot: {
    color: Colors.purpleSoft,
    marginTop: 2,
    fontSize: FontSize['md+'],
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize['md+'],
    color: Colors.white80,
    lineHeight: LineHeight.relaxed,
    textAlign: 'left',
  },

  // Markdown: spacer
  spacer: {
    height: Spacing.xs,
  },

  // Markdown: headings
  heading1: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.white,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white10,
    paddingBottom: Spacing.xs,
  },
  heading2: {
    fontSize: FontSize['3xl'],
    fontWeight: '700',
    color: Colors.white90,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textAlign: 'left',
  },
  heading3: {
    fontSize: FontSize['2xl'],
    fontWeight: '600',
    color: Colors.purpleSoft,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'left',
  },

  // Markdown: code block
  codeBlock: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.white10,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.purpleSoft,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: FontSize.sm,
    color: '#a78bfa',
    lineHeight: 20,
  },

  // Markdown: divider
  divider: {
    height: 0.5,
    backgroundColor: Colors.white10,
    marginVertical: Spacing.md,
  },

  // Markdown: numbered list
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.purpleDeep,
    borderWidth: 0.5,
    borderColor: Colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  numberBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.purpleSoft,
  },

  // Inline formatting
  inlineBold: {
    fontWeight: '700',
    color: Colors.white,
  },
  inlineItalic: {
    fontStyle: 'italic',
    color: Colors.white80,
  },

  // Markdown: table
  tableScroll: {
    marginVertical: Spacing.sm,
  },
  table: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.borderSubtle,
    minWidth: 320,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 0.5,
    borderColor: Colors.borderSubtle,
    minWidth: 80,
  },
  tableHeaderText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.white90,
    textAlign: 'left',
  },
  tableCellText: {
    fontSize: FontSize.base,
    color: Colors.white80,
    textAlign: 'left',
  },
});