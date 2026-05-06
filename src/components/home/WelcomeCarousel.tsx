import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn, FadeOut, FadeInDown,
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSpring, withSequence, withDelay,
  Easing, interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  BG_MID, BG_SURFACE,
} from '../../../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = 240;
const AUTO_SCROLL_INTERVAL = 5000;

// ─── Slide data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 0,
    kicker: 'WELCOME BACK',
    title: 'Hey Ahmed! 👋',
    subtitle: '🔥 7-day streak! Keep it up.',
    buttonText: 'View Profile',
    gradient: [BG_MID, BG_SURFACE, '#0a0814'] as const,
    accentColor: '#A78BFA',
    glowColor: '#7C3AED',
    glowColor2: '#3B82F6',   // ← Electric Blue second orb
    iconEmoji: '👤',
    badge: 'LVL 12',
    badgeBg: 'rgba(124,58,237,0.18)',
    badgeColor: '#A78BFA',
    badgeBorder: 'rgba(167,139,250,0.3)',
    // Purple → Blue CTA gradient
    ctaGradient: ['#7C3AED', '#3B82F6'] as const,
    ctaTextColor: '#fff',
    kicker_label: 'WELCOME BACK',
  },
  {
    id: 1,
    kicker: 'DAILY REWARD',
    title: '🎰 Lucky Wheel',
    subtitle: 'Spin & Win up to 500 Coins daily',
    buttonText: 'Try Your Luck',
    gradient: ['#1a0800', '#2a1000', '#1a0800'] as const,
    accentColor: '#ff9472',
    glowColor: '#fc4d00',
    glowColor2: '#3B82F6',   // ← Blue accent
    iconEmoji: '🎰',
    badge: 'AVAILABLE',
    badgeBg: 'rgba(255,122,61,0.2)',
    badgeColor: '#FF7A3D',
    badgeBorder: 'rgba(255,122,61,0.35)',
    ctaGradient: ['rgba(255,148,114,0.5)', 'rgba(255,148,114,0.25)'] as const,
    ctaTextColor: '#fff',
    kicker_label: 'AVAILABLE NOW',
  },
  {
    id: 2,
    kicker: 'PREDICTIONS',
    title: '⚽ Predict Today',
    subtitle: '5 matches remaining to predict',
    buttonText: 'Predict Now',
    gradient: ['#001a15', '#002a20', '#001510'] as const,
    accentColor: '#38ef7d',
    glowColor: '#11998e',
    glowColor2: '#60A5FA',   // ← Blue accent
    iconEmoji: '⚽',
    badge: '5 LEFT',
    badgeBg: 'rgba(17,153,142,0.2)',
    badgeColor: '#11998E',
    badgeBorder: 'rgba(17,153,142,0.35)',
    ctaGradient: ['rgba(56,239,125,0.4)', 'rgba(56,239,125,0.2)'] as const,
    ctaTextColor: '#fff',
    kicker_label: 'PREDICTIONS',
  },
  {
    id: 3,
    kicker: 'DAILY QUIZ',
    title: '🧠 Daily Quiz',
    subtitle: 'Test your football knowledge',
    buttonText: 'Start Quiz',
    gradient: ['#0a0020', '#150040', '#0a0018'] as const,
    accentColor: '#ac8aff',
    glowColor: '#8E54E9',
    glowColor2: '#3B82F6',   // ← Blue accent
    iconEmoji: '🧠',
    badge: 'NEW',
    badgeBg: 'rgba(142,84,233,0.2)',
    badgeColor: '#8E54E9',
    badgeBorder: 'rgba(142,84,233,0.35)',
    ctaGradient: ['rgba(172,138,255,0.4)', 'rgba(172,138,255,0.2)'] as const,
    ctaTextColor: '#fff',
    kicker_label: 'DAILY QUIZ',
  },
  {
    id: 4,
    kicker: 'LEADERBOARD',
    title: "🏆 You're #42",
    subtitle: 'Compete with the best fans',
    buttonText: 'See Rankings',
    gradient: ['#1a0010', '#2a0020', '#150010'] as const,
    accentColor: '#f5576c',
    glowColor: '#f093fb',
    glowColor2: '#60A5FA',   // ← Blue accent
    iconEmoji: '🏆',
    badge: 'RANK #42',
    badgeBg: 'rgba(245,87,108,0.2)',
    badgeColor: '#F5576C',
    badgeBorder: 'rgba(245,87,108,0.35)',
    ctaGradient: ['rgba(245,87,108,0.4)', 'rgba(245,87,108,0.2)'] as const,
    ctaTextColor: '#fff',
    kicker_label: 'LEADERBOARD',
  },
];

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────
function CarouselSkeleton() {
  const shimmerX = useSharedValue(-SCREEN_WIDTH);

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(SCREEN_WIDTH, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <View style={styles.skeletonCard}>
      {/* Moving shimmer strip */}
      <Animated.View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <Animated.View style={[styles.shimmerStrip, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.12)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 120, height: '100%' }}
          />
        </Animated.View>
      </Animated.View>
      {/* Skeleton lines */}
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '35%', height: 8, marginBottom: 10 }]} />
        <View style={[styles.skeletonLine, { width: '60%', height: 22, marginBottom: 8 }]} />
        <View style={[styles.skeletonLine, { width: '80%', height: 14, marginBottom: 4 }]} />
        <View style={[styles.skeletonLine, { width: '40%', height: 14 }]} />
      </View>
      <View style={styles.skeletonBottom}>
        <View style={[styles.skeletonLine, { width: '45%', height: 38, borderRadius: 20 }]} />
        <View style={styles.skeletonDots}>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.skeletonDot, i === 0 && { width: 20 }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Ambient Glow Orbs ────────────────────────────────────────────────────────
