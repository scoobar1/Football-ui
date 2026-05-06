import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Flame,
  Trophy,
  Shuffle,
  BookMarked,
  Crown,
  Cpu,
} from 'lucide-react-native';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  PURPLE_PRIMARY,
  GOLD_PRIMARY,
  BLUE_PRIMARY,
  SCREEN_PADDING_H,
  GRADIENT_HERO_PURPLE_BLUE,
  GRADIENT_QUIZ_STREAK,
  GRADIENT_CTA_PURPLE,
  BORDER_ARENA,
} from '../../../constants/tokens';

type Deck = {
  key: string;
  title: string;
  desc: string;
  xp: number;
  accent: string;
  tier: string;
  Icon: typeof BookMarked;
};

const DECKS: Deck[] = [
  {
    key: 'history',
    title: 'Football history',
    desc: 'Quick hits on clubs and trophies',
    xp: 40,
    accent: '#38bdf8',
    tier: 'Warm-up',
    Icon: BookMarked,
  },
  {
    key: 'legends',
    title: 'Legends & talent',
    desc: 'Recognize players by one stat or cue',
    xp: 55,
    accent: '#f472b6',
    tier: 'Pro',
    Icon: Crown,
  },
  {
    key: 'tactics',
    title: 'Tactics & analytics',
    desc: 'Formations and moments that matter',
    xp: 65,
    accent: '#34d399',
    tier: 'Elite',
    Icon: Cpu,
  },
];

function StreakPulse() {
  const o = useSharedValue(0.45);
  useEffect(() => {
    o.value = withRepeat(
      withSequence(withTiming(1, { duration: 1100 }), withTiming(0.45, { duration: 1100 })),
      -1,
      false,
    );
  }, [o]);
  const glow = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <View style={styles.streakPulseWrap}>
      <Animated.View style={[styles.streakPulse, glow]} />
      <Flame size={22} color={GOLD_PRIMARY} strokeWidth={2.4} />
    </View>
  );
}

function HudCornersSmall() {
  return (
    <>
      <View style={[styles.hudC, styles.hudTL]} />
      <View style={[styles.hudC, styles.hudTR]} />
      <View style={[styles.hudC, styles.hudBL]} />
      <View style={[styles.hudC, styles.hudBR]} />
    </>
  );
}

