import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Medal, Zap, Trophy, TrendingUp } from 'lucide-react-native';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  GOLD_PRIMARY,
  SCREEN_PADDING_H,
  GRADIENT_HERO_RANK,
  GRADIENT_HERO_PURPLE_BLUE,
} from '../../../constants/tokens';

type Tier = 'gold' | 'silver' | 'bronze';

type TopPlayer = {
  rank: string;
  name: string;
  pts: string;
  ptsRaw: number;
  tier: Tier;
  highlight?: boolean;
};

const TOP3: TopPlayer[] = [
  { rank: '1', name: 'Sara', pts: '8,420', ptsRaw: 8420, tier: 'gold', highlight: true },
  { rank: '2', name: 'Omar 7', pts: '7,955', ptsRaw: 7955, tier: 'silver' },
  { rank: '3', name: 'Layla GK', pts: '7,540', ptsRaw: 7540, tier: 'bronze' },
];

/** Podium visual order: Silver | Gold | Bronze */
const PODIUM_ORDER = [1, 0, 2] as const;

const REST = [
  { r: '4', n: 'Khalid FC', pts: '6,902' },
  { r: '5', n: 'Nora', pts: '6,801' },
  { r: '6', n: 'Youssef', pts: '6,210' },
  { r: '7', n: 'Miral', pts: '6,089' },
  { r: '8', n: 'Tarek HD', pts: '5,920' },
  { r: '9', n: 'Hana Quiz', pts: '5,401' },
  { r: '10', n: 'Ziad', pts: '5,120' },
];

const TIER_THEME: Record<
  Tier,
  { gradient: [string, string]; beam: string; medalColors: [string, string]; label: string }
> = {
  gold: {
    gradient: ['rgba(245,197,24,0.45)', 'rgba(120,53,15,0.25)'],
    beam: GOLD_PRIMARY,
    medalColors: ['#fde68a', '#d97706'],
    label: 'Gold',
  },
  silver: {
    gradient: ['rgba(226,232,240,0.28)', 'rgba(71,85,105,0.12)'],
    beam: '#cbd5e1',
    medalColors: ['#f1f5f9', '#64748b'],
    label: 'Silver',
  },
  bronze: {
    gradient: ['rgba(205,127,50,0.35)', 'rgba(120,53,15,0.15)'],
    beam: '#cd7f32',
    medalColors: ['#fdba74', '#9a3412'],
    label: 'Bronze',
  },
};

function PodiumHudCorners({ accent }: { accent: string }) {
  return (
    <>
      <View style={[styles.hud, styles.hudTL, { borderColor: accent }]} />
      <View style={[styles.hud, styles.hudTR, { borderColor: accent }]} />
      <View style={[styles.hud, styles.hudBL, { borderColor: `${accent}99` }]} />
      <View style={[styles.hud, styles.hudBR, { borderColor: `${accent}99` }]} />
    </>
  );
}