function AmbientGlowOrbs({ color1, color2 }: { color1: string; color2: string }) {
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);

  useEffect(() => {
    pulse1.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true
    );
    pulse2.value = withDelay(1500, withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }), -1, true
    ));
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse1.value, [0, 1], [0.08, 0.2]),
    transform: [{ scale: interpolate(pulse1.value, [0, 1], [0.8, 1.2]) }],
  }));
  const orb2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse2.value, [0, 1], [0.06, 0.15]),
    transform: [{ scale: interpolate(pulse2.value, [0, 1], [1, 1.3]) }],
  }));

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: color1 }, orb1Style]}
      />
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: color2 }, orb2Style]}
      />
    </>
  );
}

// ─── Shimmer Sweep ────────────────────────────────────────────────────────────
function ShimmerSweep() {
  const shimmerAnim = useSharedValue(0);
  useEffect(() => {
    shimmerAnim.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }), -1, false
    );
  }, []);
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmerAnim.value, [0, 1], [-SCREEN_WIDTH, SCREEN_WIDTH]) }],
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 5, overflow: 'hidden' }]} pointerEvents="none">
      <Animated.View style={shimmerStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 120, height: CARD_HEIGHT }}
        />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Main Carousel ────────────────────────────────────────────────────────────
interface WelcomeCarouselProps {
  isLoading?: boolean;
}

