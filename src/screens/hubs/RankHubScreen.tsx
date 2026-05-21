import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronDown,
  ChevronRight,
  Trophy,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/theme';
import BottomNav from '../../components/BottomNav';
import FifaCard from '../../components/rank/FifaCard';

// ─── Derived constants from theme ─────────────────────────────────────────────
const BG = Colors.bgBase;
const ACCENT = Colors.purpleAccent;
const GOLD = Colors.ratingGold;
const SILVER = Colors.silver;
const BRONZE = Colors.bronze;

// ─── Data ─────────────────────────────────────────────────────────────────────
const COMPETITIONS = [
  { id: '1', title: 'King of Predictions', sub: 'Predict matches and be the best!', img: require('../../../assets/images/football.png') },
  { id: '2', title: 'Share & Earn', sub: 'Share the app and climb the rankings!', img: require('../../../assets/images/share.png') },
  { id: '3', title: 'Daily Quiz', sub: 'Answer daily questions and win points!', img: require('../../../assets/images/daily-quiz.png') },
];

const PODIUM = [
  { rank: 2, name: 'CR7_legend', xp: '11,230 XP', avatar: 'https://i.pravatar.cc/150?img=3' },
  { rank: 1, name: 'mr.dev', xp: '12,850 XP', avatar: 'https://i.pravatar.cc/150?img=15' },
  { rank: 3, name: 'The Goat', xp: '9,780 XP', avatar: 'https://i.pravatar.cc/150?img=8' },
];

const LOWER = [
  { rank: 4, name: 'NeymarJr', role: 'Pro Player', xp: '8,450 XP', avatar: 'https://i.pravatar.cc/150?img=5' },
  { rank: 5, name: 'BlueLion', role: 'Rising Star', xp: '7,210 XP', avatar: 'https://i.pravatar.cc/150?img=9' },
];

// ─── Countdown ────────────────────────────────────────────────────────────────
const WC_DATE = new Date('2026-06-11T00:00:00').getTime();
function getTimeLeft() {
  const diff = WC_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}
