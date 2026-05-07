import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Circle, CircleCheck, Lightbulb, Bookmark, ArrowRight, Clock3, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import { BG_BASE, BG_MID, BG_SURFACE, TEXT_PRIMARY, TEXT_MUTED, PURPLE_PRIMARY, SCREEN_PADDING_H } from '../../../constants/tokens';

export default function QuizHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const progress = 0.3;
  const optionRows = useMemo(
    () => [
      { key: 'A' as const, text: 'Cristiano Ronaldo' },
      { key: 'B' as const, text: 'Lionel Messi' },
      { key: 'C' as const, text: 'Michel Platini' },
      { key: 'D' as const, text: 'Zinedine Zidane' },
    ],
    [],
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[BG_BASE, BG_MID, BG_SURFACE, BG_BASE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.28, 0.72, 1]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingHorizontal: SCREEN_PADDING_H,
          paddingBottom: Math.max(insets.bottom, 16) + 56 + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          <View style={styles.brandWrap}>
            <Text style={styles.brand90}>90</Text>
            <View style={styles.brandPill}>
              <Text style={styles.brandPlus}>PLUS</Text>
            </View>
          </View>

          <View style={styles.coinsPill}>
            <Zap size={13} color="#a78bfa" strokeWidth={2.3} />
            <Text style={styles.coinsTxt}>120</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.questionMeta}>Question</Text>
              <Text style={styles.questionCount}>
                3 <Text style={styles.questionCountMuted}>/ 10</Text>
              </Text>
            </View>
            <View style={styles.timerWrap}>
              <Clock3 size={16} color="#a78bfa" strokeWidth={2.2} />
              <Text style={styles.timerText}>15s</Text>
            </View>
          </View>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={['#7c3aed', '#a855f7']}
              style={[styles.barFill, { width: `${progress * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.percentTxt}>30%</Text>
        </View>

        <View style={styles.quizCard}>
          <View style={styles.quizHead}>
            <Text style={styles.quizTag}>Football Quiz</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelTxt}>Medium</Text>
            </View>
          </View>

          <View style={styles.questionBox}>
            <LinearGradient
              colors={['rgba(124,58,237,0.12)', 'rgba(20,15,36,0.95)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.questionTitle}>Which player has won the most Ballon d'Or awards?</Text>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80' }}
              style={styles.questionImage}
              resizeMode="cover"
            />
          </View>

          {optionRows.map((opt) => {
            const active = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionRow, active && styles.optionRowActive]}
                activeOpacity={0.85}
                onPress={() => setSelected(opt.key)}
              >
                <View style={[styles.optionLetterWrap, active && styles.optionLetterWrapActive]}>
                  <Text style={styles.optionLetter}>{opt.key}</Text>
                </View>
                <Text style={styles.optionText}>{opt.text}</Text>
                {active ? (
                  <CircleCheck size={22} color="#a855f7" strokeWidth={2.2} />
                ) : (
                  <Circle size={22} color="rgba(255,255,255,0.34)" strokeWidth={2.2} />
                )}
              </TouchableOpacity>
            );
          })}

          <View style={styles.hintCard}>
            <Lightbulb size={20} color="#facc15" />
            <View style={styles.hintBody}>
              <Text style={styles.hintTitle}>Need a hint?</Text>
              <Text style={styles.hintSub}>You can use 1 hint in this question.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.hintBtn}>
              <Text style={styles.hintBtnText}>Use Hint</Text>
              <Text style={styles.hintPrice}>10</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.bookmarkBtn} activeOpacity={0.85}>
            <Bookmark size={18} color={TEXT_PRIMARY} />
            <Text style={styles.bookmarkTxt}>Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtnWrap} activeOpacity={0.9}>
            <LinearGradient
              colors={[PURPLE_PRIMARY, '#9333ea']}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextTxt}>Next Question</Text>
              <ArrowRight size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_BASE,
  },
  scroll: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brand90: {
    color: TEXT_PRIMARY,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  brandPill: {
    backgroundColor: 'rgba(124,58,237,0.92)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 9,
  },
  brandPlus: {
    color: '#0f0822',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(10,8,18,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.35)',
  },
  coinsTxt: {
    color: TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(10,8,18,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 14,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionMeta: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontWeight: '600',
  },
  questionCount: {
    marginTop: 4,
    color: '#a855f7',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 24,
    letterSpacing: -0.9,
  },
  questionCountMuted: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: '700',
  },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    paddingLeft: 12,
  },
  timerText: {
    color: '#a78bfa',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 22,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    marginTop: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  percentTxt: {
    marginTop: 8,
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '700',
  },
  quizCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(8,6,14,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
  },
  quizHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quizTag: {
    color: '#a78bfa',
    fontSize: 15,
    fontWeight: '700',
  },
  levelPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(124,58,237,0.14)',
  },
  levelTxt: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '700',
  },
  questionBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    padding: 14,
    minHeight: 144,
    marginBottom: 12,
  },
  questionTitle: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 27,
    maxWidth: '68%',
  },
  questionImage: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    width: 132,
    height: 132,
    borderRadius: 66,
    opacity: 0.9,
  },
  optionRow: {
    minHeight: 62,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(15,12,24,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRowActive: {
    borderColor: 'rgba(124,58,237,0.92)',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
  },
  optionLetterWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterWrapActive: {
    backgroundColor: '#7c3aed',
  },
  optionLetter: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '800',
  },
  optionText: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  hintCard: {
    marginTop: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12,10,20,0.94)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hintBody: {
    flex: 1,
  },
  hintTitle: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  hintSub: {
    color: TEXT_MUTED,
    marginTop: 3,
    fontSize: 13,
  },
  hintBtn: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.38)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintBtnText: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  hintPrice: {
    color: '#a78bfa',
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  bookmarkBtn: {
    width: 144,
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(10,8,18,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  bookmarkTxt: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  nextBtnWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextBtn: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextTxt: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '800',
  },
});
