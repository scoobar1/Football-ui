import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { GOLD_PRIMARY, GOLD_DARK, TEXT_PRIMARY, TEXT_MUTED } from '../../../constants/tokens';

export type MomentTradingCardData = {
  title: string;
  imageUri: string;
  duration?: string;
  /** Large headline stat (like an overall rating) */
  momentScore: number;
  /** Short tag under score — e.g. CLIP, WIN, SKILL */
  role?: string;
  /** Three mini stats labels + values (FUT-style line) */
  statLine: readonly [string, string][];
  subtitle?: string;
};

type Props = {
  data: MomentTradingCardData;
  variant?: 'carousel' | 'poster';
  /** Caps poster width on narrow phones (keeps aspect ratio). */
  posterMaxWidth?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

/** Trading-card frame: gold rim, score crest, image window, nameplate */
export function MomentTradingCard({
  data,
  variant = 'carousel',
  posterMaxWidth = CARD_POSTER.w,
  style,
  onPress,
}: Props) {
  const isPoster = variant === 'poster';
  const posterW = Math.min(posterMaxWidth, CARD_POSTER.w);
  const posterH = posterW * (CARD_POSTER.h / CARD_POSTER.w);
  const w = isPoster ? posterW : CARD_CAROUSEL.w;
  const h = isPoster ? posterH : CARD_CAROUSEL.h;

  const inner = (
    <View style={[styles.shell, { width: w, height: h }]}>
      <LinearGradient
        colors={['#e8c547', '#b8860b', '#f0d878', '#9a7209']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outerRim}
      >
        <LinearGradient
          colors={['#1a1528', '#0d0b14', '#12101c']}
          style={styles.face}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.09)', 'transparent', 'rgba(0,0,0,0.5)']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={[styles.crest, isPoster && styles.crestPoster]}>
            <LinearGradient
              colors={['rgba(40,35,55,0.95)', 'rgba(15,12,22,0.98)']}
              style={styles.crestInner}
            >
              <Text style={[styles.scoreNum, isPoster && styles.scoreNumPoster]}>
                {data.momentScore}
              </Text>
              <Text style={[styles.roleTxt, isPoster && styles.roleTxtPoster]}>
                {data.role ?? 'CLIP'}
              </Text>
            </LinearGradient>
          </View>

          <View style={[styles.mediaWindow, isPoster && styles.mediaWindowPoster]}>
            <ImageBackground
              source={{ uri: data.imageUri }}
              style={styles.mediaBg}
              imageStyle={styles.mediaImg}
            >
              <LinearGradient
                colors={['rgba(8,6,14,0.15)', 'transparent', 'rgba(4,3,10,0.92)']}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['transparent', 'rgba(245,197,24,0.06)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={[styles.playFab, isPoster && styles.playFabPoster]}>
                <Play size={isPoster ? 22 : 14} color="#0c0a12" fill="#0c0a12" strokeWidth={0} />
              </View>
              {data.duration ? (
                <View style={styles.durPill}>
                  <Text style={styles.durTxt}>{data.duration}</Text>
                </View>
              ) : null}
            </ImageBackground>
          </View>

          <View style={[styles.statStrip, isPoster && styles.statStripPoster]}>
            {data.statLine.map(([k, v], i) => (
              <View key={`${k}-${i}`} style={styles.statCell}>
                <Text style={[styles.statVal, isPoster && styles.statValPoster]}>{v}</Text>
                <Text style={[styles.statKey, isPoster && styles.statKeyPoster]}>{k}</Text>
              </View>
            ))}
          </View>

          <LinearGradient
            colors={[GOLD_DARK + 'ee', GOLD_PRIMARY, GOLD_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.nameplate, isPoster && styles.nameplatePoster]}
          >
            <Text style={[styles.nameTxt, isPoster && styles.nameTxtPoster]} numberOfLines={1}>
              {data.title}
            </Text>
            {data.subtitle ? (
              <Text style={[styles.subNameTxt, isPoster && styles.subNameTxtPoster]} numberOfLines={1}>
                {data.subtitle}
              </Text>
            ) : null}
          </LinearGradient>
        </LinearGradient>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [pressed && styles.pressed, style]} onPress={onPress}>
        {inner}
      </Pressable>
    );
  }

  return <View style={style}>{inner}</View>;
}

const CARD_CAROUSEL = { w: 124, h: 186 };
const CARD_POSTER = { w: 280, h: 420 };

const styles = StyleSheet.create({
  shell: { borderRadius: 14 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  outerRim: {
    flex: 1,
    borderRadius: 14,
    padding: 2.5,
  },
  face: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 7,
  },
  crest: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 3,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,197,24,0.45)',
  },
  crestPoster: { left: 14, top: 14, borderRadius: 10 },
  crestInner: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 44,
  },
  scoreNum: {
    fontSize: 19,
    fontWeight: '900',
    color: GOLD_PRIMARY,
    fontVariant: ['tabular-nums'],
    lineHeight: 22,
    letterSpacing: -0.6,
  },
  scoreNumPoster: { fontSize: 36, lineHeight: 40 },
  roleTxt: {
    fontSize: 8,
    fontWeight: '900',
    color: TEXT_MUTED,
    letterSpacing: 1.2,
    marginTop: 1,
  },
  roleTxtPoster: { fontSize: 11, letterSpacing: 1.6, marginTop: 2 },
  mediaWindow: {
    marginTop: 4,
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
    minHeight: 88,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  mediaWindowPoster: {
    minHeight: 220,
    marginTop: 8,
    borderRadius: 12,
  },
  mediaBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mediaImg: { borderRadius: 9 },
  playFab: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245,197,24,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  playFabPoster: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
  },
  durPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  durTxt: {
    color: TEXT_PRIMARY,
    fontSize: 10,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 6,
  },
  statStripPoster: { paddingTop: 12, paddingBottom: 10, paddingHorizontal: 8 },
  statCell: { flex: 1, alignItems: 'center' },
  statVal: {
    fontSize: 12,
    fontWeight: '900',
    color: TEXT_PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  statValPoster: { fontSize: 17 },
  statKey: {
    marginTop: 2,
    fontSize: 7,
    fontWeight: '800',
    color: TEXT_MUTED,
    letterSpacing: 0.8,
  },
  statKeyPoster: { fontSize: 9, marginTop: 3 },
  nameplate: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.35)',
  },
  nameplatePoster: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  nameTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0c0a12',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    maxWidth: '100%',
  },
  nameTxtPoster: { fontSize: 17 },
  subNameTxt: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(12,10,18,0.72)',
  },
  subNameTxtPoster: { fontSize: 12, marginTop: 3 },
});