const pad = (n: number) => String(n).padStart(2, '0');

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ topInset }: { topInset: number }) {
  const GlassContainer = isLiquidGlassSupported ? LiquidGlassView : BlurView;

  return (
    <GlassContainer
      intensity={20}
      tint="dark"
      effect="regular"
      style={[s.headerContainer, { paddingTop: topInset + 10 }]}
    >
      {/* Left: small 90 PLUS logo */}
      <View style={s.logoPillSmall}>
        <Text style={s.logo90Small}>90</Text>
        <View style={s.plusChipSmall}>
          <Text style={s.logoPlusSmall}>PLUS</Text>
        </View>
      </View>

      {/* Right: coins */}
      <View style={s.coinChip}>
        <Zap size={13} color={ACCENT} fill={ACCENT} />
        <Text style={s.coinTxt}>50</Text>
      </View>
    </GlassContainer>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard() {
  const GlassContainer = isLiquidGlassSupported ? LiquidGlassView : BlurView;

  return (
    <GlassContainer
      intensity={18}
      tint="dark"
      effect="clear"
      interactive
      style={s.profileCard}
    >
      <View style={s.profileCardOverlay} />

      <View style={s.profileRow}>
        {/* Avatar with purple ring */}
        <View style={s.avatarWrap}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={s.avatar}
          />
          <View style={s.avatarRing} />
        </View>

        {/* Info */}
        <View style={s.profileInfo}>
          {/* Name + verified */}
          <View style={s.nameRow}>
            <Text style={s.username}>mr.dev</Text>
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedTxt}>✓</Text>
            </View>
          </View>

          {/* Level + XP bar */}
          <View style={s.xpRow}>
            <View style={s.lvlBadge}>
              <Text style={s.lvlTxt}>Lv. 18</Text>
            </View>
            <View style={s.xpBarBg}>
              <LinearGradient
                colors={['#7C3AED', ACCENT]}
                style={s.xpBarFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={s.xpLabel}>
              <Text style={s.xpCur}>2400</Text>
              <Text style={s.xpMax}> / 3000 XP</Text>
            </Text>
          </View>
        </View>
      </View>
    </GlassContainer>
  );
}

// ─── Competition Card ─────────────────────────────────────────────────────────
function CompCard({ img, title, sub }: { img: any; title: string; sub: string }) {
  const CardWrapper = isLiquidGlassSupported ? LiquidGlassView : BlurView;
  const wrapperProps = isLiquidGlassSupported
    ? { effect: "clear" as const, interactive: true }
    : { intensity: 12, tint: "dark" as const };

  return (
    <CardWrapper
      {...(wrapperProps as any)}
      style={s.compCard}
    >
      <View style={s.iconGlowAmbient} />
      <View style={s.compIconArea}>
        <Image source={img} style={s.compImg} resizeMode="contain" />
      </View>
      <Text style={s.compTitle}>{title}</Text>
      <Text style={s.compSub}>{sub}</Text>
      <View style={s.livePill}>
        <View style={s.liveDot} />
        <Text style={s.liveTxt}>Live Now</Text>
      </View>
    </CardWrapper>
  );
}

// ─── World Cup Card ───────────────────────────────────────────────────────────
function WCCard() {
  const [t, setT] = useState(getTimeLeft());
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <LinearGradient
      colors={['#1B103B', '#0A0818']}
      style={s.wcCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Player silhouette — fills entire card */}
      <Image
        source={require('../../../assets/images/plear 90Plus.png')}
        style={s.wcPlayerImg}
        resizeMode="cover"
      />

      <View style={s.wcInner}>
        {/* Left: text + button */}
        <View style={s.wcLeft}>
          <Text style={s.wcTitle}>Road To{'\n'}World Cup</Text>
          <Text style={s.wcSub}>
            Complete daily missions and earn{'\n'}points to reach the top!
          </Text>
          <TouchableOpacity style={s.wcBtn}>
            <Text style={s.wcBtnTxt}>View Missions</Text>
            <ChevronRight size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Right: countdown - Liquid Glass */}
        {isLiquidGlassSupported ? (
          <LiquidGlassView effect="clear" interactive style={s.wcRight}>
            <Text style={s.cdLabel}>World Cup starts in</Text>
            <View style={s.cdRow}>
              {[
                { val: t.days, lbl: 'Days' },
                { val: t.hours, lbl: 'Hours' },
                { val: t.mins, lbl: 'Mins' },
                { val: t.secs, lbl: 'Secs' },
              ].map((item) => (
                <View key={item.lbl} style={s.cdBlock}>
                  <Text style={s.cdNum}>{pad(item.val)}</Text>
                  <Text style={s.cdLbl}>{item.lbl}</Text>
                </View>
              ))}
            </View>
          </LiquidGlassView>
        ) : (
          <BlurView intensity={12} tint="dark" style={s.wcRight}>
            <Text style={s.cdLabel}>World Cup starts in</Text>
            <View style={s.cdRow}>
              {[
                { val: t.days, lbl: 'Days' },
                { val: t.hours, lbl: 'Hours' },
                { val: t.mins, lbl: 'Mins' },
                { val: t.secs, lbl: 'Secs' },
              ].map((item) => (
                <View key={item.lbl} style={s.cdBlock}>
                  <Text style={s.cdNum}>{pad(item.val)}</Text>
                  <Text style={s.cdLbl}>{item.lbl}</Text>
                </View>
              ))}
            </View>
          </BlurView>
        )}
      </View>
    </LinearGradient>
  );
}

