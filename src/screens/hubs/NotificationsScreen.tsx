import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Text } from '@/src/components/common/AppText';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Bell, Trophy, Sparkles, Users } from 'lucide-react-native';
import { MainShell } from '../../components/shell/MainShell';
import {
  TEXT_PRIMARY,
  TEXT_MUTED,
  GOLD_PRIMARY,
  BLUE_PRIMARY,
  PURPLE_SOFT,
  BORDER_ARENA,
  RADIUS_LG,
} from '../../../constants/tokens';

type Kind = 'match' | 'quiz' | 'social' | 'system';

type Row = {
  id: string;
  kind: Kind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const INITIAL_ROWS: Row[] = [
  {
    id: '1',
    kind: 'match',
    title: 'Kickoff reminder',
    body: 'Arsenal vs Chelsea starts in 45 minutes.',
    time: '12m',
    unread: true,
  },
  {
    id: '2',
    kind: 'quiz',
    title: 'Daily streak',
    body: 'You are one round away from the 10-day crest.',
    time: '2h',
    unread: true,
  },
  {
    id: '3',
    kind: 'social',
    title: 'New follow',
    body: 'Sara started following your highlights.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    kind: 'system',
    title: 'Weekly rank reset',
    body: 'Leaderboard refreshes Sunday 00:00 UTC.',
    time: '2d',
    unread: false,
  },
];

const KIND_META: Record<Kind, { Icon: LucideIcon; color: string }> = {
  match: { Icon: Trophy, color: GOLD_PRIMARY },
  quiz: { Icon: Sparkles, color: PURPLE_SOFT },
  social: { Icon: Users, color: BLUE_PRIMARY },
  system: { Icon: Bell, color: TEXT_MUTED },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[]>(INITIAL_ROWS);

  const markAllRead = () => {
    setRows((prev) => prev.map((r) => ({ ...r, unread: false })));
  };

  return (
    <MainShell
      title="Notifications"
      subtitle="Mock inbox — wire push and in-app feeds when the backend is ready."
      onBackPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1400&q=80' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(8,6,14,0.45)', 'rgba(8,6,14,0.8)', 'rgba(8,6,14,0.96)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroEyebrow}>Inbox</Text>
            <Text style={styles.heroTitle}>
              {rows.filter((r) => r.unread).length} unread · {rows.length} total
            </Text>
          </View>
          <View style={styles.heroBellWrap}>
            <Bell size={20} color={PURPLE_SOFT} strokeWidth={2.4} />
          </View>
        </View>
      </ImageBackground>

      <TouchableOpacity activeOpacity={0.85} style={styles.markRow} onPress={markAllRead}>
        <LinearGradient
          colors={['rgba(124,58,237,0.18)', 'rgba(76,29,149,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.markRowBg}
        />
        <Text style={styles.markTxt}>Mark all as read</Text>
      </TouchableOpacity>

      {rows.map((row) => {
        const { Icon, color } = KIND_META[row.kind];
        return (
          <View key={row.id} style={[styles.card, row.unread && styles.cardUnread]}>
            <View style={[styles.iconWrap, { borderColor: `${color}44` }]}>
              <Icon size={18} color={color} strokeWidth={2.2} />
            </View>
            <View style={styles.cardMid}>
              <Text style={styles.cardTitle}>{row.title}</Text>
              <Text style={styles.cardBody}>{row.body}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.time}>{row.time}</Text>
              {row.unread ? <View style={styles.dot} /> : null}
            </View>
          </View>
        );
      })}
    </MainShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_ARENA,
    minHeight: 92,
  },
  heroImage: { opacity: 0.93 },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBellWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
    backgroundColor: 'rgba(10,8,18,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.35,
  },

  markRow: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
  },
  markRowBg: {
    ...StyleSheet.absoluteFillObject,
  },
  markTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: PURPLE_SOFT,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 10,
    borderRadius: RADIUS_LG,
    borderWidth: 1,
    borderColor: BORDER_ARENA,
    backgroundColor: 'rgba(16,12,26,0.9)',
  },
  cardUnread: {
    borderColor: 'rgba(124,58,237,0.35)',
    backgroundColor: 'rgba(34,22,52,0.85)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,6,14,0.82)',
  },
  cardMid: { flex: 1, marginHorizontal: 10 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  cardBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_MUTED,
  },
  cardRight: { alignItems: 'flex-end', minWidth: 52 },
  time: { fontSize: 11, fontWeight: '600', color: TEXT_MUTED },
  dot: {
    marginTop: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PURPLE_SOFT,
  },
});