export default function QuizHubScreen() {
  return (
    <MainShell
      title="Quiz arena"
      subtitle="Stack streaks, chase XP tiers, and clear decks — backend gameplay hooks in next."
    >
      <View style={styles.heroStrip}>
        <LinearGradient
          colors={[...GRADIENT_HERO_PURPLE_BLUE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroEyebrow}>Daily ladder</Text>
            <Text style={styles.heroTitle}>Clear decks · climb tiers</Text>
          </View>
          <View style={styles.heroXpChip}>
            <Text style={styles.heroXpLabel}>Bonus pool</Text>
            <Text style={styles.heroXpVal}>+240 XP</Text>
          </View>
        </View>
      </View>

      <View style={styles.streakOuter}>
        <LinearGradient
          colors={[...GRADIENT_QUIZ_STREAK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.streakBeam} />
        <HudCornersSmall />
        <View style={styles.streakInner}>
          <View style={styles.streakTop}>
            <View>
              <Text style={styles.streakEyebrow}>STREAK SHIELD</Text>
              <Text style={styles.streakBig}>7 days</Text>
              <Text style={styles.streakSub}>Answer daily — freeze protection coming with accounts.</Text>
            </View>
            <StreakPulse />
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[PURPLE_PRIMARY, BLUE_PRIMARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: '72%' }]}
            />
          </View>
          <View style={styles.streakMeta}>
            <Text style={styles.streakMetaTxt}>Next milestone · 10-day crest</Text>
            <Trophy size={14} color={GOLD_PRIMARY} strokeWidth={2.2} />
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Pick a deck</Text>
      <Text style={styles.sectionHint}>Higher tiers mean harder prompts and bigger XP.</Text>

      {DECKS.map((deck, index) => (
        <Animated.View key={deck.key} entering={FadeInDown.delay(60 * index).springify().damping(17)}>
          <TouchableOpacity activeOpacity={0.9} style={styles.deckOuter}>
            <LinearGradient
              colors={[`${deck.accent}18`, 'rgba(10,8,18,0.98)', 'rgba(4,3,10,0.99)']}
              locations={[0, 0.4, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.deckAccentBar, { backgroundColor: deck.accent }]} />
            <View style={styles.deckRow}>
              <LinearGradient
                colors={[`${deck.accent}44`, 'rgba(0,0,0,0.35)']}
                style={styles.deckIconTile}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <deck.Icon size={22} color={TEXT_PRIMARY} strokeWidth={2.2} />
              </LinearGradient>
              <View style={styles.deckMid}>
                <View style={styles.deckTitleRow}>
                  <Text style={styles.deckTitle}>{deck.title}</Text>
                  <View style={[styles.tierPill, { borderColor: `${deck.accent}55` }]}>
                    <Text style={[styles.tierTxt, { color: deck.accent }]}>{deck.tier}</Text>
                  </View>
                </View>
                <Text style={styles.deckDesc}>{deck.desc}</Text>
              </View>
              <LinearGradient
                colors={[GOLD_PRIMARY, '#ca8a04']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.xpOrb}
              >
                <Text style={styles.xpOrbTxt}>+{deck.xp}</Text>
                <Text style={styles.xpOrbSub}>XP</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <TouchableOpacity activeOpacity={0.92} style={styles.ctaWrap}>
        <LinearGradient
          colors={['rgba(124,58,237,0.35)', 'rgba(59,130,246,0.2)']}
          style={styles.ctaBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={[...GRADIENT_CTA_PURPLE]}
            style={styles.ctaInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Shuffle size={22} color="#fff" strokeWidth={2.4} />
            <Text style={styles.ctaTxt}>Random round</Text>
            <Text style={styles.ctaSub}>Mix decks · surprise modifiers later</Text>
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  heroStrip: {
    marginHorizontal: -SCREEN_PADDING_H,
    marginBottom: 16,
    paddingHorizontal: SCREEN_PADDING_H,
    paddingVertical: 14,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_ARENA,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroEyebrow: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 6,
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroXpChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.35)',
    alignItems: 'flex-end',
  },
  heroXpLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: TEXT_MUTED,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroXpVal: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '900',
    color: GOLD_PRIMARY,
    fontVariant: ['tabular-nums'],
  },

  streakOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 158,
    shadowColor: GOLD_PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  streakBeam: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: GOLD_PRIMARY,
    opacity: 0.75,
  },
  streakInner: {
    padding: 16,
    zIndex: 2,
  },
  streakTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streakEyebrow: {
    color: GOLD_PRIMARY,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  streakBig: {
    color: TEXT_PRIMARY,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  streakSub: {
    marginTop: 8,
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    maxWidth: '78%',
  },
  streakPulseWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakPulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: GOLD_PRIMARY,
  },
  progressTrack: {
    marginTop: 16,
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  streakMeta: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakMetaTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.3,
  },

  hudC: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: 'rgba(255,255,255,0.14)',
    zIndex: 3,
  },
  hudTL: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  hudTR: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  hudBL: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  hudBR: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },

  sectionLabel: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionHint: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },

  deckOuter: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  deckAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    opacity: 0.9,
  },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    zIndex: 2,
  },
  deckIconTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  deckMid: {
    flex: 1,
    minWidth: 0,
  },
  deckTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  deckTitle: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  tierPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tierTxt: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  deckDesc: {
    marginTop: 6,
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
  },
  xpOrb: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
  },
  xpOrbTxt: {
    color: '#0c0a12',
    fontSize: 15,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  xpOrbSub: {
    marginTop: -2,
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(12,10,18,0.65)',
    letterSpacing: 1,
  },

  ctaWrap: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 18,
    overflow: 'hidden',
  },
  ctaBorder: {
    padding: 2,
    borderRadius: 18,
  },
  ctaInner: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 16,
    gap: 4,
  },
  ctaTxt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
    marginTop: 4,
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
