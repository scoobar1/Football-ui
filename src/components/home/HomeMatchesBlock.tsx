import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Bell, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SectionHeader } from './SectionHeader';
import { PURPLE_PRIMARY, SCREEN_PADDING_H, TEXT_PRIMARY } from '../../../constants/tokens';

type MiniFixture = {
  id: string;
  home: string;
  away: string;
  hs: number;
  as: number;
  minute?: string;
  live?: boolean;
};

type MiniLeague = {
  id: string;
  title: string;
  dot: string;
  rows: MiniFixture[];
};

const MINI_GROUPS: MiniLeague[] = [
  {
    id: 'ucl',
    title: 'UEFA Champions League',
    dot: '#8b5cf6',
    rows: [
      { id: '1', home: 'Real Madrid', away: 'Bayern Munich', hs: 2, as: 1, minute: "78'", live: true },
      { id: '2', home: 'Arsenal', away: 'Atlético Madrid', hs: 3, as: 0 },
    ],
  },
  {
    id: 'epl',
    title: 'Premier League',
    dot: '#ffffff',
    rows: [
      { id: '3', home: 'Man City', away: 'Liverpool', hs: 1, as: 1, minute: "64'", live: true },
      { id: '4', home: 'Tottenham', away: 'Chelsea', hs: 2, as: 2 },
    ],
  },
];

function MiniRow({ row }: { row: MiniFixture }) {
  return (
    <View style={styles.row}>
      <Star size={14} color="rgba(255,255,255,0.35)" />
      <View style={styles.rowMid}>
        <Text style={styles.team} numberOfLines={1}>{row.home}</Text>
        <View style={styles.scoreWrap}>
          {row.live ? <Text style={styles.liveBadge}>LIVE</Text> : <Text style={styles.ftBadge}>FT</Text>}
          <Text style={styles.score}>{row.hs}-{row.as}</Text>
          <Text style={styles.minute}>{row.minute ?? ''}</Text>
        </View>
        <Text style={styles.team} numberOfLines={1}>{row.away}</Text>
      </View>
      <Bell size={14} color="rgba(255,255,255,0.35)" />
    </View>
  );
}

export function HomeMatchesBlock() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <SectionHeader subtitle="Live & fixtures" title="Live scores" action="View all" onAction={() => router.push('/matches')} />
      <View style={styles.wrap}>
        {MINI_GROUPS.map((g) => (
          <View key={g.id} style={styles.card}>
            <View style={styles.cardHead}>
              <View style={styles.leagueLeft}>
                <Circle size={8} fill={g.dot} color={g.dot} />
                <Text style={styles.leagueTitle}>{g.title}</Text>
              </View>
              <Text style={styles.liveTxt}>Live</Text>
            </View>
            {g.rows.map((row) => (
              <MiniRow key={row.id} row={row} />
            ))}
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/matches')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 0 },
  wrap: { paddingHorizontal: SCREEN_PADDING_H, gap: 10 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(9,7,16,0.94)',
    overflow: 'hidden',
  },
  cardHead: {
    height: 38,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leagueLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  leagueTitle: { color: TEXT_PRIMARY, fontSize: 14, fontWeight: '700' },
  liveTxt: { color: PURPLE_PRIMARY, fontSize: 13, fontWeight: '700' },
  row: {
    minHeight: 44,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowMid: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  team: { color: 'rgba(255,255,255,0.86)', fontSize: 12, fontWeight: '600', width: '34%' },
  scoreWrap: { width: '32%', alignItems: 'center' },
  liveBadge: { color: '#ef4444', fontSize: 10, fontWeight: '800' },
  ftBadge: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '800' },
  score: { color: '#fff', fontSize: 20, lineHeight: 22, fontWeight: '900', letterSpacing: -0.5 },
  minute: { color: PURPLE_PRIMARY, fontSize: 11, fontWeight: '700', minHeight: 14 },
  viewAll: {
    textAlign: 'center',
    color: PURPLE_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 8,
  },
});
