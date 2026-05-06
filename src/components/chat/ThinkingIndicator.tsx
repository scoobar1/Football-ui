/**
 * ThinkingIndicator.tsx — Optimized Version (Production Ready)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors, Radius, FontSize, Spacing, BlurIntensity, Duration } from '../../../constants/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'thinking' | 'done' | 'error';

interface ThinkingIndicatorProps {
  lastMessage?: string;
  isThinking: boolean;
  status?: Status;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateThinkingSteps(message: string): string[] {
  if (!message) {
    return ['جاري تحليل السؤال...', 'تجهيز الرد...'];
  }

  const clean = message.replace(/[؟?.,!]/g, '');
  const words = clean.split(' ').filter(w => w.length > 2);

  const keyword =
    words.sort((a, b) => b.length - a.length)[0] || 'البيانات';

  // Smart steps based on intent
  if (message.includes('كام') || message.includes('كم')) {
    return [
      'تحليل السؤال الرقمي...',
      `البحث عن أرقام تخص "${keyword}"...`,
      'حساب النتيجة...',
    ];
  }

  if (message.includes('ازاي') || message.includes('كيف')) {
    return [
      'فهم المطلوب خطوة بخطوة...',
      `تحليل "${keyword}"...`,
      'تجهيز شرح واضح...',
    ];
  }

  return [
    'تحليل سؤال المستخدم...',
    `البحث عن "${keyword}"...`,
    'صياغة الإجابة...',
  ];
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function BrainIcon({ status }: { status: Status }) {
  if (status === 'done') return <Text style={{ fontSize: 16 }}>✅</Text>;
  if (status === 'error') return <Text style={{ fontSize: 16 }}>⚠️</Text>;
  return <Text style={{ fontSize: 16 }}>🧠</Text>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ThinkingIndicator({
  lastMessage,
  isThinking,
  status = 'thinking',
}: ThinkingIndicatorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [duration, setDuration] = useState(0);

  const steps = useMemo(
    () => generateThinkingSteps(lastMessage ?? ''),
    [lastMessage]
  );

  // ─── Animations ────────────────────────────────────────────────────────────

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (status !== 'thinking') {
      pulse.value = withTiming(1);
      return;
    }

    pulse.value = withRepeat(
      withTiming(0.4, { duration: 400 }),
      -1,
      true
    );
  }, [status]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: interpolate(pulse.value, [0.4, 1], [0.95, 1.05]) }],
  }));

  // Expand animation
  const expand = useSharedValue(1);

  useEffect(() => {
    expand.value = withSpring(isOpen ? 1 : 0, { damping: 18 });
  }, [isOpen]);

  const contentStyle = useAnimatedStyle(() => ({
    height: expand.value === 0 ? 0 : 'auto',
    opacity: expand.value,
  }));

  // ─── Timers ────────────────────────────────────────────────────────────────

  // Duration
  useEffect(() => {
    if (!isThinking) return;

    const timer = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isThinking]);

  // Steps
  useEffect(() => {
    if (!isThinking) return;

    setCurrentStep(0);

    const stepTimer = setInterval(() => {
      setCurrentStep(s =>
        s < steps.length - 1 ? s + 1 : s
      );
    }, Duration.thinkingStep);

    return () => clearInterval(stepTimer);
  }, [steps, isThinking]);

  // Reset when done
  useEffect(() => {
    if (!isThinking) {
      setDuration(0);
      setCurrentStep(steps.length - 1);
    }
  }, [isThinking]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const toggleOpen = () => setIsOpen(p => !p);

  const formattedTime = `${Math.floor(duration / 60)}:${(duration % 60)
    .toString()
    .padStart(2, '0')}`;

  const getStatusText = () => {
    if (status === 'done') return 'تم تجهيز الرد';
    if (status === 'error') return 'حصل خطأ';
    return `جاري التفكير (${formattedTime})`;
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!isThinking && status === 'thinking') return null;

  return (
    <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)} style={styles.container}>
      <View style={styles.wrapper}>
        {/* Trigger */}
        <Pressable onPress={toggleOpen} style={styles.trigger}>
          <BlurView intensity={BlurIntensity.glass} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.triggerContent}>
            <View style={styles.left}>
              <Animated.View style={pulseStyle}>
                <BrainIcon status={status} />
              </Animated.View>
              <Text style={styles.text}>{getStatusText()}</Text>
            </View>
            <Text style={styles.chevron}>{isOpen ? '▴' : '▾'}</Text>
          </View>
        </Pressable>

        {/* Content */}
        {isOpen && (
          <Animated.View style={[styles.content, contentStyle]}>
            <BlurView intensity={BlurIntensity.glass} tint="dark" style={StyleSheet.absoluteFill} />

            <View style={styles.steps}>
              {steps.map((step, i) => {
                const visible = i <= currentStep;
                if (!visible) return null;

                const isActive = i === currentStep;

                return (
                  <Animated.View
                    key={i}
                    entering={FadeIn.delay(i * 80)}
                    style={styles.stepRow}
                  >
                    <View
                      style={[
                        styles.dot,
                        isActive ? styles.dotActive : styles.dotPast,
                      ]}
                    />
                    <Text
                      style={[
                        styles.stepText,
                        isActive ? styles.textActive : styles.textPast,
                      ]}
                    >
                      {step}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginVertical: Spacing.sm,
  },
  wrapper: {
    width: '85%',
    maxWidth: 280,
  },
  trigger: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  triggerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    color: Colors.white70,
    fontSize: FontSize.md,
    writingDirection: 'rtl',
  },
  chevron: {
    color: Colors.white50,
  },
  content: {
    borderRadius: Radius.xl,
    marginTop: 4,
    overflow: 'hidden',
  },
  steps: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.purpleSoft,
  },
  dotPast: {
    backgroundColor: 'rgba(124,58,237,0.4)',
  },
  stepText: {
    fontSize: FontSize.base,
    writingDirection: 'rtl',
  },
  textActive: {
    color: Colors.white80,
  },
  textPast: {
    color: Colors.white40,
  },
});