import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionHeader } from './SectionHeader';
import { PURPLE_PRIMARY, PURPLE_SOFT, GOLD_PRIMARY } from '../../../constants/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const players = [
  { id: 1, name: 'Haaland',   team: 'Man City',    flag: '🇳🇴', position: 'ST',  positionColor: '#FF7A3D', weeklyRating: '9.12', overallRating: '9.40', avatar: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', borderColor: '#FF7A3D' },
  { id: 2, name: 'Mbappé',    team: 'Real Madrid', flag: '🇫🇷', position: 'LW',  positionColor: '#11998E', weeklyRating: '8.81', overallRating: '9.10', avatar: 'https://images.unsplash.com/photo-1653324502559-ae8d4aa4dd57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', borderColor: '#11998E' },
  { id: 4, name: 'De Bruyne', team: 'Man City',    flag: '🇧🇪', position: 'CM',  positionColor: '#8E54E9', weeklyRating: '7.01', overallRating: '9.10', avatar: 'https://images.unsplash.com/photo-1710788617743-8b9ed4143325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', borderColor: '#8E54E9' },
  { id: 5, name: 'Saka',      team: 'Arsenal',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'RW',  positionColor: '#F5576C', weeklyRating: '7.81', overallRating: '8.70', avatar: 'https://images.unsplash.com/photo-1705593973313-75de7bf95b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', borderColor: '#F5576C' },
  { id: 6, name: 'Pedri',     team: 'Barcelona',   flag: '🇪🇸', position: 'CM',  positionColor: '#11998E', weeklyRating: '7.54', overallRating: '8.80', avatar: 'https://images.unsplash.com/photo-1774344227964-24b6f78818ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', borderColor: '#11998E' },
];

// ─── Shared shimmer ───────────────────────────────────────────────────────────
function useShimmer() {
  const shimmerX = useSharedValue(-SCREEN_WIDTH);
  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(SCREEN_WIDTH, { duration: 1200, easing: Easing.linear }), -1, false
    );
  }, []);
  return shimmerX;
}

// ─── Skeleton Player Card ─────────────────────────────────────────────────────
function SkeletonPlayerCard({ shimmerX }: { shimmerX: ReturnType<typeof useSharedValue<number>> }) {
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));
  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 16 }]}>
        <Animated.View style={[styles.shimmerStrip, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: 80, height: '100%' }}
          />
        </Animated.View>
      </Animated.View>
      {/* Top rating badges */}
      <View style={styles.skeletonTopRow}>
        <View style={[styles.skeletonCircleSm]} />
        <View style={[styles.skeletonCircleSm]} />
      </View>
      {/* Avatar */}
      <View style={styles.skeletonAvatar} />
      {/* Name + team lines */}
      <View style={{ gap: 5, alignItems: 'center', marginTop: 6 }}>
        <View style={[styles.skeletonLine, { width: 70, height: 8 }]} />
        <View style={[styles.skeletonLine, { width: 50, height: 7 }]} />
      </View>
      {/* Position pill */}
      <View style={[styles.skeletonLine, { width: 40, height: 20, borderRadius: 8, marginTop: 6 }]} />
    </View>
  );
}

