import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ChevronDown, ChevronRight, Menu, Crown, Shield } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import { BG_BASE, BG_MID, BG_SURFACE, PURPLE_PRIMARY, TEXT_MUTED, TEXT_PRIMARY } from '../../../constants/tokens';

const COMPETITIONS = [
  { id: '1', title: 'King of Predictions', sub: 'Predict matches and be the best!' },
  { id: '2', title: 'Share & Earn', sub: 'Share the app and climb the rankings!' },
  { id: '3', title: 'Daily Quiz', sub: 'Answer daily questions and win points!' },
];

const TOP_PLAYERS = [
  { rank: '2', name: 'CR7_legend', xp: '11,230 XP', avatar: 'https://images.unsplash.com/photo-1543351611-58f69d5c1781?auto=format&fit=crop&w=200&q=75' },
  { rank: '1', name: 'Mo Salah', xp: '12,850 XP', top: true, avatar: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=200&q=75' },
  { rank: '3', name: 'The Goat', xp: '9,780 XP', avatar: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=200&q=75' },
];

export default function RankHubScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[BG_BASE, BG_MID, BG_SURFACE, BG_BASE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.72, 1]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 14, paddingBottom: Math.max(16, insets.bottom) + 84 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            <Menu size={20} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.brandPill}>
            <Text style={styles.brandTxt}>90</Text>
            <View style={styles.plusPill}><Text style={styles.plusTxt}>PLUS</Text></View>
          </View>
          <View style={styles.rightPack}>
            <View style={styles.coinChip}>
              <Text style={styles.coinTxt}>1200</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
              <Bell size={20} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.pageTitle}>Competitions</Text>
        <Text style={styles.pageSub}>Play. Compete. Win.</Text>
        <Text style={styles.pageSub}>Join challenges and climb the ranks!</Text>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1400&q=70' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
        <LinearGradient
          colors={['rgba(124,58,237,0.35)', 'rgba(9,7,16,0.97)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
          <View style={styles.profileRow}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=160&q=80' }} style={styles.avatarImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Ali:90+</Text>
              <Text style={styles.heroSub}>Elite Player</Text>
              <View style={styles.xpTrack}>
                <LinearGradient colors={[PURPLE_PRIMARY, '#a855f7']} style={styles.xpFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </View>
              <Text style={styles.heroSub}>2400 / 3000 XP</Text>
            </View>
            <View style={styles.shieldWrap}><Shield size={22} color="#a78bfa" /></View>
          </View>
        </ImageBackground>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>All Competitions</Text>
          <TouchableOpacity style={styles.inline} activeOpacity={0.8}>
            <Text style={styles.viewAll}>View All</Text>
            <ChevronRight size={14} color={PURPLE_PRIMARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {COMPETITIONS.map((c) => (
            <ImageBackground
              key={c.id}
              source={{ uri: c.id === '1' ? 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=320&q=75' : c.id === '2' ? 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=320&q=75' : 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=320&q=75' }}
              style={styles.card}
              imageStyle={styles.cardImage}
            >
              <LinearGradient
                colors={['rgba(10,8,18,0.25)', 'rgba(10,8,18,0.96)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardSub}>{c.sub}</Text>
              <Text style={styles.liveNow}>• Live Now</Text>
            </ImageBackground>
          ))}
        </View>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=75' }}
          style={styles.road}
          imageStyle={styles.roadImage}
        >
          <LinearGradient colors={['rgba(124,58,237,0.35)', 'rgba(9,7,16,0.96)']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <Text style={styles.roadTitle}>Road To World Cup</Text>
          <Text style={styles.roadSub}>Complete daily missions and earn points to reach the top!</Text>
          <View style={styles.roadBottom}>
            <TouchableOpacity style={styles.btn} activeOpacity={0.85}>
              <Text style={styles.btnTxt}>View Missions</Text>
              <ChevronRight size={14} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.smallMuted}>World Cup starts in</Text>
              <Text style={styles.timer}>28 14 36 22</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Top Players</Text>
          <TouchableOpacity style={styles.weekChip} activeOpacity={0.85}>
            <Text style={styles.weekTxt}>This Week</Text>
            <ChevronDown size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
        <View style={styles.topGrid}>
          {TOP_PLAYERS.map((p) => (
            <View key={p.rank} style={[styles.topCard, p.top && styles.topCardFocus]}>
              {p.top ? <View style={styles.crown}><Crown size={14} color="#facc15" /></View> : null}
              <Image source={{ uri: p.avatar }} style={styles.topAvatar} />
              <View style={styles.rankBadge}><Text style={styles.rankBadgeTxt}>{p.rank}</Text></View>
              <Text style={styles.topName}>{p.name}</Text>
              <Text style={styles.topXp}>{p.xp}</Text>
            </View>
          ))}
        </View>

        <View style={styles.board}>
          <View style={styles.boardRow}><Text style={styles.rowRank}>4</Text><Text style={styles.rowName}>NeymarJr</Text><Text style={styles.rowXp}>8,450 XP</Text></View>
          <View style={[styles.boardRow, styles.lastRow]}><Text style={styles.rowRank}>5</Text><Text style={styles.rowName}>BlueLion</Text><Text style={styles.rowXp}>7,210 XP</Text></View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_BASE },
  scroll: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rightPack: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, height: 44,
    borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  brandTxt: { color: TEXT_PRIMARY, fontSize: 24, fontWeight: '900', letterSpacing: 0.2 },
  plusPill: { backgroundColor: 'rgba(124,58,237,0.9)', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2 },
  plusTxt: { color: '#140c2a', fontSize: 11, fontWeight: '900' },
  coinChip: {
    height: 30, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)',
    backgroundColor: 'rgba(14,10,24,0.94)', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center',
  },
  coinTxt: { color: '#e9d5ff', fontSize: 12, fontWeight: '800' },
  pageTitle: { color: TEXT_PRIMARY, fontSize: 28, fontWeight: '900', lineHeight: 32 },
  pageSub: { color: TEXT_MUTED, fontSize: 14, lineHeight: 18, fontWeight: '600' },
  hero: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroImage: { borderRadius: 16, opacity: 0.78 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarImage: {
    width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: 'rgba(167,139,250,0.48)',
    backgroundColor: 'rgba(124,58,237,0.2)',
  },
  heroTitle: { color: TEXT_PRIMARY, fontSize: 18, fontWeight: '800' },
  heroSub: { color: TEXT_MUTED, marginTop: 4, fontSize: 12, fontWeight: '600' },
  xpTrack: { marginTop: 8, height: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.09)', overflow: 'hidden' },
  xpFill: { width: '66%', height: '100%' },
  shieldWrap: {
    width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(167,139,250,0.42)',
    backgroundColor: 'rgba(124,58,237,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  sectionHead: { marginTop: 2, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: TEXT_PRIMARY, fontSize: 20, fontWeight: '800' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewAll: { color: PURPLE_PRIMARY, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  card: {
    flex: 1,
    minHeight: 122,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12,10,20,0.95)',
    padding: 10,
    overflow: 'hidden',
  },
  cardImage: { borderRadius: 12, opacity: 0.9 },
  cardTitle: { color: TEXT_PRIMARY, fontSize: 12, fontWeight: '800', marginTop: 50 },
  cardSub: { color: TEXT_MUTED, fontSize: 10, lineHeight: 13, marginTop: 3 },
  liveNow: { color: PURPLE_PRIMARY, fontSize: 10, fontWeight: '700', marginTop: 7 },
  road: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12,10,20,0.95)',
    padding: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },
  roadImage: { borderRadius: 14, opacity: 0.9 },
  roadTitle: { color: TEXT_PRIMARY, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  roadSub: { color: TEXT_MUTED, fontSize: 13, lineHeight: 18, maxWidth: '78%' },
  roadBottom: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  btn: {
    height: 36,
    borderRadius: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PURPLE_PRIMARY,
  },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  smallMuted: { color: 'rgba(255,255,255,0.55)', fontSize: 11, textAlign: 'right' },
  timer: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '800', letterSpacing: 0.6, marginTop: 2 },
  weekChip: {
    height: 34, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  weekTxt: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700' },
  topGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  topCard: {
    flex: 1, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(12,10,20,0.95)', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, position: 'relative',
  },
  topCardFocus: { borderColor: 'rgba(245,197,24,0.42)' },
  crown: { position: 'absolute', top: 6, right: 7 },
  topAvatar: { width: 58, height: 58, borderRadius: 29, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' },
  rankBadge: { marginTop: -10, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(245,197,24,0.95)', alignItems: 'center', justifyContent: 'center' },
  rankBadgeTxt: { color: '#201200', fontSize: 12, fontWeight: '900' },
  topName: { marginTop: 8, color: TEXT_PRIMARY, fontSize: 14, fontWeight: '700' },
  topXp: { marginTop: 4, color: PURPLE_PRIMARY, fontSize: 13, fontWeight: '700' },
  board: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12,10,20,0.95)',
    overflow: 'hidden',
  },
  boardRow: {
    minHeight: 58, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lastRow: { borderBottomWidth: 0 },
  rowRank: { width: 20, color: 'rgba(255,255,255,0.75)', fontSize: 16, fontWeight: '800' },
  rowName: { flex: 1, color: TEXT_PRIMARY, fontSize: 14, fontWeight: '700' },
  rowXp: { color: PURPLE_PRIMARY, fontSize: 16, fontWeight: '800' },
});