function PodiumCard({
  player,
  slotIndex,
}: {
  player: TopPlayer;
  slotIndex: number;
}) {
  const isMid = slotIndex === 1;
  const theme = TIER_THEME[player.tier];

  return (
    <View style={[styles.podCol, isMid && styles.podColMid]}>
      <LinearGradient
        colors={['rgba(236,72,153,0.12)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.podGlow, !isMid && { opacity: 0 }]}
      />
      <View style={[styles.podShell, isMid && styles.podShellMid]}>
        <View style={[styles.podBeam, { backgroundColor: theme.beam }]} />
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <PodiumHudCorners accent={theme.beam} />
        <View style={styles.podInner}>
          <Text style={[styles.podRank, isMid && styles.podRankMid]}>{player.rank}</Text>
          <View style={styles.podNameRow}>
            <Text style={styles.podName} numberOfLines={1}>
              {player.name}
            </Text>
            {player.highlight ? (
              <Zap size={14} color={GOLD_PRIMARY} fill={GOLD_PRIMARY} strokeWidth={0} />
            ) : null}
          </View>
          <Text style={[styles.podPts, isMid && styles.podPtsMid]}>{player.pts}</Text>
          <LinearGradient
            colors={theme.medalColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.medalPill}
          >
            <Medal size={12} color="#0c0a12" strokeWidth={2.2} />
            <Text style={styles.medalPillTxt}>{theme.label}</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

export default function RankHubScreen() {
  return (
    <MainShell
      title="Rank arena"
      subtitle="Weekly ladder mock — swaps to live XP and seasons when the backend is ready."
    >
      <View style={styles.hero}>
        <LinearGradient
          colors={[...GRADIENT_HERO_RANK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroEyebrow}>This week</Text>
            <Text style={styles.heroTitle}>Top ten · chasing crests</Text>
          </View>
          <View style={styles.heroBadge}>
            <TrendingUp size={18} color="#f472b6" strokeWidth={2.4} />
          </View>
        </View>
        <Text style={styles.heroSub}>Resets every Sunday 00:00 UTC · demo ranks</Text>
      </View>

      <View style={styles.podiumWrap}>
        {PODIUM_ORDER.map((dataIx, slot) => (
          <PodiumCard key={TOP3[dataIx].rank} player={TOP3[dataIx]} slotIndex={slot} />
        ))}
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>Rest of the board</Text>
        <Trophy size={16} color={TEXT_MUTED} strokeWidth={2} />
      </View>

      {REST.map((row, index) => (
        <Animated.View key={row.r} entering={FadeInDown.delay(40 * index).springify().damping(18)}>
          <View style={styles.listRow}>
            <LinearGradient
              colors={['rgba(124,58,237,0.1)', 'rgba(8,6,14,0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.rankChip}>
              <Text style={styles.rankChipTxt}>{row.r}</Text>
            </View>
            <Text style={styles.rowName}>{row.n}</Text>
            <Text style={styles.rowPts}>{row.pts}</Text>
          </View>
        </Animated.View>
      ))}

      <LinearGradient
        colors={[GRADIENT_HERO_PURPLE_BLUE[0], GRADIENT_HERO_PURPLE_BLUE[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.youShell}
      >
        <View style={styles.youInner}>
          <Text style={styles.youLeft}>Your spot (estimate)</Text>
          <Text style={styles.youRight}>#24 · 4,892 pts</Text>
        </View>
      </LinearGradient>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: -SCREEN_PADDING_H,
    marginBottom: 18,
    paddingHorizontal: SCREEN_PADDING_H,
    paddingVertical: 14,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(236,72,153,0.28)',
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
  heroSub: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  heroBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  podiumWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 22,
  },
  podCol: {
    flex: 1,
  },
  podColMid: {
    transform: [{ translateY: -14 }],
    zIndex: 2,
  },
  podGlow: {
    ...StyleSheet.absoluteFillObject,
    top: -12,
    borderRadius: 24,
  },
  podShell: {
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 152,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  podShellMid: {
    minHeight: 176,
    borderColor: 'rgba(245,197,24,0.45)',
    shadowColor: GOLD_PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 16,
  },
  podBeam: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    opacity: 0.95,
    zIndex: 2,
  },
  podInner: {
    padding: 12,
    paddingLeft: 14,
    zIndex: 3,
    flex: 1,
    justifyContent: 'space-between',
  },
  hud: {
    position: 'absolute',
    width: 11,
    height: 11,
    zIndex: 4,
    opacity: 0.65,
  },
  hudTL: { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  hudTR: { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  hudBL: { bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  hudBR: { bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },

  podRank: {
    fontSize: 26,
    fontWeight: '900',
    color: TEXT_PRIMARY,
    letterSpacing: -1,
  },
  podRankMid: {
    fontSize: 30,
  },
  podNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  podName: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_PRIMARY,
  },
  podPts: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '900',
    color: GOLD_PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  podPtsMid: {
    fontSize: 20,
  },
  medalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
  },
  medalPillTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0c0a12',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  rankChip: {
    minWidth: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankChipTxt: {
    color: '#e9d5ff',
    fontWeight: '900',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  rowName: {
    flex: 1,
    color: TEXT_PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  rowPts: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '800',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },

  youShell: {
    marginTop: 14,
    padding: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  youInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(6,5,12,0.92)',
  },
  youLeft: {
    color: TEXT_PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  youRight: {
    color: GOLD_PRIMARY,
    fontWeight: '900',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
});