// ─── Rating Badge ─────────────────────────────────────────────────────────────
function RatingBadge({ value, color }: { value: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '45' }]}>
      <Text style={[styles.badgeText, { color }]}>{value}</Text>
    </View>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({ player }: { player: typeof players[0] }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <View style={[styles.topAccent, { backgroundColor: player.borderColor + '30' }]} />
      <View style={styles.ratingsRow}>
        <RatingBadge value={player.weeklyRating} color={player.borderColor} />
        <RatingBadge value={player.overallRating} color={GOLD_PRIMARY} />
      </View>
      {/* Avatar ring with glow */}
      <View style={[styles.avatarRing, {
        borderColor: player.borderColor,
        shadowColor: player.borderColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
      }]}>
        <Image source={{ uri: player.avatar }} style={styles.avatar} resizeMode="cover" />
      </View>
      <Text style={styles.playerName}>{player.name}</Text>
      <View style={styles.teamRow}>
        <Text style={styles.flag}>{player.flag}</Text>
        <Text style={styles.teamName}>{player.team}</Text>
      </View>
      <View style={[styles.positionBadge, { backgroundColor: player.positionColor + '1a', borderColor: player.positionColor + '38' }]}>
        <Text style={[styles.positionText, { color: player.positionColor }]}>{player.position}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty Player Card — premium (3 shown when no data) ──────────────────────
function EmptyPlayerCard() {
  return (
    <View style={styles.emptyCard}>
      {/* Rating badge placeholders */}
      <View style={styles.ratingsRow}>
        <View style={[styles.skeletonLine, { width: 36, height: 20, borderRadius: 6 }]} />
        <View style={[styles.skeletonLine, { width: 36, height: 20, borderRadius: 6 }]} />
      </View>
      {/* Avatar ring */}
      <View style={styles.emptyAvatarRing}>
        <Text style={styles.emptyAvatarIcon}>👤</Text>
      </View>
      <Text style={styles.emptyCardName}>---</Text>
      <View style={styles.teamRow}>
        <Text style={styles.emptyCardTeam}>TBD</Text>
      </View>
      <View style={styles.emptyPositionBadge}>
        <Text style={styles.emptyPositionText}>?</Text>
      </View>
    </View>
  );
}

// ─── Empty Section — premium 3-ring pattern ──────────────────────────────────
function EmptySection() {
  return (
    <View style={styles.emptySection}>
      <View style={styles.emptySectionGlow} />
      <View style={styles.emptySectionIconWrap}>
        <View style={styles.emptySectionRing2} />
        <View style={styles.emptySectionRing1} />
        <View style={styles.emptySectionIconBox}>
          <Text style={styles.emptySectionEmoji}>⭐</Text>
        </View>
      </View>
      <Text style={styles.emptySectionTitle}>لا يوجد لاعبون هذا الأسبوع</Text>
      <Text style={styles.emptySectionSub}>يتم تحديث التصنيفات كل إثنين</Text>
      <View style={styles.emptySectionDivider} />
      <View style={styles.emptySectionChip}>
        <Text style={styles.emptySectionChipText}>📅  يتجدد كل إثنين</Text>
      </View>
    </View>
  );
}

// ─── Player List ──────────────────────────────────────────────────────────────
interface PlayerListProps {
  isLoading?: boolean;
}

export function PlayerList({ isLoading = false }: PlayerListProps) {
  const hasPlayers = players.length > 0;
  const shimmerX = useShimmer();

  return (
    <View style={styles.section}>
      <SectionHeader icon="⭐" title="Player of the Week" action="View All" />
      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={false}
        >
          <SkeletonPlayerCard shimmerX={shimmerX} />
          <SkeletonPlayerCard shimmerX={shimmerX} />
          <SkeletonPlayerCard shimmerX={shimmerX} />
        </ScrollView>
      ) : hasPlayers ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews
        >
          {players.map(p => <PlayerCard key={p.id} player={p} />)}
          {/* Empty slot */}
          <EmptyPlayerCard />
        </ScrollView>
      ) : (
        // Show 3 empty cards when API returns no players
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <EmptyPlayerCard />
          <EmptyPlayerCard />
          <EmptyPlayerCard />
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 4, gap: 12 },

  // ── Skeleton ──────────────────────────────────────────────────────────────
  skeletonCard: {
    width: 114, height: 158, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)',
    flexShrink: 0, alignItems: 'center',
    paddingTop: 8, paddingBottom: 10, paddingHorizontal: 8,
    overflow: 'hidden', gap: 0,
  },
  shimmerStrip: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  skeletonLine: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4 },
  skeletonTopRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 7 },
  skeletonCircleSm: { width: 33, height: 20, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  skeletonAvatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 4 },

  // ── Player Card ───────────────────────────────────────────────────────────
  card: {
    width: 114, height: 158, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0, alignItems: 'center',
    paddingTop: 8, paddingBottom: 10, paddingHorizontal: 8,
    overflow: 'hidden', position: 'relative',
  },
  topAccent: { position: 'absolute', top: -30, alignSelf: 'center', width: 80, height: 80, borderRadius: 40 },
  ratingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 7 },
  badge: { minWidth: 36, height: 20, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { fontSize: 9.5, fontWeight: '900', letterSpacing: 0.2 },
  avatarRing: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, overflow: 'hidden', marginBottom: 8 },
  avatar: { width: '100%', height: '100%' },
  playerName: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center', letterSpacing: -0.2, lineHeight: 15 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  flag: { fontSize: 10 },
  teamName: { color: 'rgba(255,255,255,0.4)', fontSize: 9.5, fontWeight: '500' },
  positionBadge: { marginTop: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  positionText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  // ── Empty Player Card ─────────────────────────────────────────────────────
  emptyCard: {
    width: 114, height: 158, borderRadius: 16,
    borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(10,7,18,0.95)',
    flexShrink: 0, alignItems: 'center',
    paddingTop: 8, paddingBottom: 10, paddingHorizontal: 8,
    justifyContent: 'center', gap: 5,
  },
  emptyAvatarRing: {
    width: 66, height: 66, borderRadius: 33,
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.3)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(124,58,237,0.06)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyAvatarIcon: { fontSize: 22, color: 'rgba(255,255,255,0.2)' },
  emptyCardName: { color: 'rgba(255,255,255,0.2)', fontSize: 13, fontWeight: '700' },
  emptyCardTeam: { color: 'rgba(255,255,255,0.15)', fontSize: 9.5, fontWeight: '500' },
  emptyPositionBadge: {
    marginTop: 4, borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  emptyPositionText: { color: 'rgba(167,139,250,0.3)', fontSize: 10, fontWeight: '800' },

  // ── Empty Section — premium ───────────────────────────────────────────────
  emptySection: {
    marginHorizontal: 16, paddingVertical: 44, paddingHorizontal: 24,
    alignItems: 'center', borderRadius: 20,
    backgroundColor: 'rgba(10,7,18,0.95)',
    borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.2)',
    borderStyle: 'dashed', overflow: 'hidden', gap: 6,
  },
  emptySectionGlow: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(76,29,149,0.12)', top: -60,
  },
  emptySectionIconWrap: {
    width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  emptySectionRing2: {
    position: 'absolute', width: 72, height: 72, borderRadius: 36,
    borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.15)', borderStyle: 'dashed',
  },
  emptySectionRing1: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 0.5, borderColor: 'rgba(59,130,246,0.15)',
  },
  emptySectionIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  emptySectionEmoji: { fontSize: 22, opacity: 0.7 },
  emptySectionTitle: {
    color: 'rgba(167,139,250,0.8)', fontSize: 16, fontWeight: '700',
    letterSpacing: -0.2, marginTop: 2,
  },
  emptySectionSub: {
    color: 'rgba(255,255,255,0.25)', fontSize: 12,
    textAlign: 'center', lineHeight: 18,
  },
  emptySectionDivider: {
    width: 40, height: 0.5,
    backgroundColor: 'rgba(124,58,237,0.25)', marginVertical: 10,
  },
  emptySectionChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderWidth: 0.5, borderColor: 'rgba(124,58,237,0.25)',
  },
  emptySectionChipText: {
    color: 'rgba(167,139,250,0.6)', fontSize: 11, fontWeight: '600', letterSpacing: 0.3,
  },
});