export function WelcomeCarousel({ isLoading = false }: WelcomeCarouselProps) {
  const [current, setCurrent] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardScale = useSharedValue(1);

  const startAuto = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, AUTO_SCROLL_INTERVAL);
  }, []);

  useEffect(() => {
    startAuto();
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [startAuto]);

  const handleCardPress = useCallback(() => {
    Haptics.selectionAsync();
    cardScale.value = withSequence(
      withSpring(0.96, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    setCurrent(prev => (prev + 1) % slides.length);
    startAuto();
  }, [startAuto]);

  const handleDotPress = useCallback((index: number) => {
    Haptics.selectionAsync();
    setCurrent(index);
    startAuto();
  }, [startAuto]);

  const handleButtonPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const slide = slides[current];

  if (isLoading) {
    return (
      <Animated.View entering={FadeInDown.delay(200).springify().damping(14)} style={styles.container}>
        <CarouselSkeleton />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(200).springify().damping(14)} style={styles.container}>
      <TouchableOpacity activeOpacity={0.98} onPress={handleCardPress}>
        <Animated.View style={cardAnimStyle}>
          <Animated.View key={current} entering={FadeIn.duration(500)} exiting={FadeOut.duration(250)}>
            <View style={styles.card}>
              {/* Deep gradient background */}
              <LinearGradient
                colors={slide.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Ambient glow orbs */}
              <AmbientGlowOrbs color1={slide.glowColor} color2={slide.glowColor2} />

              {/* Glass overlay */}
              <View style={styles.glassOverlay} />

              {/* Shimmer sweep */}
              <ShimmerSweep />

              {/* Card Content */}
              <View style={styles.cardContent}>
                {/* Top Row */}
                <View style={styles.topRow}>
                  <View style={styles.titleBlock}>
                    <Text style={styles.kickerLabel}>{slide.kicker_label}</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>{slide.title}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: slide.badgeBg, borderColor: slide.badgeBorder }]}>
                    <Text style={[styles.badgeText, { color: slide.badgeColor }]}>{slide.badge}</Text>
                  </View>
                </View>

                {/* Middle Row */}
                <View style={styles.middleRow}>
                  <View style={[styles.iconCircle, { backgroundColor: `${slide.accentColor}15` }]}>
                    <Text style={styles.iconEmoji}>{slide.iconEmoji}</Text>
                  </View>
                  <View style={styles.subtitleBlock}>
                    <Text style={styles.subtitleText} numberOfLines={2}>{slide.subtitle}</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.bottomRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleButtonPress} activeOpacity={0.85}>
                    <LinearGradient
                      colors={slide.ctaGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.actionButtonGradient}
                    >
                      <Text style={[styles.actionButtonText, { color: slide.ctaTextColor }]}>
                        {slide.buttonText}
                      </Text>
                      <Text style={[styles.actionButtonChevron, { color: slide.ctaTextColor }]}>›</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Dots */}
                  <View style={styles.dotsContainer}>
                    {slides.map((_, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleDotPress(i)}
                        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                      >
                        <View
                          style={[
                            styles.dot,
                            i === current && [
                              styles.dotActive,
                              {
                                backgroundColor: slide.accentColor,
                                shadowColor: slide.accentColor,
                                shadowRadius: 6,
                                shadowOpacity: 0.6,
                                shadowOffset: { width: 0, height: 0 },
                              },
                            ],
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
    marginHorizontal: 16,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderLeftColor: 'rgba(255,255,255,0.05)',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.02)',
    borderBottomColor: 'rgba(255,255,255,0.02)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 16,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25,25,30,0.3)',
  },

  // ── Content ───────────────────────────────────────────────────────────────
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBlock: { flex: 1, marginRight: 12 },
  kickerLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  middleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 26 },
  subtitleBlock: { flex: 1 },
  subtitleText: {
    fontSize: 14, fontWeight: '600',
    color: 'rgba(255,255,255,0.75)', lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 12,
  },
  actionButton: { borderRadius: 20, overflow: 'hidden', flex: 1 },
  actionButtonGradient: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  actionButtonText: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  actionButtonChevron: { fontSize: 20, fontWeight: '300', lineHeight: 22 },
  dotsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: { width: 20, height: 6, borderRadius: 3, elevation: 4 },

  // ── Skeleton ──────────────────────────────────────────────────────────────
  skeletonCard: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    justifyContent: 'space-between',
  },
  shimmerStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  skeletonContent: { gap: 0 },
  skeletonLine: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    marginBottom: 0,
  },
  skeletonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonDots: { flexDirection: 'row', gap: 6 },
  skeletonDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
