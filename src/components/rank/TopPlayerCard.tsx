import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface TopPlayerCardProps {
  name: string;
  xp: string;
  place: 1 | 2 | 3;
  avatarUri: string;
}

const placeColors = {
  1: {
    gradient: ['#2A1E00', '#1A1000'] as [string, string],
    border: '#FFD700',
    badge: '#FFD700',
    badgeText: '#000',
    xpColor: '#A855F7',
    avatarBorder: '#FFD700',
  },
  2: {
    gradient: ['#17112F', '#0A0818'] as [string, string],
    border: '#2A1A5A',
    badge: '#C0C0C0',
    badgeText: '#000',
    xpColor: '#A855F7',
    avatarBorder: '#C0C0C0',
  },
  3: {
    gradient: ['#17112F', '#0A0818'] as [string, string],
    border: '#2A1A5A',
    badge: '#CD7F32',
    badgeText: '#fff',
    xpColor: '#A855F7',
    avatarBorder: '#CD7F32',
  },
};

export default function TopPlayerCard({ name, xp, place, avatarUri }: TopPlayerCardProps) {
  const colors = placeColors[place];
  const isFirst = place === 1;

  return (
    <LinearGradient
      colors={colors.gradient}
      style={[styles.card, isFirst && styles.firstCard, { borderColor: colors.border }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Crown for 1st */}
      {isFirst && (
        <View style={styles.crownContainer}>
          <Text style={styles.crown}>👑</Text>
        </View>
      )}

      {/* Avatar */}
      <View style={[styles.avatarWrapper, isFirst && styles.firstAvatarWrapper]}>
        <Image
          source={{ uri: avatarUri }}
          style={[styles.avatar, isFirst && styles.firstAvatar, { borderColor: colors.avatarBorder }]}
        />
        {/* Place badge */}
        <View style={[styles.badge, { backgroundColor: colors.badge }]}>
          <Text style={[styles.badgeText, { color: colors.badgeText }]}>{place}</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={[styles.xp, { color: colors.xpColor }]}>{xp}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 108,
    borderRadius: 22,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    height: 185,
    justifyContent: 'flex-start',
  },
  firstCard: {
    height: 215,
    width: 118,
    paddingTop: 28,
  },
  crownContainer: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
  },
  crown: {
    fontSize: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  firstAvatarWrapper: {
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#2A1A5A',
  },
  firstAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    marginLeft: -11,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  name: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  xp: {
    fontWeight: '800',
    fontSize: 12,
  },
});