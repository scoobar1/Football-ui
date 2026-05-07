import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Star, ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { MainShell } from '../../components/shell/MainShell';
import { TEXT_PRIMARY, TEXT_MUTED, PURPLE_PRIMARY } from '../../../constants/tokens';

const FILTERS = ['All', 'Live', 'Today', 'Yesterday', 'Tomorrow'] as const;

type Fixture = {
  id: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'FT';
  minute?: string;
  live?: boolean;
};

type LeagueGroup = {
  id: string;
  league: string;
  leagueLogo: string;
  accent: string;
  liveLabel: string;
  fixtures: Fixture[];
};

const GROUPS: LeagueGroup[] = [
  {
    id: 'ucl',
    league: 'UEFA Champions League',
    leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg',
    accent: '#8b5cf6',
    liveLabel: 'Live',
    fixtures: [
      { id: 'ucl-1', home: 'Real Madrid', away: 'Bayern Munich', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg', homeScore: 2, awayScore: 1, status: 'LIVE', minute: "78'", live: true },
      { id: 'ucl-2', home: 'Arsenal', away: 'Atlético Madrid', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg', homeScore: 3, awayScore: 0, status: 'FT' },
    ],
  },
  {
    id: 'epl',
    league: 'Premier League',
    leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    accent: '#ffffff',
    liveLabel: 'Live',
    fixtures: [
      { id: 'epl-1', home: 'Manchester City', away: 'Liverpool', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', homeScore: 1, awayScore: 1, status: 'LIVE', minute: "64'", live: true },
      { id: 'epl-2', home: 'Tottenham', away: 'Chelsea', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', homeScore: 2, awayScore: 2, status: 'FT' },
    ],
  },
  {
    id: 'laliga',
    league: 'LaLiga',
    leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/9/92/LaLiga_Santander.svg',
    accent: '#f59e0b',
    liveLabel: 'Live',
    fixtures: [
      { id: 'll-1', home: 'Barcelona', away: 'Real Sociedad', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg', homeScore: 3, awayScore: 1, status: 'LIVE', minute: "72'", live: true },
      { id: 'll-2', home: 'Real Betis', away: 'Sevilla', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg', homeScore: 1, awayScore: 0, status: 'FT' },
    ],
  },
];

function MatchRow({ fixture }: { fixture: Fixture }) {
  return (
    <View style={styles.rowWrap}>
      <TouchableOpacity style={styles.rowIcon} activeOpacity={0.7}>
        <Star size={16} color="rgba(255,255,255,0.45)" />
      </TouchableOpacity>
      <View style={styles.rowBody}>
        <View style={styles.teamCol}>
          <View style={styles.logoStub}>
            <Image source={{ uri: fixture.homeLogo }} style={styles.teamLogo} resizeMode="contain" />
          </View>
          <Text style={styles.teamTxt} numberOfLines={1}>{fixture.home}</Text>
        </View>
        <View style={styles.scoreCol}>
          {fixture.live ? <Text style={styles.liveBadge}>LIVE</Text> : <Text style={styles.ftBadge}>FT</Text>}
          <Text style={styles.scoreTxt}>
            {fixture.homeScore} <Text style={styles.scoreDash}>-</Text> {fixture.awayScore}
          </Text>
          <Text style={styles.minuteTxt}>{fixture.minute ?? ''}</Text>
        </View>
        <View style={styles.teamCol}>
          <View style={styles.logoStub}>
            <Image source={{ uri: fixture.awayLogo }} style={styles.teamLogo} resizeMode="contain" />
          </View>
          <Text style={styles.teamTxt} numberOfLines={1}>{fixture.away}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.rowIcon} activeOpacity={0.7}>
        <Bell size={16} color="rgba(255,255,255,0.45)" />
      </TouchableOpacity>
    </View>
  );
}

function LeagueCard({ group }: { group: LeagueGroup }) {
  return (
    <View style={styles.leagueCard}>
      <View style={styles.leagueHead}>
        <View style={styles.leagueLeft}>
          <View style={styles.leagueLogoWrap}>
            <Image source={{ uri: group.leagueLogo }} style={styles.leagueLogo} resizeMode="contain" />
          </View>
          <Text style={styles.leagueTitle}>{group.league}</Text>
        </View>
        <View style={styles.leagueRight}>
          <Text style={styles.leagueLive}>{group.liveLabel}</Text>
          <ChevronDown size={15} color="rgba(255,255,255,0.45)" />
        </View>
      </View>
      {group.fixtures.map((fixture) => (
        <MatchRow key={fixture.id} fixture={fixture} />
      ))}
      <TouchableOpacity activeOpacity={0.8} style={styles.viewAllBtn}>
        <Text style={styles.viewAllTxt}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MatchesHubScreenV2() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const groups = useMemo(() => {
    if (filter === 'Live') {
      return GROUPS.map((g) => ({ ...g, fixtures: g.fixtures.filter((f) => f.live) })).filter((g) => g.fixtures.length);
    }
    return GROUPS;
  }, [filter]);

  return (
    <MainShell title="Live Scores" subtitle="Stay updated with every match">
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.85} style={[styles.tabChip, active && styles.tabChipActive]}>
                {active ? (
                  <LinearGradient colors={[PURPLE_PRIMARY, '#9333ea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                ) : null}
                <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{f}</Text>
                {f === 'Live' && filter !== 'Live' ? <View style={styles.liveDot} /> : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
          <SlidersHorizontal size={18} color="rgba(255,255,255,0.72)" />
        </TouchableOpacity>
      </View>

      <View style={styles.groupsWrap}>
        {groups.map((group) => (
          <LeagueCard key={group.id} group={group} />
        ))}
      </View>
    </MainShell>
  );
}

const styles = StyleSheet.create({
  tabsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  tabsScroll: { gap: 8, paddingRight: 6 },
  tabChip: {
    minWidth: 62, height: 38, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 14, overflow: 'hidden', flexDirection: 'row', gap: 6,
  },
  tabChipActive: { borderColor: 'rgba(167,139,250,0.55)' },
  tabTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '700', zIndex: 1 },
  tabTxtActive: { color: '#fff' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444' },
  filterBtn: {
    width: 42, height: 38, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center',
  },
  groupsWrap: { gap: 14 },
  leagueCard: {
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(9,7,16,0.95)', overflow: 'hidden',
  },
  leagueHead: {
    height: 44, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  leagueLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  leagueLogoWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leagueLogo: { width: 14, height: 14 },
  leagueTitle: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '700' },
  leagueRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  leagueLive: { color: PURPLE_PRIMARY, fontSize: 14, fontWeight: '700' },
  rowWrap: {
    minHeight: 96, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowIcon: { width: 24, alignItems: 'center', justifyContent: 'center' },
  rowBody: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8,
  },
  teamCol: { width: '34%', alignItems: 'center', gap: 6 },
  logoStub: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  teamLogo: { width: 24, height: 24 },
  teamTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600', maxWidth: '100%' },
  scoreCol: { width: '32%', alignItems: 'center' },
  liveBadge: { color: '#ef4444', fontSize: 12, fontWeight: '800' },
  ftBadge: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '800' },
  scoreTxt: {
    marginTop: 3, color: '#fff', fontSize: 36, lineHeight: 38, fontWeight: '900',
    letterSpacing: -1, fontVariant: ['tabular-nums'],
  },
  scoreDash: { color: 'rgba(255,255,255,0.45)' },
  minuteTxt: { marginTop: 2, color: PURPLE_PRIMARY, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  viewAllBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  viewAllTxt: { color: PURPLE_PRIMARY, fontSize: 16, fontWeight: '700' },
});