// ─── Podium Card ──────────────────────────────────────────────────────────────
function PodiumCard({ rank, name, xp, avatar }: {
  rank: number; name: string; xp: string; avatar: string;
}) {
  const isFirst = rank === 1;
  const cardType = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze';
  
  return (
    <View style={[s.podCardWrapper, isFirst && s.podCardFirstWrapper]}>
      <FifaCard 
        name={name}
        playerImage={{ uri: avatar }}
        cardType={cardType}
        scale={isFirst ? 0.42 : 0.33}
        position={isFirst ? 'ST' : (rank === 2 ? 'LW' : 'RW')}
        countryFlag={isFirst ? 'eg' : (rank === 2 ? 'pt' : 'ar')}
        age={isFirst ? 31 : (rank === 2 ? 39 : 36)}
        height={isFirst ? 175 : 187}
        weight={isFirst ? 71 : 83}
        foot={isFirst ? 'Left' : 'Right'}
      />
      <Text style={s.podXpLabel}>{xp}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RankHubScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      {/* ── Floating Header (Liquid Glass) ── */}
      <Header topInset={insets.top} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: Math.max(insets.bottom, 16) + 88,
        }}
      >
        {/*
         * ── HERO BLOCK ──
         * This single View contains:
         *   1. Trophy image (absolute, fills the block)
         *   2. Left dark gradient (absolute, hides left side)
         *   3. Bottom dark gradient (absolute, fades into page)
         *   4. Title text
         *   5. Profile Card (transparent glass — shows trophy behind it)
         * The block ends exactly where the profile card ends,
         * so "All Competitions" appears on the plain dark background.
         */}
        <View style={s.heroBlock}>
          {/* Trophy — absolute, right-aligned, fills the block */}
          <Image
            source={require('../../../assets/images/90Plus world cup.png')}
            style={s.heroBgTrophy}
            resizeMode="contain"
          />
          {/* Left gradient — solid dark on left so text is readable */}
          <LinearGradient
            colors={['#05010D', '#05010D', 'rgba(5,1,13,0.9)', 'transparent']}
            style={s.heroBgGradLeft}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          {/* Bottom gradient — fades trophy into dark background */}
          <LinearGradient
            colors={['transparent', 'rgba(5,1,13,0.55)', '#05010D']}
            style={s.heroBgGradBottom}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Title text — sits on top of the trophy */}
          <View style={s.heroText}>
            <View style={s.titleRow}>
              <View style={s.trophyIconBox}>
                <Trophy size={20} color="#fff" fill="#fff" />
              </View>
              <Text style={s.pageTitle}>Competitions</Text>
            </View>
            <Text style={s.pageSub1}>Play. Compete. Win.</Text>
            <Text style={s.pageSub2}>Join challenges and climb the ranks!</Text>
          </View>

          {/* Profile Card — transparent glass, trophy visible through it */}
          <ProfileCard />
        </View>

        {/* ── All Competitions ── */}
        <View style={s.secHead}>
          <Text style={s.secTitle}>All Competitions</Text>
          <TouchableOpacity style={s.viewAllRow}>
            <Text style={s.viewAll}>View All</Text>
            <ChevronRight size={16} color={ACCENT} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hScroll}
        >
          {COMPETITIONS.map(c => <CompCard key={c.id} {...c} />)}
        </ScrollView>

        {/* ── World Cup Countdown ── */}
        <WCCard />

        {/* ── Top Players & Leaderboard Section ── */}
        <View style={s.bottomContentGroup}>
          {/* Arena Background - Extended to bottom */}
          <View style={s.arenaBgContainerExtended}>
            <Image 
              source={require('../../../assets/images/arena.png')}
              style={s.arenaImgExtended}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['#05010D', 'transparent', '#05010D']}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <View style={s.secHead}>
            <Text style={s.secTitle}>Top Players</Text>
            <TouchableOpacity style={s.weekChip}>
              <Text style={s.weekTxt}>This Week</Text>
              <ChevronDown size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Podium: 2nd | 1st | 3rd */}
          <View style={s.podiumRow}>
            {PODIUM.map(p => <PodiumCard key={p.rank} {...p} />)}
          </View>

          {/* Lower leaderboard with Liquid Glass */}
          <View style={s.board}>
            {LOWER.map((p, i) => {
              const RowWrapper = isLiquidGlassSupported ? LiquidGlassView : BlurView;
              const rowProps = isLiquidGlassSupported
                ? { effect: "clear" as const, interactive: true }
                : { intensity: 15, tint: "dark" as const };

              return (
                <RowWrapper
                  key={p.rank}
                  {...(rowProps as any)}
                  style={[s.boardRowGlass, i < LOWER.length - 1 && { marginBottom: 8 }]}
                >
                  <View style={s.rankBadgeSmall}>
                    <Text style={s.boardRank}>{p.rank}</Text>
                  </View>
                  <Image source={{ uri: p.avatar }} style={s.boardAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.boardName}>{p.name}</Text>
                    <Text style={s.boardRole}>{p.role}</Text>
                  </View>
                  <Text style={s.boardXp}>{p.xp}</Text>
                </RowWrapper>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05010D' },

  // ── World Cup Background (behind header + hero) ──
  wcBgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 420,
    zIndex: 0,
  },
  wcBgTrophy: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: '72%',
    height: 420,
    opacity: 0.95,
  },
  // ── Hero Block ──
  heroBlock: {
    overflow: 'hidden',
    paddingBottom: 20,
  },
  heroBgTrophy: {
    position: 'absolute',
    top: 0,
    right: -0,
    width: '90%',
    height: '100%',
    opacity: 0.95,
  },
  heroBgGradLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '62%',
  },
  heroBgGradBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  heroText: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(5,1,13,0.0)',
  },
  // Small left logo pill
  logoPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 5,
  },
  logo90Small: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.3 },
  plusChipSmall: {
    backgroundColor: ACCENT,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  logoPlusSmall: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 5,
  },
  coinTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // ── Hero text (inside heroBlock) ──
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  trophyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(39, 8, 94, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  pageTitle: { color: '#fff', fontSize: 34, fontWeight: '900' },
  pageSub1: { color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  pageSub2: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },

  // ── Profile Card ──
  profileCard: {
    marginHorizontal: 12,
    borderRadius: 22,
    padding: 18,
    marginTop:19,
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.00)',
    borderWidth: 1,
    borderColor: 'rgba(69, 5, 128, 0.25)',
    overflow: 'hidden',
    zIndex: 1,
  },
  profileCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,20,160,0.00)',
    borderRadius: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(124,58,237,0.0)',
  },
  avatarRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2.5,
    borderColor: ACCENT,
  },
  profileInfo: { flex: 1, gap: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  username: { color: '#fff', fontSize: 18, fontWeight: '800' },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1D8CF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  eliteRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eliteTxt: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  lvlBadge: {
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lvlTxt: { color: '#fff', fontSize: 11, fontWeight: '900' },
  xpBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarFill: { width: '80%', height: '100%' },
  xpLabel: { fontSize: 12 },
  xpCur: { color: ACCENT, fontWeight: '900' },
  xpMax: { color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  // Shield badge (right side)
  shieldBadgeWrap: {
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shieldStarInner: {
    position: 'absolute',
    top: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laurelLeft: {
    position: 'absolute',
    bottom: 4,
    left: 2,
    width: 14,
    height: 28,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: ACCENT,
    borderBottomLeftRadius: 8,
    opacity: 0.6,
  },
  laurelRight: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    width: 14,
    height: 28,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: ACCENT,
    borderBottomRightRadius: 8,
    opacity: 0.6,
  },
 
  // ── Section Header ──
  secHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 14,
  },
  secTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  viewAllRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAll: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  weekChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2A1A5A',
    gap: 4,
  },
  weekTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  // ── Competition Cards ──
  hScroll: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  compCard: {
    width: 180,
    borderRadius: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 245,
  },
  compIconArea: {
    width: 120,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 2,
  },
  compImg: { width: 115, height: 815 },
  iconGlowAmbient: {
    position: 'absolute',
    top: -160,
    width: 70,
    height: 70,
    backgroundColor: ACCENT,
    borderRadius: 35,
    opacity: 0.3,
    zIndex: 1,
    transform: [{ scale: 2 }],
  },
  compTitle: { color: '#fff', fontSize: 16, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  compSub: { color: '#999', fontSize: 11, textAlign: 'center', lineHeight: 16, marginBottom: 18, height: 32 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 1)',
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: ACCENT },
  liveTxt: { color: ACCENT, fontWeight: '800', fontSize: 12 },

  // ── World Cup Card ──
  wcCard: {
    marginHorizontal: 0,
    borderRadius: 0,
    marginTop: 20,
    overflow: 'hidden',
    borderWidth: 0,
    minHeight: 250,
    backgroundColor: '#0D0820',
  },
  wcPlayerImg: {
    position: 'absolute',
    right: 50,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 1,
    transform: [
      { scale: 1.4 },
      { translateY: -10 },
    ],
  },

  wcInner: {
    flexDirection: 'row',
    padding: 24,
    minHeight: 250,
    zIndex: 2,
  },
  wcLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
    gap: 8,
  },
  wcTitle: { color: '#fff', fontSize: 24, fontWeight: '900', lineHeight: 30 },
  wcSub: { color: '#aaa', fontSize: 11, lineHeight: 17, marginTop: 4, marginBottom: 8 },
  wcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 12,
  },
  wcBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  wcRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.00)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
    overflow: 'hidden',
  },
  cdLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cdRow: { flexDirection: 'row', gap: 10 },
  cdBlock: { alignItems: 'center', minWidth: 32 },
  cdNum: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cdLbl: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700', marginTop: 1 },

  // ── Top Players & Board Section ──
  bottomContentGroup: {
    marginTop: 10,
    paddingTop: 40,
    position: 'relative',
    paddingBottom: 20, // Clean stop after rank 5
    overflow: 'hidden', 
  },
  arenaBgContainerExtended: {
    position: 'absolute',
    top: -100,
    left: '0%',
    right: '0%',
    bottom: -110,
    zIndex: -1,
  },
  arenaImgExtended: {
    width: '120%',
    height: '115%', 
    top: -200, // Adjusted to match the new paddingTop: 40
    opacity: 0.5,
  },
  boardRowGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(241, 241, 241, 0)',
    gap: 12,
  },
  rankBadgeSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Podium ──
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: -15, // Slight overlap for depth
  },
  board: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  podCardWrapper: {
    alignItems: 'center',
  },
  podCardFirstWrapper: {
    zIndex: 10,
    marginBottom: 10,
  },
  podXpLabel: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  boardRank: { color: '#888', fontSize: 16, fontWeight: '700', width: 24, textAlign: 'center' },
  boardAvatar: { width: 44, height: 44, borderRadius: 22 },
  boardName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  boardRole: { color: '#555', fontSize: 12, marginTop: 2 },
  boardXp: { color: ACCENT, fontWeight: '800', fontSize: 14 },
});
